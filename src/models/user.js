"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
