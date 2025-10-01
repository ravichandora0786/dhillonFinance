/**
 * Database Configuration File with Auto-Creation
 */

import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import mysql from "mysql2/promise";

// Environment variables
const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;

console.log(DB_PORT, "DB_PORT");

// Step 1: Ensure database exists (only in development)
async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(`✅ Database "${DB_NAME}" ensured.`);
  } catch (err) {
    console.error("❌ Error ensuring database:", err.message);
    // In production we silently ignore because cloud DBs disallow CREATE DATABASE
    if (NODE_ENV === "development") throw err;
  }
}

// Step 2: Conditionally call ensureDatabaseExists
if (NODE_ENV === "development") {
  await ensureDatabaseExists();
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Aiven CA cert not needed
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

// Step 3: Configure Umzug for seeding
export const umzugSeeding = new Umzug({
  migrations: { glob: "src/seeders/*.{js,cjs}" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export default sequelize;
