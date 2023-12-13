const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const cors = require("cors");
const multer = require("multer");

const User = require("./backend/schema/userSchema");
const Profile = require("./backend/schema/profileSchema");

const googleAuthStrategy = require("./backend/src/googleAuth");

//import auth src  * new
const {
  regUser,
  loginUser,
  logoutUser,
  updatePassword,
} = require("./backend/src/auth");

//import article src * new
const {
  getArticle,
  postArticle,
  updateArticle,
} = require("./backend/src/article");

//import follow src * new
const { getFollow, addFollow, deleteFollow } = require("./backend/src/follow");

//import profile src * new
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
} = require("./backend/src/profile");

//import middleware *new
const { isLoggedIn } = require("./backend/middleware/authMiddleware");

const corsOptions = {
  origin: "https://final-project-sk218-ricebook.surge.sh",
  credentials: true,
};

const errorHandler = require("./backend/middleware/error");
const dbConnection = require("./backend/db/db");
const userSchema = require("./backend/schema/userSchema");
dbConnection();

const app = express();

const dotenv = require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "doNotGuessTheSecrety",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(googleAuthStrategy);

app.use(cors(corsOptions));

//third party auth
// passport.serializeUser(function (user, done) {
//   console.log(user, "in serialize user");
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   console.log(user, "in deserialize user");
//   done(null, user);
// });

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "95974735785-nrr841271fucolu05qbdbq6hef5b4q4i.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://127.0.0.1:3001/auth/google/callback",
//       passReqToCallback: true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       const profileJson = profile._json;
//       const email = profileJson.email;
//       const username = profileJson.given_name;
//       const name = profileJson.name;
//       const avatar = profileJson.picture;

//       console.log(profile.id, "Profile in console log");
//       console.log(accessToken, "Access token in google auth");

//       let user = {
//         token: accessToken,
//       };
//       let userdb = User.findOne({
//         $or: [{ email }, { providerId: profile.id }],
//       });

//       if (!userdb) {
//         userdb = User.create({
//           username,
//           authProvider: "google",
//           providerId: profile.id,
//           token: accessToken,
//         });

//         const profiledb = Profile.create({
//           user: userdb._id,
//           username,
//           email,
//           name: name,
//           avatar: avatar,
//         });
//       }
//       done(null, user);
//     }
//   )
// );

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://final-project-sk218-ricebook.surge.sh/main",
    failureRedirect: "https://final-project-sk218-ricebook.surge.sh/",
  })
);

const hello = (req, res) => res.send({ hello: "world" });

app.get("/", hello);

// app.use("/auth", require("./routes/authRoute"));
app.post("/register", regUser); //&
app.post("/login", loginUser); //&
app.put("/logout", isLoggedIn, logoutUser); //&
app.put("/password", isLoggedIn, updatePassword); //&

// app.use("/profile", require("./routes/profileRoute"));
app.get("/self", isLoggedIn, getSelfProfile); //&

app.get("/headline/:username?", isLoggedIn, getHeadline); //&
app.put("/headline", isLoggedIn, updateHeadline); //&

app.get("/email/:username?", isLoggedIn, getEmail); //&
app.put("/email", isLoggedIn, updateEmail);

app.get("/zipcode/:username?", isLoggedIn, getZipcode); //&
app.put("/zipcode", isLoggedIn, updateZipcode); //&

app.get("/avatar/:username?", isLoggedIn, getAvatar); //&
app.put("/avatar", isLoggedIn, multer().single("avatar"), updateAvatar); //&

app.get("/phone/:username?", isLoggedIn, getPhone); //&
app.put("/phone", isLoggedIn, updatePhone); //&

app.get("/dob/:username?", isLoggedIn, getDOB); //&

app.use("/following", require("./backend/routes/followRoute"));
app.use("/articles", require("./backend/routes/articleRoute"));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${port}`);
});
