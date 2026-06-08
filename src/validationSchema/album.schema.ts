import { z } from "zod";

const createAlbumSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must not exceed 255 characters" }),
  artistId: z.string().uuid("Invalid artist ID").optional().nullable(),
  releaseDate: z.string().optional().nullable().or(z.literal("")),
});

const updateAlbumSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must not exceed 255 characters" })
    .optional(),
  releaseDate: z.string().optional().nullable().or(z.literal("")),
});

export const albumSchema = {
  createAlbumSchema,
  updateAlbumSchema,
};
