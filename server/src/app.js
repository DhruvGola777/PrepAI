import express from "express";
import cors from "cors";
import "./modules/auth/auth.passport.js";
import authrouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import interviewRouter from "./modules/interview/interview.routes.js";
import aiRouter from "./modules/ai/ai.routes.js";
import feedbackRouter from "./modules/feedback/feedback.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/errors/errorHandler.js";
import connectDB from "./shared/database/db.js";

const app = express();

//middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/api/auth', authrouter);
app.use('/api/users', userRouter);
app.use('/api/interviews', interviewRouter);
app.use('/api/ai', aiRouter);
app.use('/api/feedback', feedbackRouter);


//test route
app.get('/', (req, res) => {
  res.send("API IS WORKING FINE");
});

//error handler middleware
app.use(errorHandler);

export default app;
