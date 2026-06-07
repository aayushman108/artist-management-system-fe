import { z } from "zod";

const createMusicSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must not exceed 255 characters" }),
  artistId: z.string().uuid("Invalid artist ID").optional(),
  albumId: z
    .string()
    .uuid("Invalid album ID")
    .optional()
    .nullable()
    .or(z.literal("")),
  genre: z
    .string()
    .max(100, { message: "Genre must not exceed 100 characters" })
    .optional()
    .nullable()
    .or(z.literal("")),
  language: z
    .string()
    .max(100, { message: "Language must not exceed 100 characters" })
    .optional()
    .nullable()
    .or(z.literal("")),
  releaseDate: z.string().optional().nullable().or(z.literal("")),
});

const updateMusicSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must not exceed 255 characters" })
    .optional(),
  albumId: z
    .string()
    .uuid("Invalid album ID")
    .optional()
    .nullable()
    .or(z.literal("")),
  genre: z
    .string()
    .max(100, { message: "Genre must not exceed 100 characters" })
    .optional()
    .nullable()
    .or(z.literal("")),
  language: z
    .string()
    .max(100, { message: "Language must not exceed 100 characters" })
    .optional()
    .nullable()
    .or(z.literal("")),
  releaseDate: z.string().optional().nullable().or(z.literal("")),
});

export const musicSchema = {
  createMusicSchema,
  updateMusicSchema,
};
