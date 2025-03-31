import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config.js";
import {
  getEmail,
  getUserById,
  createThirdPartyUser,
} from "../modules/user.module.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, {
      username: user.username,
      user_img: user.user_img,
      userId: id,
    });
  } catch (err) {
    done(err, false);
  }
});

passport.use(
  "google-register-strategy",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/register/redirect",
      scope: ["email"],
    },
    async (accessToken, refresToken, profile, done) => {
      try {
        const userEmail = profile.emails[0].value;
        const userId = profile.id;

        const emailExist = await getEmail(userEmail);

        if (emailExist) return done(null, false, { error: "EMAILEXIST" });

        await createThirdPartyUser(userId, userEmail);
        done(null, { id: userId });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  "google-login-strategy",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/login/redirect",
      scope: ["email"],
    },
    async (accessToken, refresToken, profile, done) => {
      try {
        const userId = profile.id;
        const userExist = await getUserById(userId);

        if (!userExist) return done(null, false, { error: "USERNOFOUND" });
        done(null, { id: userId });
      } catch (err) {
        done(err, false);
      }
    }
  )
);
