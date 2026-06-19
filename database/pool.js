const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const certPath = path.join(__dirname, "../global-bundle.pem");
const ca = fs.readFileSync(certPath).toString().split(/(?=-----BEGIN CERTIFICATE-----)/);

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca,
  },
};

module.exports = new Pool(config);
