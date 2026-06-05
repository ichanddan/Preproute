import { z } from "zod";

export const publishSchema = z
  .object({
    mode: z.enum(["now", "schedule"]),
    scheduleDate: z.string().optional(),
    scheduleTime: z.string().optional(),
    liveUntil: z.enum([
      "always",
      "1-week",
      "2-weeks",
      "3-weeks",
      "1-month",
      "custom",
    ]),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "schedule") {
      if (!values.scheduleDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduleDate"],
          message: "Select a date",
        });
      }
      if (!values.scheduleTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduleTime"],
          message: "Select a time",
        });
      }
    }
    if (values.liveUntil === "custom") {
      if (!values.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "Select an end date",
        });
      }
      if (!values.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endTime"],
          message: "Select an end time",
        });
      }
    }
  });

export type PublishValues = z.infer<typeof publishSchema>;
