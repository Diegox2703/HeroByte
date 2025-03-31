import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { getUserById } from "../modules/user.module.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.access_token;

  // JWT
  if (token) {
    try {
      const userId = jwt.verify(token, JWT_SECRET);
      const user = await getUserById(userId.id);
      req.user = {
        ...user,
        userId: userId.id,
      };
      return next();
    } catch (err) {
      console.log(err);
    }
  }

  // Passport
  if (req.user) {
    if (!req.user.username) return res.redirect("/new/username");
    return next();
  }

  // No authorized
  if (req.url === "/create") return res.redirect("/login");
  if (req.url === "/new/character") return res.json({ redirect: "/login" });
  req.user = { username: undefined };
  next();
};

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    try {
      const userId = jwt.verify(token, JWT_SECRET);
      return res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }

  if (req.user) {
    if (!req.user.username) return res.redirect("/new/username");
    return res.redirect("/");
  }

  next();
};

export const authCreateNewUsername = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    try {
      const userId = jwt.verify(token, JWT_SECRET);
      return res.redirect("/");
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  }

  if (req.user) {
    if (!req.user.username) return next();
    return res.redirect("/");
  }

  res.redirect("/");
};
