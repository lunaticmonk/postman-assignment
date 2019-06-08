"use strict";

const dotenv = require("dotenv");
dotenv.config();

const { APP_PORT, ALLOWED_DOMAINS } = process.env;

const configs = {
  APP_PORT,
  ALLOWED_DOMAINS
};

module.exports = configs;
