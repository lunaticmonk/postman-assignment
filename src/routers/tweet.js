/**
 * Contains all the endpoints of the tweet resource.
 */

"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Tweet Resource");
});

module.exports = router;
