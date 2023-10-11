import express from "express";
import * as EmailValidator from "email-validator";
import client from "../redisClient.js";
import {
  getWinRate,
  simulateGamble,
  getTokenFromReq,
  getCurrentDate,
  SECRET,
  JWT_SECRET,
} from "./utils.js";
const router = express.Router();
import jwt from "jsonwebtoken";

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ error: "Email and password required" });
    }

    const isValidEmail = EmailValidator.validate(email);
    if (!isValidEmail || password !== SECRET) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "30m" });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (_, res) => {
  return res.status(200).send('"OK"');
});

router.post("/try_luck", async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const currentDate = getCurrentDate();
    const dailyWinKey = `${currentDate}Wins`;
    const dailyLoseKey = `${currentDate}Losses`;

    const dailyWinCounter = await client.get(dailyWinKey);
    const dailyLoseCounter = await client.get(dailyLoseKey);

    const winRate = getWinRate(dailyWinCounter);
    const isUserWin = simulateGamble(winRate);

    if (isUserWin) {
      await client.set(
        dailyWinKey,
        (dailyWinCounter ? parseInt(dailyWinCounter) + 1 : 1).toString()
      );
      console.log("Daily wins", dailyWinCounter);
    } else {
      await client.set(
        dailyLoseKey,
        (dailyLoseCounter ? parseInt(dailyLoseCounter) + 1 : 1).toString()
      );
      console.log("Daily loses", dailyLoseCounter);
    }

    return res.status(200).json({ win: isUserWin });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
