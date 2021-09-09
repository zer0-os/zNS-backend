import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middleware from "./middleware";
import { apiRouter } from "./api";

const app = express();

app.use(
  morgan(
    ":date[web] :method :remote-addr :url :status :response-time ms - :res[content-length]"
  )
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(middleware.errorHandler);

export = app;
