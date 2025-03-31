import { validateRegister } from "../schemas/registerSchema.js";
import { validateUsername } from "../schemas/usernameSchema.js";
import { validateCharacter } from "../schemas/characterSchema.js";
import bcrypt from "bcrypt";
import * as userModules from "../modules/userModules.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import passport from "passport";
import fs from "node:fs/promises";
import getDirname from "../dirname.js";
import { join } from "node:path";
import {
  getCharacterDetailsRedis,
  saveCharacterDetails,
  getUserProfileRedis,
  saveUserProfile,
  userProfileExist,
  characterDetailsExist,
  deleteCharacterDetails,
} from "../modules/redis.module.js";

const __dirname = getDirname();

// Get

export const getLoginPage = (req, res) => {
  res.render("login");
};

export const getRegisterPage = (req, res) => {
  res.render("register");
};

export const getHomePage = async (req, res) => {
  const username = req.user.username;
  const userImg = req.user.user_img;
  const marioCharacters = await userModules.getCharactersByGame(
    "Mario Bros",
    10,
    "ASC"
  );
  const zeldaCharacters = await userModules.getCharactersByGame(
    "Zelda",
    10,
    "ASC"
  );
  const haloCharacters = await userModules.getCharactersByGame(
    "Halo",
    10,
    "ASC"
  );
  res.render("home", {
    user: username,
    userImg,
    marioCharacters,
    zeldaCharacters,
    haloCharacters,
    isAuthorized: false,
  });
};

export const getCreatePage = (req, res) => {
  const username = req.user.username;
  const userImg = req.user.user_img;
  const character = undefined;
  res.render("create", { user: username, userImg, character });
};

export const getProfilePage = async (req, res) => {
  const userNameProfile = req.params.username;
  const username = req.user.username;
  const userImg = req.user.user_img;
  let isAuthorized = username === userNameProfile ? true : false;
  const redisRespond = await getUserProfileRedis(userNameProfile);
  let userProfile;

  if (redisRespond) {
    console.log("UserProfile desde redis");
    userProfile = JSON.parse(redisRespond);
  } else {
    console.log("UserProfile desde mysql");
    userProfile = await userModules.getUserProfile(userNameProfile);
    await saveUserProfile(userProfile, userNameProfile);
  }

  res.render("profile", { user: username, userImg, userProfile, isAuthorized });
};

export const getCharactersPage = async (req, res) => {
  const username = req.user.username;
  const userImg = req.user.user_img;
  const gameSelected = req.query.game;
  const games = await userModules.getGames();

  let characters;

  if (gameSelected) {
    characters = await userModules.getCharactersByGame(
      gameSelected,
      30,
      "DESC"
    );
  } else {
    characters = await userModules.getCharacters(30);
  }

  res.render("characters", {
    user: username,
    userImg,
    characters,
    games,
    isAuthorized: false,
  });
};

export const getNewUsername = (req, res) => {
  res.render("newUsername");
};

export const getErrorPage = (req, res) => {
  res.render("errorPage");
};

export const getCharacterDetailsController = async (req, res) => {
  const id = req.params.id;
  const redisRespond = await getCharacterDetailsRedis(id);

  if (redisRespond) {
    console.log("Desde redis");
    return res.status(200).json(JSON.parse(redisRespond));
  }

  const character = await userModules.getCharacterDetails(id);
  await saveCharacterDetails(character, id);

  console.log("Desde Mysql");
  res.status(200).json(character);
};

export const getUpdatePage = async (req, res) => {
  const username = req.user.username;
  const userImg = req.user.user_img;
  const characterId = req.params.id;
  const character = await userModules.getCharacterDetailsToUpdate(
    characterId,
    username
  );

  if (!character) return res.status(400).redirect("/home");

  res.render("create", { user: username, userImg, character });
};

// Post

export const registerValidation = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  const userExist = await userModules.getUsername(username);
  const emailExist = await userModules.getEmail(email);

  const result = validateRegister({ username, email, password });

  if (userExist)
    return res
      .status(200)
      .json({ error: "USEREXIST", errorMessage: "Usuario ya existe" });

  if (emailExist)
    return res
      .status(200)
      .json({ error: "EMAILEXIST", errorMessage: "Email ya existe" });

  if (result.error) {
    const errorMessage = result.error.issues[0].message;
    return res.status(400).json({ error: "INVALID_FIELDS", errorMessage });
  }

  const validatedUser = result.data;

  if (validatedUser.password !== confirm_password) {
    return res
      .status(400)
      .json({
        error: "INVALID_FIELDS",
        errorMessage: "Las contraseñas no coinciden",
      });
  }

  const hashedpassword = await bcrypt.hash(validatedUser.password, 10);
  validatedUser.password = hashedpassword;

  const userId = await userModules.createUser(validatedUser);

  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
    })
    .json({ redirect: "/home" });
};

export const loginValidation = async (req, res) => {
  const { username, password } = req.body;

  const userExist = await userModules.getUserCredentials(username);

  if (!userExist)
    return res
      .status(400)
      .json({ error: "USERNOEXIST", errorMessage: "Usuario no existe" });

  const correctPassword = await bcrypt.compare(password, userExist.password);

  if (!correctPassword)
    return res
      .status(400)
      .json({ error: "WRONGPASSWORD", errorMessage: "Contraseña incorrecta" });

  const token = jwt.sign({ id: userExist.user_id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
    })
    .json({ redirect: "/home" });
};

