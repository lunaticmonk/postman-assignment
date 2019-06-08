"use strict";

const ApiError = require("./api");

class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.status = 404;
    this.message = message || "The requested resource can't be found.";
  }
}

module.exports = NotFoundError;
