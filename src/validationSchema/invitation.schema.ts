import z from "zod";
import { UserRole } from "../constants/general.constant";

const invitationRequestSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must not exceed 100 characters" }),
  lastName: z
    .string()
    .max(100, { message: "Last name must not exceed 100 characters" })
    .optional(),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must not exceed 255 characters" }),
  role: z.enum(
    [UserRole.SUPER_ADMIN, UserRole.ARTIST_MANAGER, UserRole.ARTIST],
    {
      message: "Please select a role",
    },
  ),
});

export const invitationSchema = {
  invitationRequestSchema,
};
