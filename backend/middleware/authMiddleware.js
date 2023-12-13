const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../constants/constants");

const Profile = require("../schema/profileSchema");
const User = require("../schema/userSchema");
const { cookieKey, sessionUser } = require("../src/auth");
const session = require("express-session");
const passport = require("passport");

const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    // if (req.isAuthenticated()) {
    //   next();
    // }
    // if (req.user) {
    //   next();
    // }
    // console.log(req.session.passport.user);
    // console.log(req.user);
    if (req.isAuthenticated()) {
      return next();
    }

    console.log("in isLoggedin");

    if (!req.cookies) {
      res.status(401);
    }

    let sid = req.cookies[cookieKey];

    if (!sid) {
      res.status(401);
    }

    let user = sessionUser[sid];

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401);
    }
  } catch (error) {
    res.status(401);
    res.clearCookie();
    throw new Error("Not Authorized, Token not found");
  }
});

module.exports = { isLoggedIn };
