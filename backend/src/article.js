const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const Article = require("../schema/articleSchema");
const Profile = require("../schema/profileSchema");
const { uploadToCloudinary } = require("./uploadCloudinary");
const { NO_IMAGE_URL } = require("../constants/constants");

const getArticle = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = req.user;

    if (id) {
      if (isValidObjectId(id)) {
        try {
          const article = await Article.findById(id);
          res.status(200);
          res.json({
            article,
            result: "success",
          });
        } catch (error) {
          res.status(401);
          res.json({ result: "Article of requested id not found" });
          throw new Error("Article of requested id not found");
        }
      } else {
        //id is a username
        try {
          const articles = await Article.find({ author: id });
          res.status(200);
          res.json({
            articles,
            result: "success",
          });
        } catch (error) {
          res.status(401);
          res.json({ result: "Article of requested username not found" });
          throw new Error("Article of requested username not found");
        }
      }
    } else {
      //fetching all the articles of username

      console.log(loggedInUser);
      const profileusername = loggedInUser.username;
      const profileuser = await Profile.findOne({ username: profileusername });

      const followers = profileuser.following.map(
        (follower) => follower.username
      );
      const usersToQuery = [profileusername, ...followers];
      const articles = await Article.find({
        author: { $in: usersToQuery },
      }).sort({ createdAt: -1 });

      res.status(200).json({
        articles,
        result: "success",
      });
    }
  } catch (error) {
    res.status(401);
    throw new Error("Get Articles failed");
  }
});

const postArticle = asyncHandler(async (req, res) => {
  try {
    console.log("hi im in post Article");
    const { title, text } = req.body;
    const loggedInUser = req.user;

    const imageBuffer = req.file.buffer;
    console.log("Image Buffer:", imageBuffer);

    console.log(title, text);
    if (!text) {
      res.status(400);
      res.json({ result: "Text not found" });
      throw new Error("Text not found");
    }

    if (imageBuffer) {
      console.log("both image and text found");
      var cloudinaryResult;
      try {
        cloudinaryResult = await uploadToCloudinary(imageBuffer);
      } catch (error) {
        res.status(500);
        throw new Error("Some problem with cloudinary");
      }
      try {
        const articleToPost = await Article.create({
          user: loggedInUser._id,
          author: loggedInUser.username,
          title: req.body.title,
          text: req.body.text,
          image: cloudinaryResult.url,
        });
        res.status(200);
        res.json(articleToPost);
      } catch (error) {
        res.status(500);
        throw new Error("Some problem with mongodb");
      }
    } else {
      console.log("only text found");

      try {
        const articleToPost = await Article.create({
          user: loggedInUser._id,
          author: loggedInUser.username,
          title: req.body.title,
          text: req.body.text,
          image: NO_IMAGE_URL,
        });
        res.status(200);
        res.json(articleToPost);
      } catch (error) {
        res.status(500);
        throw new Error("Some problem with mongodb");
      }
    }
  } catch (error) {
    res.status(400);
  }
});

const updateArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const { title, text, commentId } = req.body;
  const loggedInUser = req.user;

  if (!articleId) {
    res.status(400);
    throw new Error("articleId not found in params");
  }

  if (!text) {
    res.status(400);
    throw new Error("Text not found to update");
  }

  const article = await Article.findById(articleId);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  if (!commentId) {
    console.log("No comment id in req body");
    if (article.user.toString() !== loggedInUser._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to update this article");
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, text },
      { new: true }
    );
    if (updatedArticle) {
      res.status(200);
      res.json(updatedArticle);
    } else {
      res.status(400);
      throw new Error("Article could not be updated");
    }
  } else if (commentId == -1) {
    const newComment = {
      user: loggedInUser._id,
      username: loggedInUser.username,
      comment: text,
    };
    article.comments.push(newComment);
    await article.save();
    res.status(200);
    res.json({ username: loggedInUser.username, article });
  } else {
    if (!isValidObjectId(commentId)) {
      res.status(400);
      throw new Error("Comment Id is not valid");
    }
    const ifcommentExist = article.comments.find((comment) => {
      return comment._id == commentId;
    });
    if (!ifcommentExist) {
      res.status(400);
      throw new Error("No comment found");
    }
    if (ifcommentExist.user.toString() != loggedInUser._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const ifcommentExistId = article.comments.indexOf(ifcommentExist);

    const updatedComment = {
      user: loggedInUser._id,
      username: loggedInUser.username,
      comment: text,
    };

    article.comments[ifcommentExistId] = updatedComment;
    await article.save();

    res.status(200);
    res.json({ article, result: "success" });
  }
});

module.exports = { getArticle, postArticle, updateArticle };
