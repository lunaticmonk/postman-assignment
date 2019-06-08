/**
 * Contains all the endpoints of the user resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { body, header } = require("express-validator/check");
const { registerUser, logInUser, followUser } = require("../controllers/user");

const { isAuthorized } = require("../policies/policy");

router.get("/", (req, res) => {
  res.status(200).send("User Resource");
});

router.post(
  "/register",
  [
    body("username")
      .exists()
      .trim()
      .withMessage("Username is required in the request body")
      .isLength({ max: 15 })
      .withMessage("Username limited to a max of 15 characters"),
    body("password")
      .exists()
      .trim()
      .withMessage("Password is required in the request body")
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("username")
      .exists()
      .trim()
      .withMessage("Username is required in the request body")
      .isLength({ max: 15 })
      .withMessage("Username limited to a max of 15 characters"),
    body("password")
      .exists()
      .trim()
      .withMessage("Password is required in the request body")
  ],
  logInUser
);

router.patch(
  "/:id/follow",
  [
    header("access-token")
      .exists()
      .trim()
      .withMessage("accessToken is required")
  ],
  isAuthorized,
  followUser
);

module.exports = router;
