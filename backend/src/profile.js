const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const Profile = require("../schema/profileSchema");
const User = require("../schema/userSchema");

const { uploadToCloudinary } = require("./uploadCloudinary");

const getSelfProfile = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);

    const user = await Profile.findOne({ user: loggedInUser._id });
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500);
    res.json({
      result: "Profile information request failed",
    });
    throw new Error("Problem while fetching profile information");
  }
});

const getHeadline = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const username = req.params.username || loggedInUser.username;

    const data = await Profile.findOne({ username }).select("headline");

    res.status(200);
    res.json({ username, headline: data.headline });
  } catch (error) {
    res.status(500);
    throw new Error("fetching headline for user failed");
  }
});

const updateHeadline = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    const update = await Profile.findOneAndUpdate(
      { user: loggedInUser._id },
      req.body,
      { new: true }
    );
    res.status(200);
    res.json({ username: loggedInUser.username, headline: update.headline });
  } catch (error) {
    res.status(500);
    res.json({
      result: "Headline update failed",
    });
    throw new Error("HeadLine update failed");
  }
});

const getEmail = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    const username = req.params.username || loggedInUser.username;
    const data = await Profile.findOne({ username }).select("email");
    res.status(200);
    res.json({
      username,
      email: data.email,
      result: "success",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "failed to retrieve email",
    });
  }
});

const updateEmail = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const update = await Profile.findOneAndUpdate(
      { user: loggedInUser._id },
      req.body,
      { new: true }
    );
    res.status(200);
    res.json({
      username: loggedInUser.username,
      email: update.email,
      result: "success",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "Email update failed",
    });
    throw new Error("Email update failed");
  }
});

const getZipcode = asyncHandler(async (req, res) => {
  try {
    loggedInUser = req.user;

    const username = req.params.username || loggedInUser.username;
    const data = await Profile.findOne({ username }).select("zipcode");

    res.status(200);
    res.json({
      username,
      zipcode: data.zipcode,
      result: "zipcode retrieved successfully",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "zipcode retrieve failed",
    });
    throw new Error("zipcode retrieve failed");
  }
});

const updateZipcode = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const update = await Profile.findOneAndUpdate(
      { user: loggedInUser._id },
      req.body,
      { new: true }
    );

    res.status(200);
    res.json({
      username: loggedInUser.username,
      zipcode: update.zipcode,
      result: "zipcode updated successfully",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "zipcode update failed",
    });
    throw new Error("zipcode update failed");
  }
});

const getAvatar = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const username = req.params.username || loggedInUser.username;

    const data = await Profile.findOne({ username }).select("avatar");
    res.status(200);
    res.json({ username: username, avatar: data.avatar });
  } catch (error) {
    res.status(500);
    res.json({
      result: "failed to retrieve avatar",
    });
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const avatarBuffer = req.file.buffer;

    const cloudinaryResult = await uploadToCloudinary(avatarBuffer);

    console.log(cloudinaryResult);

    const update = await Profile.findOneAndUpdate(
      { user: loggedInUser._id },
      { avatar: cloudinaryResult.url },
      { new: true }
    );
    res.status(200);
    res.json({ username: loggedInUser.username, avatar: update.avatar });
  } catch (error) {
    res.status(500);
    res.json({
      result: "failed to update avatar",
    });
    throw new Error("failed to update avatar");
  }
});

const getPhone = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    const username = req.params.username || loggedInUser.username;

    const data = await Profile.findOne({ username }).select("phoneNumber");
    res.status(200);
    res.json({
      username: loggedInUser.username,
      phoneNumber: data.phoneNumber,
      result: "success",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "failed to retrieve phone number",
    });
  }
});

const updatePhone = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const update = await Profile.findOneAndUpdate(
      { user: loggedInUser._id },
      req.body,
      { new: true }
    );
    res.status(200);
    res.json({
      username: loggedInUser.username,
      phoneNumber: update.phoneNumber,
      result: "success",
    });
  } catch (error) {
    res.status(500);
    res.json({
      result: "failed to update phone",
    });
    throw new Error("failed to update phone");
  }
});

const getDOB = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const username = req.params.username || loggedInUser.username;

    const data = await Profile.findOne({ user: loggedInUser._id }).select(
      "dob"
    );

    const userDob = data.dob.getTime();
    res.status(200);
    res.json({
      username,
      dob: userDob,
      result: "success",
    });
  } catch (error) {
    res.status(500);
    res.json({ result: "Failed to retrieve date of birth" });
    throw new Error("Failed to retrieve date of birth");
  }
});

module.exports = {
  getSelfProfile,
  getHeadline,
  updateHeadline,
  getEmail,
  updateEmail,
  getZipcode,
  updateZipcode,
  getAvatar,
  updateAvatar,
  getPhone,
  updatePhone,
  getDOB,
};
