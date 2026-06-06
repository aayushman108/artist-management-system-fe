import z from "zod";
import { UserRole } from "../constants/general.constant";
import { InvitationRequestStatus } from "../constants";

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

const createInviationSchema = invitationRequestSchema;

const updateStatusSchema = z.object({
  status: z.enum(
    [InvitationRequestStatus.PENDING, InvitationRequestStatus.REJECTED],
    { message: "Please select a status" },
  ),
});

export const invitationSchema = {
  invitationRequestSchema,
  createInviationSchema,
  updateStatusSchema,
};
