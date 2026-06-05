import { useState, type ChangeEvent } from "react";
import { Button, Input, Select } from "../../common";
import { validateData } from "../../utils/validation";
import { USER_ROLE_ARR } from "../../constants/general.constant";
import { AxiosError } from "axios";
import styles from "./signup.module.scss";
import { invitationService } from "../../services/invitation.service";
import { invitationSchema } from "../../validationSchema/invitation.schema";

export function InvitationRequestForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [error, setError] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = validateData(
      invitationSchema.invitationRequestSchema,
      formData,
    );
    if (!validatedData.success) {
      setError(validatedData.errors);
      return;
    }

    setError({});
    setIsSubmitting(true);

    try {
      const { lastName, ...rest } = validatedData.data;
      await invitationService.sendInvitationRequest({
        ...rest,
        lastName: lastName || undefined,
      });
      setSuccessMessage(
        "Your invitation request has been submitted successfully. You will receive an invitation email once your request is approved.",
      );
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  if (successMessage) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
      {error._global && (
        <div className={styles.globalError}>{error._global}</div>
      )}

      <Input
        label="First Name"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
        required
        error={error.firstName}
      />

      <Input
        label="Last Name"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
        error={error.lastName}
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

      <Select
        label="Role"
        name="role"
        placeholder="Select a role"
        options={USER_ROLE_ARR}
        value={formData.role}
        onChange={handleChange}
        error={error.role}
        required
      />

      <Button type="submit" isLoading={isSubmitting}>
        Submit Request
      </Button>
    </form>
  );
}
