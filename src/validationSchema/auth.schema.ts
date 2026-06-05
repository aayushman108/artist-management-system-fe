import z from "zod";
import { UserRole } from "../constants/general.constant";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)",
      },
    ),
});

const signupSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must not exceed 100 characters" }),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name must not exceed 100 characters" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must not exceed 255 characters" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)",
      },
    ),
  role: z.enum([UserRole.SUPER_ADMIN]),
});

const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const authSchema = {
  loginSchema,
  signupSchema,
  signupFormSchema,
};
