"use strict";

const jwt = require("jsonwebtoken");
const Tweet = require("../models/Tweet");

const NotFoundError = require("../errors/notfound");

const { getUserFromAccessToken } = require("../controllers/user");
const { JWT_SECRET } = require("../../configs/app");

async function isAuthorized(req, res, next) {
  const accessToken = req.headers["access-token"];
  jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).send({
          message: `TokenExpiredError`,
          status: 401
        });
      } else {
        res.status(401).send({
          message: `Unauthorized`,
          status: 401
        });
      }
    } else {
      return next();
    }
  });
}

async function isOwnerOfTweet(req, res, next) {
  try {
    const { id: tweetId } = req.params;
    const accessToken = req.headers["access-token"];

    const user = await getUserFromAccessToken(accessToken);
    const tweet = await Tweet.findOne({ _id: tweetId }).populate(
      "author",
      "_id"
    );

    if (!tweet) {
      const err = new NotFoundError(`Tweet not available`);
      res.status(err.status).send(err);
    } else {
      const { _id: userId } = user;
      const { _id: authorId } = tweet.author;

      if (userId.toString() === authorId.toString()) {
        return next();
      } else {
        res.status(401).send({
          message: `Sorry, You don't have access to this resource.`,
          status: 401
        });
      }
    }
  } catch (error) {
    res.status(401).send({
      message: `Unauthorized`,
      status: 401
    });
  }
}

module.exports = {
  isAuthorized,
  isOwnerOfTweet
};
