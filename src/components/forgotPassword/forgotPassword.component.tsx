import { useState, type ChangeEvent } from "react";
import { Button, Input } from "../../common";
import { authService } from "../../services";
import { authSchema } from "../../validationSchema/auth.schema";
import { validateData } from "../../utils/validation";
import { getErrorMessage } from "../../utils";
import styles from "./forgotPassword.module.scss";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");

    const validatedData = validateData(authSchema.forgotPasswordSchema, {
      email,
    });

    if (!validatedData.success) {
      setError(validatedData.errors);
      return;
    }

    setError({});
    setIsSubmitting(true);

    try {
      const result = await authService.forgotPassword({ email });
      setSuccess(result.message);
    } catch (error: unknown) {
      setError({ _global: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (error.email) {
      setError({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error._global && (
            <div className={styles.globalError}>{error._global}</div>
          )}
          {success && <div className={styles.success}>{success}</div>}
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
            error={error.email}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Send Reset Link
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
