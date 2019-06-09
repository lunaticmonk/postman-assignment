"use strict";

require("dotenv").config();

const url = require("url");
const axios = require("axios");
const mongoose = require("mongoose");
const { expect } = require("chai");

const User = require("../../src/models/user");

const { API_BASE, DATABASE_PASSWORD, DATABASE_USER } = process.env;

describe("USER", () => {
  before(() => {
    mongoose.connect(
      `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:27017/postman`,
      {
        useNewUrlParser: true
      }
    );
  });

  const newUser = {
    username: "johndoe",
    password: "jcbislub"
  };

  it("should register a new user", async () => {
    const result = await axios.post(
      url.resolve(API_BASE, "/api/user/register"),
      newUser
    );
    const { username, _id } = result.data.user;

    expect(username).to.equal(newUser.username);
    expect(result.data).to.have.property("accessToken");
    expect(result.data).to.have.property("refreshToken");
  });

  it("should log in a user", async () => {
    const result = await axios.post(
      url.resolve(API_BASE, "/api/user/login"),
      newUser
    );

    expect(result.data)
      .to.have.property("accessToken")
      .to.not.equal(null || undefined);
    expect(result.data)
      .to.have.property("refreshToken")
      .to.not.equal(null || undefined);
  });

  after(async () => {
    await User.findOneAndDelete({ username: newUser.username });
  });
});
