import express from "express";
import "./modules/auth/auth.passport.js";
import authrouter from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/errors/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authrouter);

app.get('/', (req, res) => {
  res.send("API IS WORKING FINE");
});

app.use(errorHandler);

export default app;
