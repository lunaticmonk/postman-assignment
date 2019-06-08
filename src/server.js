"use strict";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const { ALLOWED_DOMAINS } = require("../configs/app");

class Server {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    const corsOptions = {
      origin: ALLOWED_DOMAINS,
      credentials: true,
      optionsSuccessStatus: 200
    };
    this.app.use(cors(corsOptions));
  }
}

module.exports = new Server().app;
