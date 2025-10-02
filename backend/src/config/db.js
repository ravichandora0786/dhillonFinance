import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const {
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
} = process.env;

// Determine path to cert file
const caPath = path.join(__dirname, "../certs/ca.pem"); 
// Note: __dirname refers to folder of current file (like src/config if db.js is there)

let caCert;
try {
  caCert = fs.readFileSync(caPath, "utf8");
} catch (err) {
  console.error("Could not read CA cert from:", caPath, err);
  // Maybe throw error, because without CA, SSL connection may fail
  throw err;
}

async function ensureDatabaseExists() {
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
  } catch (err) {
    console.error("Error in ensureDatabaseExists:", err);
    throw err;
  }
}

// Only run create DB if not production (or adjust as you like)
if (NODE_ENV !== "production") {
  (async () => {
    await ensureDatabaseExists();
  })();
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      ca: caCert,
      rejectUnauthorized: true,
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

export const umzugSeeding = new Umzug({
  migrations: { glob: "src/seeders/*.{js,cjs}" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export default sequelize;
