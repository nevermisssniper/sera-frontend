import { z } from "zod";

export const userProfileSchema = z.object({
  gender: z.string().nonempty("Required"),
  age: z.string().nonempty("Required"), // store as string, no numeric parsing here
  hairColor: z.string().nonempty("Required"),
  hairLength: z.string().nonempty("Required"),
  ethnicity: z.string().nonempty("Required"),
  bodyType: z.string().nonempty("Required"),
  attire: z.string().nonempty("Required"),
  backgrounds: z.string().nonempty("Required"),

  // Glasses is also a radio group with "true"/"false".
  // We'll keep it as a string.
  glasses: z.enum(["true", "false"]).default("false"),

  instanceImages: z.array(z.string()).optional(),
  hasDetails: z.boolean().optional(),

  // If step is posted as a string, that’s fine (zod can parse or ignore).
  step: z.string().optional(),
});

// Step 1: gender, age
export const step1Schema = userProfileSchema.pick({
  gender: true,
  age: true,
});

// Step 2: hairColor, hairLength
export const step2Schema = userProfileSchema.pick({
  hairColor: true,
  hairLength: true,
});

// Step 3: ethnicity, bodyType
export const step3Schema = userProfileSchema.pick({
  ethnicity: true,
  bodyType: true,
});

// Step 4: attire, backgrounds, glasses
export const step4Schema = userProfileSchema.pick({
  attire: true,
  backgrounds: true,
  glasses: true,
});

export type TUserProfile = z.infer<typeof userProfileSchema>;

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

export type TAuth = z.infer<typeof authSchema>;
