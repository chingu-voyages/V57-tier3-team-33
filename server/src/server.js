import express from "express";
import { PORT } from "./config/env.js";
import router from "./routes/TestRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// testing server 
const app = express();

app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
