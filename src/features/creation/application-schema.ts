import { z } from "zod";

const promptApplicationSchema = z.object({
  source: z.literal("prompt").optional(),
  email: z.string().trim().toLowerCase().email().max(254),
  prompt: z.string().trim().min(1).max(1000),
  mode: z.enum(["chat", "classic"]),
  plan: z.enum(["classic", "pro", "team"]),
  billing: z.enum(["monthly", "annual"]),
});

const pricingApplicationSchema = promptApplicationSchema
  .pick({ email: true, plan: true, billing: true })
  .extend({ source: z.literal("pricing") });

export const applicationSchema = z.union([
  pricingApplicationSchema,
  promptApplicationSchema,
]);

export const applicationDetailsSchema = z.object({
  website: z
    .union([z.literal(""), z.string().trim().url().max(500)])
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Use an http or https website address.",
    ),
  details: z.string().trim().max(2000),
});
