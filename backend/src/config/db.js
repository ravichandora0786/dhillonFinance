import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import mysql from "mysql2/promise";

const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;
console.log("DB_PORT:", DB_PORT);

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
}

// Run DB create only in dev/local
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
      require: true,
      rejectUnauthorized: false,
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
