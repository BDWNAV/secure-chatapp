import "dotenv/config";
import type { CookieOptions } from "express";

const jwtSecret = process.env["JWT_SECRET"];

if(!jwtSecret) {
  throw new Error("JWT Secret could not be found make sure it is in the .env file!");
}

const JWT_SECRET: string = jwtSecret;
const AUTH_COOKIE_NAME = "access_token";
const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/"
}
const ACCESS_TOKEN_SECONDS = 15 * 60;
const CLIENT_ORIGIN = "http://localhost:3000";

export { JWT_SECRET, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, ACCESS_TOKEN_SECONDS, CLIENT_ORIGIN };