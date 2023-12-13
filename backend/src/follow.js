const asyncHandler = require("express-async-handler");

const Profile = require("../schema/profileSchema");

const getFollow = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user;

    const username = req.params.username || loggedInUser.username;
    const userfollowing = await Profile.findOne({ username }).select(
      "following"
    );
    res.status(200);
    res.json({
      username,
      following: userfollowing.following,
      result: "success",
    });
  } catch (error) {
    res.status(400);
    res.json({ result: "Username invalid" });
    throw new Error("Username invalid");
  }
});

const addFollow = asyncHandler(async (req, res) => {
  try {
    const username = req.params.username;
    const loggedInUser = req.user;

    if (!username) {
      res.status(400);
      throw new Error("username not in the params");
    }
    if (username == loggedInUser.username) {
      res.status(400);
      throw new Error("Cannot follow self");
    }

    const user = await Profile.findOne({ user: loggedInUser._id });

    const alreadyFollowingUser = user.following.find((profile) => {
      return profile.username == username;
    });

    if (alreadyFollowingUser) {
      res.status(400);
      throw new Error(
        "Requested User is already followed by the loggedin user"
      );
    }

    const userToFollow = await Profile.findOne({ username });

    const userToAdd = {
      user: userToFollow._id,
      username: userToFollow.username,
      name: userToFollow.name,
    };

    user.following.push(userToAdd);

    await user.save();
    res.status(201);
    res.json({
      username: loggedInUser.username,
      following: user.following,
      result: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({ result: "User with the requested username not found" });
    throw new Error("User with the requested username not found");
  }
});

const deleteFollow = asyncHandler(async (req, res) => {
  try {
    const username = req.params.username;

    const loggedInUser = req.user;

    if (!username) {
      res.status(400);
      throw new Error("username not in the params");
    }

    if (username == loggedInUser.username) {
      res.status(400);
      throw new Error("Cant unfollow yourself");
    }

    const user = await Profile.findOne({ user: loggedInUser._id });

    const alreadyFollowingUser = user.following.find((profile) => {
      return profile.username == username;
    });

    if (!alreadyFollowingUser) {
      res.status(400);
      throw new Error("User is not followed by the LoggedInuser");
    }

    const alreadyFollowingId = user.following.indexOf(alreadyFollowingUser);
    user.following.splice(alreadyFollowingId, 1);

    await user.save();

    res.status(200);
    res.json({
      username: loggedInUser.username,
      following: user.following,
      result: "success",
    });
  } catch (error) {
    res.status(400);
    res.json({ result: "User cannot be unfollowed" });
    throw new Error("User cannot be unfollowed");
  }
});

module.exports = { getFollow, addFollow, deleteFollow };
