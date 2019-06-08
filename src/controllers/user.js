/**
 * User controller.
 * Contains all the business logic executed after
 * hitting any user endpoint in routes.
 *
 */

"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const ApiError = require("../errors/api");
const UnprocessableRequestError = require("../errors/unprocessablerequest");
const BadRequestError = require("../errors/badrequest");

const { JWT_SECRET } = require("../../configs/app");

async function registerUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new UnprocessableRequestError(err.mapped()));
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      const response = {
        message: `User already exists. Please login to continue`,
        status: 409
      };
      return res.status(response.status).send(response);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User({
      username,
      password: hashedPassword
    });
    const _newUser = await newUser.save();

    const accessToken = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: "1d"
    });
    const refreshToken = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: "2d"
    });
    const response = {
      user: {
        _id: _newUser._id,
        username: _newUser.username
      },
      refreshToken,
      accessToken,
      message: `User registered successfully`,
      status: 201
    };

    return res.status(response.status).send(response);
  } catch (error) {
    const err = new ApiError("Failure adding new user.");
    return res.status(err.status).send(err);
  }
}

async function logInUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new UnprocessableRequestError(err.mapped()));
  }

  try {
    const { username, password } = req.body;
    const found = await User.findOne({ username });
    if (found) {
      const correct = await bcrypt.compare(password, found.password);
      if (correct) {
        const accessToken = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: "1d"
        });
        const refreshToken = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: "2d"
        });
        const response = {
          user: {
            _id: found._id,
            username: found.username
          },
          refreshToken,
          accessToken,
          message: `User with username: ${username} logged in.`,
          status: 200
        };
        return res.status(response.status).send(response);
      } else {
        const response = {
          message: `Incorrect password`,
          status: 400
        };
        return res.status(response.status).send(response);
      }
    } else {
      const response = {
        message: `User with username: ${username} does not exist. Please sign up first.`,
        status: 404
      };
      return res.status(response.status).send(response);
    }
  } catch (error) {
    const err = new ApiError(`Unable to log the user in.`);
    return res.status(err.status).send(err);
  }
}

module.exports = {
  registerUser,
  logInUser
};
