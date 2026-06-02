import { useState, type ChangeEvent } from "react";
import { Button, Input } from "../../common";
import { useAuth } from "../../context";
import { authSchema } from "../../validationSchema/auth.schema";
import { validateData } from "../../utils/validation";
import styles from "./login.module.scss";

export function LoginForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data against schema before submitting
    const validatedData = validateData(authSchema.loginSchema, formData);
    if (!validatedData.success) {
      setError(validatedData.errors);
      return;
    }

    setError({});
    login(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the specific field error when user starts typing
    if (error[name]) {
      setError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={error.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        error={error.password}
      />
      <Button type="submit">Sign In</Button>
      <div className={styles.forgotPassword}>
        <a href="/forgot-password">Forgot your password?</a>
      </div>
    </form>
  );
}
