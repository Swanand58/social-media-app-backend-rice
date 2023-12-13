const mongoose = require("mongoose");
const { IMAGE_URL } = require("../constants/constants");

const followerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    headline: {
      type: String,
    },
  },
  { timestamps: true }
);

const imgSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Please add a username"],
    },
    headline: {
      type: String,
      default: "Im Loving it!",
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    zipcode: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
      // required: [true, "Please add a phone number"],
    },
    dob: {
      type: Date,
    },
    avatar: {
      type: String,
      default: IMAGE_URL,
    },
    following: [followerSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
