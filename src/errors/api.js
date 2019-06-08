"use strict";

class ApiError extends Error {
  constructor(message) {
    super();
    this.status = 500;
    this.message = message || "An unknown error occurred.";
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message
    };
  }
}

module.exports = ApiError;
