"use strict";

const jwt = require("jsonwebtoken");
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

module.exports = {
  isAuthorized
};
