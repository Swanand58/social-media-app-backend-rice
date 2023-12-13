const passport = require("passport");
const User = require("../schema/userSchema");
const Profile = require("../schema/profileSchema");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID:
      "95974735785-nrr841271fucolu05qbdbq6hef5b4q4i.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:
      "https://finalproject-ricebook-server-04f59a3aae80.herokuapp.com/auth/google/callback",
    passReqToCallback: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = {
        token: accessToken,
      };
      const profileJson = profile._json;
      const email = profileJson.email;
      const username = profileJson.given_name;
      const name = profileJson.name;
      const avatar = profileJson.picture;

      console.log(profile.id, "Profile in console log");
      console.log(accessToken, "Access token in google auth");

      let userdb = await User.findOne({
        $or: [{ email }, { providerId: profile.id }],
      });

      if (!userdb) {
        userdb = await User.create({
          username,
          authProvider: "google",
          providerId: profile.id,
          token: accessToken,
        });

        await Profile.create({
          user: user._id,
          username,
          email,
          name: name,
          avatar: avatar,
        });
      }

      done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = googleAuthStrategy;
