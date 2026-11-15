import "dotenv/config";
import express, { type CookieOptions } from "express";
import argon2 from "argon2";
import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, ACCESS_TOKEN_SECONDS, CLIENT_ORIGIN } from "../lib/config";

const router = express.Router();

router.post("/register", async (req, res) => {
  if(typeof req.body === "undefined") {
    return res.status(400).json({ "error": "Body could not be found!" });
  }

  const { name, email, username, password } = req.body;

  // Normalization of fields

  if(typeof name !==  "string" || typeof email !==  "string" || typeof username !==  "string" || typeof password !==  "string") {
    return res.status(400).json({ "error": "One of the fields provided is not a string!" });
  }

  const normalisedName = name.trim()
  const normalisedEmail = email.trim().toLowerCase();
  const normalisedUsername = username.trim().toLowerCase();

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-z0-9]{3,12}$/;

  if(!emailRegex.test(normalisedEmail) || !usernameRegex.test(normalisedUsername)) {
    return res.status(400).json({ "error": "Email or username are invalid!" });
  }

  if(normalisedEmail.length > 254) {
    return res.status(400).json({ "error": "Email is too long!" });  
  }

  if(!(normalisedName.length >= 1 && normalisedName.length <= 50)) {
    return res.status(400).json({ "error": "Name must be within 1 to 50 characters" });
  }

  if(!(password.length >= 15 && password.length <= 64)) {
    return res.status(400).json({ "error": "Password length must be within 15 to 64 characters!" });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        name: normalisedName,
        email: normalisedEmail,
        username: normalisedUsername,
        passwordHash: hashedPassword
      }
    });

    return res.status(201).json({
      name: user.name,
      username: user.username
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      
      return res.status(409).json({ "error": "Username or email is already in use!" });
    }

    console.error(error);

    return res.status(500).json({ "error": "Error occured while registering this user" });
  }
});

router.post("/login", async (req, res) => {
  if(typeof req.body === "undefined") {
    return res.status(400).json({ "error": "Body could not be found!" });
  }

  const { username, password } = req.body;

  if(typeof username !==  "string" || typeof password !==  "string") {
    return res.status(400).json({ "error": "One of the fields provided is not a string!" });
  }

  const normalisedUsername = username.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: normalisedUsername
      },
      select: {
        id: true,
        passwordHash: true
      }
    });

    if(!user) {
      return res.status(401).json({ "error": "Invalid username or password" });
    }

    const passwordVerification = await argon2.verify(user.passwordHash, password);

    if(!passwordVerification) {
      return res.status(401).json({ "error": "Invalid username or password" });
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { algorithm: "HS256", expiresIn: ACCESS_TOKEN_SECONDS });
  
    return res.status(200).cookie(AUTH_COOKIE_NAME, token, { ...AUTH_COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_SECONDS * 1000 }).json({ "success": true });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ "error": "Internal server error!" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
  return res.status(204).end();
});

export default router;