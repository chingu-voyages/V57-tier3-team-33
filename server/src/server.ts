import express from "express";
import { PORT } from "./config/env";
import router from "./routes/index.route";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// testing server
const app = express();

app.use(express.json());

// Swagger docs (cast to any to satisfy Express v5 typings)
app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
