import express from "express";
const router = express.Router();

router.post("/register", async (req, res) => {
  if(typeof req.body === "undefined") {
    return res.status(400).json({ "Error": "Body could not be found!" });
  }

  const { name, email, username, password } = req.body;

  if(typeof name !==  "string" || typeof email !==  "string" || typeof username !==  "string" || typeof password !==  "string") {
    return res.status(400).json({ "Error": "One of the fields provided is not a string!" });
  }

  const normalisedName = name.trim().toLowerCase();
  const normalisedEmail = email.trim().toLowerCase();
  const normalisedUsername = username.trim().toLowerCase();

  res.json({ normalisedName, normalisedEmail, normalisedUsername });
});

export default router;