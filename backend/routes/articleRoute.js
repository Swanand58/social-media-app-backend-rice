const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv").config();

const { getArticle, postArticle, updateArticle } = require("../src/article");

const { isLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:id?").get(isLoggedIn, getArticle);
router.route("/").post(isLoggedIn, multer().single("image"), postArticle);
router.route("/:id").put(isLoggedIn, updateArticle);

module.exports = router;
