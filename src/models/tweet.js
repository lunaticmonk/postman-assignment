"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = Schema(
  {
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
