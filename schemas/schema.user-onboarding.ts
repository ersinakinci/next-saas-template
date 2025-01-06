import { z } from "zod";

export const userOnboardingSchema = z.object({
  onboardingCompleted: z.boolean().optional(),
});

export type UserOnboardingSchema = z.infer<typeof userOnboardingSchema>;
