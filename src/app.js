import "express-async-errors";

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import notFoundHandler from "./middleware/notFoundHandler.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { corsHandler } from "./middleware/cors.middleware.js";
import db from "./config/db.config.js";
import apiRouter from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(corsHandler);
app.use("/api/v1", apiRouter); // All the routes will be prefixed with /api

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(notFoundHandler); // Not found middleware. It will get triggered when user try to access invalid route.

app.use(errorHandler); // Error handler middleware. It will get triggered when any error is encounterd in our app.

db.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connected successfully`);
      console.log(`Server started successfully in http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
    process.exit(1);
  });
