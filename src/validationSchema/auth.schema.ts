//implement zod
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
  companyName: z
    .string({ message: "Company name is required" })
    .min(1, { message: "Company name is required" })
    .max(255, { message: "Company name must not exceed 255 characters" }),
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

export const authSchema = {
  loginSchema,
  signupSchema,
};