export const usernameValidation = async (req, res) => {
  const { username } = req.body;
  const userExist = await userModules.getUsername(username);
  const result = validateUsername({ username });
  const { userId } = req.user;

  if (result.error) {
    const errorMessage = result.error.issues[0].message;
    return res.status(400).json({ error: "iNVALID_FIELDS", errorMessage });
  }

  if (userExist)
    return res
      .status(400)
      .json({
        error: "USEREXIST",
        errorMessage: "Nombre de usuario ya existe",
      });

  const validatedUsername = result.data.username;

  await userModules.updateUsername(validatedUsername, userId);
  res.status(200).json({ redirect: "/home" });
};

export const closeSession = async (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("user_session")
    .json({ redirect: "/login" });
};

export const characterValidation = async (req, res) => {
  const userId = req.user.userId;
  const username = req.user.username;
  const characterData = req.body;
  const result = validateCharacter(characterData);
  let character_img = req.file ? req.file.filename : undefined;
  const userProfile = await userProfileExist(username);

  if (result.error) {
    const errorMessage = result.error.issues[0].message;
    if (character_img)
      await fs.unlink(
        join(__dirname, "public", "uploads", "characterImg", character_img)
      );

    return res.status(400).json({ error: "INVALID_FIELDS", errorMessage });
  }

  if (!req.file)
    return res
      .status(400)
      .json({ error: "INVALID_FIELDS", errorMessage: "Imagen no encontrada" });

  const gameName = result.data.game;
  const gameId = await userModules.getGameById(gameName);
  const descriptionHTML = characterData.descriptionHTML;
  result.data.description = descriptionHTML;

  let character = {
    ...result.data,
    character_img,
  };

  if (gameId) {
    await userModules.createCharacter(character, userId, gameId.game_id);
  } else {
    await userModules.createCharacterWithGame(character, userId, gameName);
  }

  if (userProfile === 1) {
    const userProfileUpdated = await userModules.getUserProfile(username);
    await saveUserProfile(userProfileUpdated, username);
  }

  res.json({ redirect: "/home" });
};

export const searchCharacters = async (req, res) => {
  const characterName = req.body.search;
  const characters = await userModules.getCharactersByName(characterName);

  res.json(characters);
};

export const searchGame = async (req, res) => {
  const gameName = req.params.game;
  const games = await userModules.getGameByName(gameName);

  res.json(games);
};

export const validateProfileImg = async (req, res) => {
  const userId = req.user.userId;
  const profileImg = req.file.filename;

  res.status(200).json({ message: "Imagen subida con exito" });

  await userModules.updateProfileImg(profileImg, userId);
};

// Patch

export const updateCharacter = async (req, res) => {
  const characterId = req.params.id;
  const username = req.user.username;
  const { character_name, description, creator, game } = req.body;
  const imgSelected = req.body.image_selected;
  const result = validateCharacter({
    character_name,
    description,
    creator,
    game,
  });
  let character_img = req.file ? req.file.filename : undefined;
  const characterDetails = await characterDetailsExist(characterId);
  const userProfile = await userProfileExist(username);

  if (result.error) {
    const errorMessage = result.error.issues[0].message;
    if (character_img)
      await fs.unlink(
        join(__dirname, "public", "uploads", "characterImg", character_img)
      );

    return res.status(400).json({ error: "INVALID_FIELDS", errorMessage });
  }

  if (!req.file) character_img = imgSelected;

  const gameName = result.data.game;
  const gameId = await userModules.getGameById(gameName);
  const descriptionHTML = req.body.descriptionHTML;
  result.data.description = descriptionHTML;

  let character = {
    ...result.data,
    character_img,
  };

  if (gameId) {
    await userModules.updateCharacter(character, characterId, gameId.game_id);
  } else {
    await userModules.updateCharacterWithGame(character, characterId, gameName);
  }

  if (req.file)
    await fs.unlink(
      join(__dirname, "public", "uploads", "characterImg", imgSelected)
    );

  if (characterDetails === 1) {
    const { character_img, character_name, creator, description } = character;
    const redisCharacter = {
      character_id: characterId,
      character_img,
      character_name,
      creator,
      description,
      game_name: character.game,
      username,
    };

    await saveCharacterDetails(redisCharacter, characterId);
  }

  if (userProfile === 1) {
    const userProfileUpdated = await userModules.getUserProfile(username);
    await saveUserProfile(userProfileUpdated, username);
  }

  res.json({ redirect: "/home" });
};

// Delete

export const deleteCharacter = async (req, res) => {
  const username = req.user.username;
  const characterId = req.body.characterId;
  const characterImg = req.body.characterImg;
  const userProfile = await userProfileExist(username);
  const characterDetails = await characterDetailsExist(characterId);

  console.log(characterImg);

  await userModules.deleteCharacter(characterId);
  await fs.unlink(
    join(__dirname, "public", "uploads", "characterImg", characterImg)
  );

  if (userProfile === 1) {
    const userProfileUpdated = await userModules.getUserProfile(username);
    await saveUserProfile(userProfileUpdated, username);
  }

  if (characterDetails === 1) {
    await deleteCharacterDetails(characterId);
  }

  res.json({ success: "Deleted successfully" });
};

// HandleStrategy

export const handleStrategy = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error)
        return res
          .status(400)
          .render("errorPage", {
            errorMessage: "Hubo un error interno, intente mas tarde",
          });
      if (info.error === "EMAILEXIST")
        return res
          .status(400)
          .render("errorPage", {
            errorMessage:
              "Ya existe un usuario con el mismo correo, intente usar otra cuenta.",
          });
      if (info.error === "USERNOFOUND")
        return res
          .status(400)
          .render("errorPage", {
            errorMessage: "Usuario no encontrado, intente registrarse",
          });
      req.logIn(user, (err) => {
        if (err)
          return res
            .status(400)
            .render("errorPage", {
              errorMessage: "Hubo un error interno, intente mas tarde",
            });
        res.status(200).redirect("/home");
      });
    })(req, res, next);
  };
};
