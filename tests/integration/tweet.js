"use strict";

require("dotenv").config();

const url = require("url");
const axios = require("axios");
const mongoose = require("mongoose");
const { expect } = require("chai");

const User = require("../../src/models/user");

const { API_BASE, DATABASE_PASSWORD, DATABASE_USER } = process.env;

describe("TWEET", () => {
  let accessToken;
  let tweetId;

  const newTweet = {
    body: "jcb is love"
  };

  const user = {
    username: "johndoe",
    password: "jcbislub"
  };

  before(async () => {
    mongoose.connect(
      `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:27017/postman`,
      {
        useNewUrlParser: true
      }
    );
    const result = await axios.post(
      url.resolve(API_BASE, "/api/user/register"),
      user
    );
    accessToken = result.data.accessToken;
  });

  it("should create a new tweet", async () => {
    const result = await axios.post(
      url.resolve(API_BASE, "/api/tweet/create"),
      newTweet,
      { headers: { "access-token": accessToken } }
    );

    const { body, _id } = result.data.tweet;
    tweetId = _id;

    expect(body)
      .to.equal(newTweet.body)
      .length.lessThan(140);
  });

  it("should retrieve a tweet", async () => {
    const result = await axios.get(
      url.resolve(API_BASE, `/api/tweet/${tweetId}`)
    );

    const { tweet } = result.data;

    expect(tweet)
      .to.have.property("body")
      .to.equal(`jcb is love`);
    expect(tweet).to.have.property("author");
    expect(tweet.author).to.have.property("username");
    expect(tweet.author.username).to.equal(user.username);
  });

  it("should delete a tweet", async () => {
    await axios.delete(url.resolve(API_BASE, `/api/tweet/${tweetId}`), {
      headers: { "access-token": accessToken }
    });
  });

  after(async () => {
    await User.findOneAndDelete({ username: user.username });
  });
});
