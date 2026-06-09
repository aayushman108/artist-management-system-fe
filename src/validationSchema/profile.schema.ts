import { z } from "zod";
import { Gender } from "../constants";
import { patchPreprocessor } from "../utils/validationSchemaPreprocessor";
import { validateDate } from "../utils/validation";

const userProfileUpdateSchema = z.object({
  phone: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .regex(/^9\d{9}$/, "Enter a valid 10-digit number starting with 9")
      .optional()
      .nullable(),
  ),
  dob: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .refine(validateDate, {
        message: "Invalid date format (expected YYYY-MM-DD)",
      })
      .optional()
      .nullable(),
  ),
  gender: z.preprocess(
    patchPreprocessor,
    z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional().nullable(),
  ),
  address: z.preprocess(patchPreprocessor, z.string().optional().nullable()),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must not exceed 100 characters" })
    .optional(),
  lastName: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .max(100, { message: "Last name must not exceed 100 characters" })
      .optional()
      .nullable(),
  ),
});

const artistProfileUpdateSchema = z.object({
  stageName: z
    .string()
    .min(1, { message: "Stage name is required" })
    .max(255, { message: "Stage name must not exceed 255 characters" })
    .optional(),
  dob: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .refine(validateDate, {
        message: "Invalid date format (expected YYYY-MM-DD)",
      })
      .optional()
      .nullable(),
  ),
  gender: z.preprocess(
    patchPreprocessor,
    z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional().nullable(),
  ),
  address: z.preprocess(patchPreprocessor, z.string().optional().nullable()),
  firstReleaseYear: z.preprocess(
    patchPreprocessor,
    z.coerce.number().int().optional().nullable(),
  ),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must not exceed 100 characters" })
    .optional(),
  lastName: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .max(100, { message: "Last name must not exceed 100 characters" })
      .optional()
      .nullable(),
  ),
});

export const profileSchema = {
  userProfileUpdateSchema,
  artistProfileUpdateSchema,
};
