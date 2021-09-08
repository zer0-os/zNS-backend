require("dotenv").config();

import app from "./app";
import * as env from "env-var";

const apiPort: number = env.get("PORT").default("5000").asPortNumber();

app.listen(apiPort, () => {
  /* eslint-disable no-console */
  console.log(`Listening on ${apiPort}`);
  /* eslint-enable no-console */
});
