import express from "express";
import { PORT } from "./config/env";
import router from "./routes/index.route";
import { errorHandler } from "./middlewares/errorHandler";

// testing server
const app = express();

app.use(express.json());

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
