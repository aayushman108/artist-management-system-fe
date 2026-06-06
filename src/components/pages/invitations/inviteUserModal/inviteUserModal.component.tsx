import { useState } from "react";
import styles from "./inviteUserModal.module.scss";
import { Modal, Input, Select, Button } from "../../../../common";
import { UserRole, USER_ROLE_ARR } from "../../../../constants/general.constant";
import { invitationSchema } from "../../../../validationSchema/invitation.schema";
import { validateData } from "../../../../utils/validation";
import { invitationService } from "../../../../services";
import { getErrorMessage } from "../../../../utils";
import { useAuth } from "../../../../context";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSentInvitations: () => Promise<void>;
}

export function InviteUserModal({
  isOpen,
  onClose,
  fetchSentInvitations,
}: InviteUserModalProps) {
  const { user } = useAuth();
  const isArtistManager = user?.role === UserRole.ARTIST_MANAGER;

  const initialValue = {
    firstName: "",
    lastName: "",
    email: "",
    role: isArtistManager ? UserRole.ARTIST : "",
  };

  const [formData, setFormData] = useState(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = validateData(
      invitationSchema.createInviationSchema,
      formData,
    );
    if (!validatedData.success) {
      setErrors(validatedData.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await invitationService.inviteUser(validatedData.data);
      await fetchSentInvitations();
      setFormData(initialValue);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ _global: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialValue);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite User"
      size="md"
      disableClose={isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formBody}>
          {errors._global && (
            <div className={styles.globalError}>{errors._global}</div>
          )}
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Enter last name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter email"
          />
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            required
            disabled={isArtistManager}
            placeholder={isArtistManager ? "Artist" : "Select Role"}
            options={
              isArtistManager
                ? USER_ROLE_ARR.filter(
                    (opt) => opt.value === UserRole.ARTIST,
                  )
                : USER_ROLE_ARR
            }
          />
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
}
