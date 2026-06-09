import express from "express";
import "./modules/auth/auth.passport.js";
import authrouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import interviewRouter from "./modules/interview/interview.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/errors/errorHandler.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/api/auth', authrouter);
app.use('/api/users', userRouter);
app.use('/api/interviews', interviewRouter);


//test route
app.get('/', (req, res) => {
  res.send("API IS WORKING FINE");
});

//error handler middleware
app.use(errorHandler);

export default app;
