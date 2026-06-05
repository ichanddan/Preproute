import { z } from "zod";

export const testCreationSchema = z.object({
  testType: z.enum(["chapter-wise", "pyq", "mock-test"]),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  duration: z.coerce.number().min(1, "Duration is required"),
  nameOfTest: z.string().min(1, "Name of test is required"),
  subTopic: z.string().min(1, "Sub topic is required"),
  difficulty: z.enum(["easy", "medium", "difficult"]),
  wrongAnswer: z.coerce.number(),
  unattempted: z.coerce.number(),
  correctAnswer: z.coerce.number(),
  noOfQuestions: z.coerce.number().min(1, "No of questions is required"),
  totalMarks: z.coerce.number().optional(),
});

export type TestCreationValues = z.infer<typeof testCreationSchema>;
