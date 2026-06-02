import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../common";
import { authSchema } from "../../validationSchema/auth.schema";
import { validateData } from "../../utils/validation";
import { authService } from "../../services/auth.service";
import styles from "./signup.module.scss";
import { UserRole } from "../../constants/general.constant";
import { AxiosError } from "axios";
import { VerifyEmailModal } from "./verifyEmailModal.component";

export function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { ...formData, role: UserRole.SUPER_ADMIN };
    // Validate form data against schema before submitting
    const validatedData = validateData(authSchema.signupSchema, payload);
    if (!validatedData.success) {
      setError(validatedData.errors);
      return;
    }

    setError({});
    setIsSubmitting(true);

    try {
      const response = await authService.signup(payload);
      setSuccessMessage(response?.message);
      if (response?.data?.token) {
        setVerificationToken(response.data.token);
        setIsVerifyModalOpen(true);
      }
    } catch (err: unknown) {
      let errorMsg: string;
      if (err instanceof AxiosError) {
        errorMsg = err?.response?.data?.message;
      } else {
        errorMsg = "Something went wrong. Please try again.";
      }
      setError({ _global: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (otp: string) => {
    if (!verificationToken) return;
    setIsVerifying(true);
    setVerifyError(null);
    try {
      await authService.verifyEmail(verificationToken, otp);
      setIsVerifyModalOpen(false);
      navigate("/login");
    } catch (err: unknown) {
      let errorMsg: string;
      if (err instanceof AxiosError) {
        errorMsg = err?.response?.data?.message;
      } else {
        errorMsg = "Something went wrong. Please try again.";
      }
      setVerifyError(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
    <>
      {successMessage ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <p>{successMessage}</p>
        </div>
      ) : (
        <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
          {error._global && (
            <div className={styles.globalError}>{error._global}</div>
          )}
          <Input
            label="Company Name"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            required
            error={error.companyName}
          />
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
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={error.confirmPassword}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      )}
      <VerifyEmailModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerify={handleVerify}
        isLoading={isVerifying}
        error={verifyError}
      />
    </>
  );
}
