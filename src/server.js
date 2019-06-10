"use strict";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

const userRouter = require("./routers/user");
const tweetRouter = require("./routers/tweet");

const {
  ALLOWED_DOMAINS,
  DATABASE_USER,
  DATABASE_PASSWORD
} = require("../configs/app");

class Server {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.initializeDb();
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

    this.app.use(morgan("tiny"));
  }

  routes() {
    this.app.use("/api/user", userRouter);
    this.app.use("/api/tweet", tweetRouter);

    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next();
      }

      if (err) {
        const response = err.toJSON();
        return res.status(err.status).send(response);
      }
    });
  }

  initializeDb() {
    mongoose.connect(
      `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:27017/postman`,
      {
        useNewUrlParser: true
      }
    );
  }
}

module.exports = new Server().app;
