const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const User = require("../schema/userSchema");
const Profile = require("../schema/profileSchema");
// const { JWT_SECRET } = require("../constants/constants");
const crypto = require("crypto");
let sessionUser = {};
let cookieKey = "sid";

const regUser = asyncHandler(async (req, res) => {
  const { username, email, password, name, phoneNumber, zipcode, dob } =
    req.body;

  if (
    !username ||
    !email ||
    !password ||
    !name ||
    !phoneNumber ||
    !zipcode ||
    !dob
  ) {
    res.status(400);
    throw new Error("Please add all the fields");
  }

  const userAlreadyExists = await User.findOne({ username });

  if (userAlreadyExists) {
    res.status(409);
    throw new Error("username already taken, choose different username");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashPass,
  });

  const profile = await Profile.create({
    user: user._id,
    username,
    email,
    name,
    phoneNumber,
    zipcode,
    dob,
  });

  if (user && profile) {
    res.status(201);

    res.json({
      username: profile.username,
      result: "success",
    });
  } else {
    res.status(400);
    res.json({
      result: "Invalid user data",
    });
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  if (req.cookies.cookieKey) {
    //add cookieKey here
    res.status(400);
    res.json({
      result: "User is already logged in",
    });
    throw new Error("User is already logged in");
  }
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({
      result: "Please add all fields",
    });
    throw new Error("Please add all fields");
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    res.json({
      result: "User not present",
    });
    throw new Error("User not present");
  }

  const hashPass = await bcrypt.compare(password, user.password);

  if (user && hashPass) {
    // res.cookie("token", genToken(user.id), { httpOnly: true });
    const sid = crypto.randomBytes(16).toString("hex");
    // console.log(sid + "This is the sid");
    sessionUser[sid] = user;
    // console.log(sessionUser);

    res.cookie(cookieKey, sid, {
      maxAge: 3600 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200);
    res.json({
      username: user.username,
      result: "success",
    });
  } else {
    res.status(404);
    res.json({
      result: "Incorrect username or password",
    });
    throw new Error("Incorrect username or password");
  }
});

// const genToken = (id) => {
//   return jwt.sign({ id }, JWT_SECRET, {
//     expiresIn: "1h",
//   });
// };

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie();
  res.status(200);
  res.json({
    result: "log out success",
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const pass = req.body.password;
    console.log(pass);

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pass, salt);

    const updatedUser = await User.findByIdAndUpdate(loggedInUser._id, {
      password: hashPass,
    });

    res.status(200);
    res.json({
      username: loggedInUser.username,
      message: "password update successfull",
    });
  } catch (error) {
    res.status(500);
    res.json({
      message: "Password update failed",
    });
    throw new Error("Password update failed");
  }
});

module.exports = {
  regUser,
  loginUser,
  logoutUser,
  updatePassword,
  sessionUser,
  cookieKey,
};
