/**
 * Contains all the endpoints of the tweet resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

const { body, header } = require("express-validator/check");
const {
  createTweet,
  getTweet,
  deleteTweet,
  likeTweet,
  unlikeTweet
} = require("../controllers/tweet");

const { isAuthorized, isOwnerOfTweet } = require("../policies/policy");

router.get("/", (req, res) => {
  res.status(200).send("Tweet Resource");
});

router.post(
  "/create",
  [
    header("access-token")
      .exists()
      .trim()
      .withMessage("accessToken is required"),
    body("body")
      .exists()
      .trim()
      .withMessage("Tweet body is required in the request body")
      .isLength({ max: 140 })
      .withMessage("Tweet body limited to a max of 140 characters")
  ],
  isAuthorized,
  createTweet
);

router.patch(
  "/:id/like",
  [
    header("access-token")
      .exists()
      .trim()
      .withMessage("accessToken is required")
  ],
  isAuthorized,
  likeTweet
);

router.patch(
  "/:id/unlike",
  [
    header("access-token")
      .exists()
      .trim()
      .withMessage("accessToken is required")
  ],
  isAuthorized,
  unlikeTweet
);

router.get("/:id", getTweet);

router.delete("/:id", isAuthorized, isOwnerOfTweet, deleteTweet);

module.exports = router;
