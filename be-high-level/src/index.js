import express from "express";
import authRouter from "./auth/router.js";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

const swaggerDocument = JSON.parse(
  await readFile(new URL("./swagger.json", import.meta.url))
);

const app = express();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/api", authRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
