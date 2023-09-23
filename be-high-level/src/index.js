import express from "express";
import authRouter from "./auth/router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

const app = express();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/api", authRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
