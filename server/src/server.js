import express from "express";
import { PORT } from "./config/env.js";

// testing server 

const app = express();

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
