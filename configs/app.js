"use strict";

const dotenv = require("dotenv");
dotenv.config();

const {
  APP_PORT,
  ALLOWED_DOMAINS,
  DATABASE_USER,
  DATABASE_PASSWORD,
  JWT_SECRET
} = process.env;

const configs = {
  APP_PORT,
  ALLOWED_DOMAINS,
  DATABASE_USER,
  DATABASE_PASSWORD,
  JWT_SECRET
};

module.exports = configs;
