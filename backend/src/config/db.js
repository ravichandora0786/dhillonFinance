// ES Module imports
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Umzug, SequelizeStorage } from "umzug";

// Get environment variables
const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define path to the CA certificate
const caPath = join(__dirname, "../certs/ca.pem");

// Read the CA certificate (optional in dev)
let caCert;
try {
  caCert = fs.readFileSync(caPath, "utf8");
  console.log("CA certificate loaded.");
} catch (err) {
  console.warn("Could not read CA cert. (This is fine in dev)");
}

// Function to ensure the database exists (only for local/dev)
async function ensureDatabaseExists() {
  if (NODE_ENV === "production") {
    console.log("Skipping DB creation in production.");
    return; // Skip in production
  }

  try {
    const connOptions = {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      connectTimeout: 10000,
      ssl: caCert
        ? { ca: caCert } // Use cert if available
        : undefined, // else no SSL for local
    };

    const connection = await mysql.createConnection(connOptions);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(` Database '${DB_NAME}' ensured (dev only).`);
  } catch (err) {
    console.error(" Error in ensureDatabaseExists:", err);
    throw err;
  }
}

// Run DB ensure step only in dev/local
await ensureDatabaseExists();

// Initialize Sequelize with SSL options
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  dialectOptions: {
    ssl:
      NODE_ENV === "production"
        ? { ca: caCert, rejectUnauthorized: true } // Force SSL in prod
        : caCert
        ? { ca: caCert } // Use cert if available in dev
        : undefined, // No SSL for plain local MySQL
  },
  logging: NODE_ENV === "production" ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test the connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected successfully.");
  } catch (err) {
    console.error("Sequelize connection failed:", err);
    process.exit(1); // Stop app if DB is unreachable
  }
})();

// Initialize Umzug for migrations/seeders
export const umzugSeeding = new Umzug({
  migrations: { glob: "src/seeders/*.{js,cjs}" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export default sequelize;
