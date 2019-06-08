"use strict";

const ApiError = require("./api");

class BadRequestError extends ApiError {
  constructor(message) {
    super();
    this.status = 400;
    this.message = message || "Bad request";
  }
}

module.exports = BadRequestError;
