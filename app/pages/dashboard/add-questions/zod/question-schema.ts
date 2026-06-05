import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  option1: z.string().min(1, "Option is required"),
  option2: z.string().min(1, "Option is required"),
  option3: z.string().min(1, "Option is required"),
  option4: z.string().min(1, "Option is required"),
  correctOption: z.enum(["option1", "option2", "option3", "option4"]),
  explanation: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  subTopic: z.string().optional(),
});

export type QuestionValues = z.infer<typeof questionSchema>;
