import express from "express";
import { PORT } from "./config/env";
import router from "./routes/index.route";

// testing server
const app = express();

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
