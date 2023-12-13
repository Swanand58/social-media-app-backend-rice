const express = require("express");
const multer = require("multer");
const {
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
} = require("../src/profile");

const { isLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/self").get(isLoggedIn, getSelfProfile);

router.route("/headline/:username?").get(isLoggedIn, getHeadline);
router.route("/headline").put(isLoggedIn, updateHeadline);

router.route("/email/:username?").get(isLoggedIn, getEmail);
router.route("/email").put(isLoggedIn, updateEmail);

router.route("/zipcode/:username?").get(isLoggedIn, getZipcode);
router.route("/zipcode").put(isLoggedIn, updateZipcode);

router.route("/avatar/:username?").get(isLoggedIn, getAvatar);
router.route("/avatar").put(isLoggedIn, updateAvatar);

router.route("/phone/:username?").get(isLoggedIn, getPhone);
router.route("/phone").put(isLoggedIn, updatePhone);

router.route("/dob/:username?").get(isLoggedIn, getDOB);

module.exports = router;
