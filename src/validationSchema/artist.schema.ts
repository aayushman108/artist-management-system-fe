import { z } from "zod";
import {
  emailPreprocessor,
  optionalPreprocessor,
  patchPreprocessor,
  requiredPreprocessor,
} from "../utils/validationSchemaPreprocessor";
import { validatePastDate } from "../utils/validation";
import { Gender } from "../constants";

const updateArtistSchema = z.object({
  stageName: z
    .string()
    .min(1, { message: "Stage name is required" })
    .max(255, { message: "Stage name must not exceed 255 characters" })
    .optional(),
  dob: z.preprocess(
    patchPreprocessor,
    z
      .string()
      .refine(validatePastDate, {
        message: "Date of birth cannot be in future",
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
  managerId: z.preprocess(
    patchPreprocessor,
    z.string().uuid().optional().nullable(),
  ),
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
      .refine(validatePastDate, {
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
