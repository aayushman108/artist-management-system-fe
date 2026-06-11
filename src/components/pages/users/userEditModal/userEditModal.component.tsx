import { useState, useEffect, type ChangeEvent } from "react";
import moment from "moment";
import { profileSchema } from "../../../../validationSchema/profile.schema";
import { validateData } from "../../../../utils/validation";
import { getErrorMessage } from "../../../../utils";
import { GENDER_ARR, UserRole } from "../../../../constants";
import { Input, Select, Button, Modal } from "../../../../common";
import { usersService, artistService } from "../../../../services";
import styles from "./userEditModal.module.scss";
import type { User } from "../../../../@types/user";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User.IExtendedUser | null;
  onSuccess: () => void;
}

export function UserEditModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserEditModalProps) {
  const formKey = isOpen ? "open" : "closed";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update User" size="md">
      {user && (
        <UserEditForm
          key={formKey}
          user={user}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}

interface UserEditFormProps {
  user: User.IExtendedUser;
  onClose: () => void;
  onSuccess: () => void;
}

function UserEditForm({ user, onClose, onSuccess }: UserEditFormProps) {
  const isArtist = user.user?.role === UserRole.ARTIST;

  const [managerOptions, setManagerOptions] = useState<Artist.IManagerOption[]>(
    [],
  );

  useEffect(() => {
    if (isArtist) {
      artistService.getArtistManagers().then((res) => {
        setManagerOptions(res?.data || []);
      });
    }
  }, [isArtist]);

  const [formData, setFormData] = useState({
    firstName: user.user.first_name || "",
    lastName: user.user.last_name || "",
    phone: user.profile?.phone || "",
    dob: (isArtist ? user.artist?.dob : user.profile?.dob)
      ? moment(isArtist ? user.artist?.dob : user.profile?.dob).format(
          "YYYY-MM-DD",
        )
      : "",
    gender: (isArtist ? user.artist?.gender : user.profile?.gender) || "",
    address: (isArtist ? user.artist?.address : user.profile?.address) || "",
    stageName: user.artist?.stage_name || "",
    firstReleaseYear: user.artist?.first_release_year ?? "",
    managerId: user.artist?.manager_id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isArtist) {
      const validatedData = validateData(
        profileSchema.artistProfileUpdateSchema,
        formData,
      );

      if (!validatedData.success) {
        setErrors(validatedData.errors);
        return;
      }
      setIsSubmitting(true);
      try {
        await artistService.updateArtistProfile(user.user.id, {
          firstName: validatedData.data.firstName,
          lastName: validatedData.data.lastName,
          stageName: validatedData.data.stageName,
          dob: validatedData.data.dob,
          gender: validatedData.data.gender,
          address: validatedData.data.address,
          firstReleaseYear: validatedData.data.firstReleaseYear,
          managerId: formData.managerId || null,
        });

        onSuccess();
        onClose();
      } catch (error) {
        setErrors({ _global: getErrorMessage(error) });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const validatedData = validateData(
        profileSchema.userProfileUpdateSchema,
        formData,
      );
      if (!validatedData.success) {
        setErrors(validatedData.errors);
        return;
      }
      setIsSubmitting(true);
      try {
        await usersService.updateUserProfile(user.user.id, {
          firstName: validatedData.data.firstName,
          lastName: validatedData.data.lastName,
          phone: validatedData.data.phone,
          dob: validatedData.data.dob,
          gender: validatedData.data.gender,
          address: validatedData.data.address,
        });
        onSuccess();
        onClose();
      } catch (error) {
        setErrors({ _global: getErrorMessage(error) });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
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
          placeholder="Enter first name"
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          placeholder="Enter last name"
        />

        {isArtist && (
          <Input
            label="Stage Name"
            name="stageName"
            value={formData.stageName}
            onChange={handleChange}
            error={errors.stageName}
            placeholder="Enter stage name"
            required
          />
        )}

        {!isArtist && (
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Enter phone number"
          />
        )}

        <Input
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          error={errors.dob}
        />
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={errors.gender}
          options={[{ value: "", label: "None" }, ...GENDER_ARR]}
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Enter address"
        />

        {isArtist && (
          <Input
            label="First Release Year"
            name="firstReleaseYear"
            type="number"
            value={formData.firstReleaseYear}
            onChange={handleChange}
            error={errors.firstReleaseYear}
            placeholder="Enter first release year"
          />
        )}

        {isArtist && (
          <Select
            label="Manager"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            options={[
              { value: "", label: "None" },
              ...managerOptions.map((m) => ({
                value: m.id,
                label: m.name,
              })),
            ]}
            placeholder="Select manager"
          />
        )}
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
