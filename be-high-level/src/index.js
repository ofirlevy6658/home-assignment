import express from "express";
import authRouter from "./auth/router.js";

const app = express();

app.use(express.json());
app.use("/api", authRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
