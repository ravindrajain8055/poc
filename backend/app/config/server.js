import express from "express";
import routes from "../app/routes/routes.js";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.get("/ping", (_req, res) => {
  res.status(200).end();
});

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));
app.options("*", cors());

app.use(compression());
app.use(helmet());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use("/", routes);

export const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
