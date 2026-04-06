require("dotenv").config();

import express, { json } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import geminiRoute from "./src/routes/geminiRoute";
import articleRoute from "./src/routes/articleRoute";
const app = express();
app.head("/ping", (req, res) => {
  res.status(200).end();  
});
app.use(
  cors({
    origin: ["https://codeinsight-ai.vercel.app", "http://localhost:5173"],
  })
);

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: "Too many AI requests, please try again shortly." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(json());
app.use("/ai", aiLimiter, geminiRoute);
app.use("/articles", articleRoute);
const PORT = process.env.PORT || 8080;
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log("Listening successfully");
});
