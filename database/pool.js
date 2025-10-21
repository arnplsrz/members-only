const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
