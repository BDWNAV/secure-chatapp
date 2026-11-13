import express from "express";
const router = express.Router();

router.post("/register", async (req, res) => {
  if(typeof req.body === "undefined") {
    return res.status(400).json({ "Error": "Body could not be found!" });
  }

  const { name, email, username, password } = req.body;

  // Normalization of fields

  if(typeof name !==  "string" || typeof email !==  "string" || typeof username !==  "string" || typeof password !==  "string") {
    return res.status(400).json({ "Error": "One of the fields provided is not a string!" });
  }

  const normalisedName = name.trim()
  const normalisedEmail = email.trim().toLowerCase();
  const normalisedUsername = username.trim().toLowerCase();

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-z0-9]{3,12}$/;

  if(!emailRegex.test(normalisedEmail) || !usernameRegex.test(normalisedUsername)) {
    return res.status(400).json({ "Error": "Email or username are invalid!" });
  }

  if(normalisedEmail.length > 254) {
    return res.status(400).json({ "Error": "Email is too long!" });  
  }

  if(!(normalisedName.length >= 1 && normalisedName.length <= 50)) {
    return res.status(400).json({ "Error": "Name must be within 1 to 50 characters" });
  }

  if(!(password.length >= 15 && password.length <= 64)) {
    return res.status(400).json({ "Error": "Password length must be within 15 to 64 characters!" });
  }

  return res.status(200).json({ "Status": "Success" });
});

export default router;