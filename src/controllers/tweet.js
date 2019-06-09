/**
 * Tweet controller.
 * Contains all the business logic executed after
 * hitting any tweet endpoint in routes.
 *
 */

"use strict";

const { validationResult } = require("express-validator/check");

const Tweet = require("../models/Tweet");
const { getUserFromAccessToken } = require("../controllers/user");

const ApiError = require("../errors/api");
const UnprocessableRequestError = require("../errors/unprocessablerequest");
const NotFoundError = require("../errors/notfound");

async function createTweet(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new UnprocessableRequestError(err.mapped()));
  }
  try {
    const { body } = req.body;
    const accessToken = req.header("access-token");
    const user = await getUserFromAccessToken(accessToken);
    const author = user._id;

    const newTweet = new Tweet({
      body,
      author
    });
    const tweet = await newTweet.save();

    const response = {
      tweet: {
        _id: tweet._id,
        body: tweet.body,
        author: tweet.author
      },
      message: `Tweet posted successfully`,
      status: 201
    };

    return res.status(response.status).send(response);
  } catch (error) {
    const err = new ApiError("Failure posting the tweet.");
    return res.status(err.status).send(err);
  }
}

async function getTweet(req, res, next) {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findOne({ _id: id }).populate(
      "author",
      "username followers following"
    );

    if (tweet) {
      const response = {
        tweet: {
          _id: tweet._id,
          body: tweet.body,
          author: tweet.author
        },
        message: `Tweet returned successfully`,
        status: 200
      };
      return res.status(response.status).send(response);
    }
    const err = new NotFoundError("Tweet not found");
    return res.status(err.status).send(err);
  } catch (error) {
    const err = new ApiError("Failure getting the tweet. Unknown error.");
    return res.status(err.status).send(err);
  }
}

async function deleteTweet(req, res, next) {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findOneAndDelete({ _id: id });

    const response = {
      message: `Tweet deleted`,
      status: 200
    };
    return res.status(response.status).send(response);
  } catch (error) {
    const err = new ApiError(
      `Tweet could not be deleted. It may have deleted already. Unknown error.`
    );
    return res.status(err.status).send(err);
  }
}

async function likeTweet(req, res, next) {
  try {
    const { id: tweetId } = req.params;
    const accessToken = req.header("access-token");
    const user = await getUserFromAccessToken(accessToken);

    const tweet = await Tweet.findOne({ _id: tweetId });

    if (!tweet) {
      const err = new NotFoundError(`Tweet not found`);
      return res.status(err.status).send(err);
    } else {
      if (!tweet.likes.includes(user._id)) {
        tweet.likes.push(user._id);
        await tweet.save();
      }

      const response = {
        tweet: {
          _id: tweet._id,
          body: tweet.body,
          author: tweet.author,
          likes: tweet.likes
        },
        message: `Tweet liked successfully`,
        status: 200
      };

      return res.status(response.status).send(response);
    }
    const err = new ApiError();
    return res.status(err.status).send(err);
  } catch (error) {
    const err = new ApiError("Failure liking the tweet. Tweet not available.");
    return res.status(err.status).send(err);
  }
}

async function unlikeTweet(req, res, next) {
  try {
    const { id: tweetId } = req.params;
    const accessToken = req.header("access-token");
    const user = await getUserFromAccessToken(accessToken);

    const tweet = await Tweet.findOne({ _id: tweetId });

    if (!tweet) {
      const err = new NotFoundError(`Tweet not found`);
      return res.status(err.status).send(err);
    } else {
      if (tweet.likes.includes(user._id)) {
        let index = tweet.likes.indexOf(user._id);
        tweet.likes.splice(index);
        await tweet.save();
      }

      const response = {
        tweet: {
          _id: tweet._id,
          body: tweet.body,
          author: tweet.author,
          likes: tweet.likes
        },
        message: `Tweet unliked successfully`,
        status: 200
      };

      return res.status(response.status).send(response);
    }
    const err = new ApiError();
    return res.status(err.status).send(err);
  } catch (error) {
    const err = new ApiError(
      "Failure unliking the tweet. Tweet not available."
    );
    return res.status(err.status).send(err);
  }
}

module.exports = {
  createTweet,
  getTweet,
  deleteTweet,
  likeTweet,
  unlikeTweet
};
