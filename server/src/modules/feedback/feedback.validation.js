import { z } from "zod";

export const getFeedbackSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid feedback ID" }),
  }),
});

export const getInterviewFeedbackSchema = z.object({
  params: z.object({
    interviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid interview ID" }),
  }),
});
