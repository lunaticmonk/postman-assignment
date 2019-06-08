"use strict";

const ApiError = require("./api");

class UnprocessableRequestError extends ApiError {
  constructor(message) {
    super();
    this.status = 422;
    this.message = message || "The server cannot process the request.";
  }
}

module.exports = UnprocessableRequestError;
