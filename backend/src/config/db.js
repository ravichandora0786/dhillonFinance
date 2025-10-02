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

// Read the CA certificate
let caCert;
try {
  caCert = fs.readFileSync(caPath, "utf8");
} catch (err) {
  console.error("Could not read CA cert from:", caPath, err);
  throw err;
}

// Function to ensure the database exists (only for local/dev)
async function ensureDatabaseExists() {
  if (NODE_ENV === "production") return; // Skip in production

  try {
    const connOptions = {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      connectTimeout: 10000,
      ssl: {
        ca: caCert,
      },
    };

    const connection = await mysql.createConnection(connOptions);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(`Database '${DB_NAME}' ensured.`);
  } catch (err) {
    console.error("Error in ensureDatabaseExists:", err);
    throw err;
  }
}

// Ensure DB exists (for non-production)
// if (NODE_ENV !== "production") {
//   ensureDatabaseExists().catch((err) => {
//     console.error("DB initialization failed:", err);
//     process.exit(1); // Exit app if DB can't be created
//   });
// }

// Initialize Sequelize with SSL options
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      ca: caCert,
      rejectUnauthorized: true, // Required for Aiven
    },
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
