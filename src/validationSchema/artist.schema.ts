import { z } from "zod";
import {
  emailPreprocessor,
  optionalPreprocessor,
  requiredPreprocessor,
} from "../utils/validationSchemaPreprocessor";
import { validateDate } from "../utils/validation";
import { Gender } from "../constants";

const updateArtistSchema = z.object({
  stageName: z.string().min(1).max(255).optional(),
  dob: z
    .string()
    .refine(validateDate, {
      message: "Invalid date format (expected YYYY-MM-DD)",
    })
    .optional()
    .nullable(),
  gender: z
    .enum([Gender.MALE, Gender.FEMALE, Gender.OTHER])
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  firstReleaseYear: z.coerce.number().int().optional().nullable(),
});

const artistCsvRowSchema = z.object({
  email: z.preprocess(
    emailPreprocessor,
    z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email format" })
      .max(255, { message: "Email must not exceed 255 characters" }),
  ),
  first_name: z.preprocess(
    requiredPreprocessor,
    z
      .string({ message: "First name is required" })
      .min(1, { message: "First name is required" })
      .max(100, { message: "First name must not exceed 100 characters" }),
  ),
  last_name: z.preprocess(
    optionalPreprocessor,
    z
      .string()
      .max(100, { message: "Last name must not exceed 100 characters" })
      .optional()
      .nullable(),
  ),
  stage_name: z.preprocess(
    requiredPreprocessor,
    z
      .string({ message: "Stage name is required" })
      .min(1, { message: "Stage name is required" })
      .max(255, { message: "Stage name must not exceed 255 characters" }),
  ),
  dob: z.preprocess(
    optionalPreprocessor,
    z
      .string()
      .refine(validateDate, {
        message: "Invalid date format (expected YYYY-MM-DD)",
      })
      .optional()
      .nullable(),
  ),
  gender: z.preprocess(
    optionalPreprocessor,
    z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional().nullable(),
  ),
  address: z.preprocess(optionalPreprocessor, z.string().optional().nullable()),
  first_release_year: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  }, z.number().int().min(1900).max(2100).nullable().optional()),
});

export const artistSchema = {
  updateArtistSchema,
  artistCsvRowSchema,
};
