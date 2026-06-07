import { type ZodSchema, ZodError } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T; errors?: undefined }
  | { success: false; errors: Record<string, string>; data?: undefined };

export const validateDate = (val: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(val)) return false;
  const date = new Date(val);
  return !isNaN(date.getTime());
};

export const validateData = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): ValidationResult<T> => {
  try {
    const parsedData = schema.parse(data);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      
      error.issues.forEach((issue) => {
        const field = issue.path.join(".") || "_global";
        
        // Only grab the first error for a given field
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      if (Object.keys(errors).length === 0) {
        return { success: false, errors: { _global: "Validation failed" } };
      }

      return { success: false, errors };
    }
    
    // Unexpected error fallback
    return { success: false, errors: { _global: "Unexpected validation error" } };
  }
};
