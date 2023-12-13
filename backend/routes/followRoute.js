const express = require("express");

const { getFollow, addFollow, deleteFollow } = require("../src/follow");

const { isLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/:username?")
  .get(isLoggedIn, getFollow)
  .put(isLoggedIn, addFollow)
  .delete(isLoggedIn, deleteFollow);

module.exports = router;
