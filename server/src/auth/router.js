import express from "express";
import * as EmailValidator from "email-validator";
import {
  generateRandomToken,
  getWinChance,
  simulateGamble,
  getTokenFromReq,
  SECRET,
} from "./utils.js";
const router = express.Router();

const tokenStorage = new Set();
const usersScore = {};

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "Email and password required" });
    }

    const isValidEmail = EmailValidator.validate(email);
    if (!isValidEmail || password !== SECRET) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateRandomToken();
    tokenStorage.add(token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    const token = getTokenFromReq(req);

    if (tokenStorage.has(token)) {
      tokenStorage.delete(token);
      return res.status(200).send("OK");
    }
    res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/try_luck", (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!tokenStorage.has(token)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userCurrentScore = usersScore[token] ?? 0;
    const winRate = getWinChance(userCurrentScore);

    const isUserWin = simulateGamble(winRate);
    usersScore[token] = isUserWin ? userCurrentScore + 1 : userCurrentScore;
    return res.status(200).json({ win: isUserWin });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
