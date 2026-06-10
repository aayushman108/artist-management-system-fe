import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../common";
import { authService } from "../../services";
import { authSchema } from "../../validationSchema/auth.schema";
import { validateData } from "../../utils/validation";
import { useQuery } from "../../hooks";
import { getErrorMessage } from "../../utils";
import styles from "./resetPassword.module.scss";

export function ResetPassword() {
  const query = useQuery();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");

    if (!query?.token) {
      setError({ _global: "Reset token is missing" });
      return;
    }

    const validatedData = validateData(
      authSchema.resetPasswordSchema,
      formData,
    );

    if (!validatedData.success) {
      setError(validatedData.errors);
      return;
    }

    setError({});
    setIsSubmitting(true);

    try {
      const result = await authService.resetPassword({
        token: query.token,
        password: formData.password,
      });
      setSuccess(result.message);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error: unknown) {
      setError({ _global: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error[name]) {
      setError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error._global && (
            <div className={styles.globalError}>{error._global}</div>
          )}
          {success && <div className={styles.success}>{success}</div>}
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={error.password}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={error.confirmPassword}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </form>
        <div className={styles.footer}>
          <p>
            Remember your password?<a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
