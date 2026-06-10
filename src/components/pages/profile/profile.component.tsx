import { useState, useMemo, type ChangeEvent } from "react";
import moment from "moment";
import { useAuth } from "../../../context";
import { usersService, artistService } from "../../../services";
import { profileSchema } from "../../../validationSchema/profile.schema";
import { validateData } from "../../../utils/validation";
import { getErrorMessage, getInitials } from "../../../utils";
import { GENDER_ARR, UserRoleMeta, UserStatusMeta } from "../../../constants";
import { Input, Select, Button, Modal, Badge } from "../../../common";
import styles from "./profile.module.scss";
import { usePermissions } from "../../../hooks";
import type { User } from "../../../@types/user";

export function ProfilePage() {
  const {
    user,
    profile: userProfile,
    artist: artistProfile,
    refreshMyDetails,
  } = useAuth();
  const { isArtist } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileData = useMemo(() => {
    const p = {
      dob: userProfile?.dob || "",
      gender: userProfile?.gender || "",
      address: userProfile?.address || "",
      phone: userProfile?.phone || "",
    };
    const a = {
      dob: artistProfile?.dob || "",
      gender: artistProfile?.gender || "",
      address: artistProfile?.address || "",
      stageName: artistProfile?.stage_name || "",
      managerId: artistProfile?.manager_id || "",
      managerName: artistProfile?.artist_manager_name || "",
      firstReleaseYear: artistProfile?.first_release_year || "",
    };
    return {
      phone: p.phone || "",
      dob: isArtist ? a.dob : p.dob || "",
      gender: isArtist ? a.gender : p.gender || "",
      address: isArtist ? a.address : p.address || "",
      stageName: isArtist ? a.stageName : "",
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      managerName: isArtist ? a.managerName : "",
      firstReleaseYear: isArtist ? a.firstReleaseYear : "",
    };
  }, [user, userProfile, artistProfile, isArtist]);

  const handleUpdateSuccess = () => {
    refreshMyDetails();
    setIsModalOpen(false);
  };

  const genderLabel = profileData.gender
    ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
    : null;

  return (
    <div className={styles.profilePage}>
      <div className={styles.headerRow}>
        <h3>My Profile</h3>
        <div className={styles.headerActions}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Update Profile
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.userCard}>
          <div className={styles.userCardTop}>
            <div className={styles.avatarLarge}>
              {getInitials(
                [profileData.firstName, profileData.lastName].join(" "),
              )}
            </div>
            <div className={styles.userDetails}>
              <h2>
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className={styles.email}>{user?.email}</p>
              <div className={styles.badges}>
                <Badge
                  variant={UserRoleMeta[user!.role].badgeVariant}
                  label={UserRoleMeta[user!.role].label}
                />
                <Badge
                  variant={
                    UserStatusMeta[user!.status as keyof typeof UserStatusMeta]
                      .badgeVariant
                  }
                  label={
                    UserStatusMeta[user!.status as keyof typeof UserStatusMeta]
                      .label
                  }
                />
              </div>
            </div>
          </div>

          <div className={styles.detailGrid}>
            {isArtist && (
              <div className={styles.detailCard}>
                <span className={styles.detailLabel}>Stage Name</span>
                <span className={styles.detailValue}>
                  {profileData.stageName || "—"}
                </span>
              </div>
            )}
            {isArtist && (
              <div className={styles.detailCard}>
                <span className={styles.detailLabel}>First Release Year</span>
                <span className={styles.detailValue}>
                  {profileData.firstReleaseYear || "—"}
                </span>
              </div>
            )}
            <div className={styles.detailCard}>
              <span className={styles.detailLabel}>Phone</span>
              <span className={styles.detailValue}>
                {profileData.phone || "—"}
              </span>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.detailLabel}>Date of Birth</span>
              <span className={styles.detailValue}>
                {profileData.dob ? moment(profileData.dob).format("ll") : "—"}
              </span>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.detailLabel}>Gender</span>
              <span className={styles.detailValue}>{genderLabel || "—"}</span>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.detailLabel}>Address</span>
              <span className={styles.detailValue}>
                {profileData.address || "—"}
              </span>
            </div>
            {isArtist && (
              <div className={styles.detailCard}>
                <span className={styles.detailLabel}>Manager</span>
                <span className={styles.detailValue}>
                  {profileData.managerName || "—"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileData={profileData}
        isArtist={isArtist}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}

function ProfileEditModal({
  isOpen,
  onClose,
  profileData,
  isArtist,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    phone: string;
    dob: string;
    gender: string;
    address: string;
    stageName: string;
    firstName: string;
    lastName: string;
    managerName?: string | null;
    firstReleaseYear: string | number;
  };
  isArtist: boolean;
  onSuccess: (data?: Record<string, unknown>) => void;
}) {
  const formKey = isOpen ? "open" : "closed";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile" size="md">
      <ProfileEditForm
        key={formKey}
        profileData={profileData}
        isArtist={isArtist}
        onSuccess={onSuccess}
        onClose={onClose}
      />
    </Modal>
  );
}

function ProfileEditForm({
  profileData,
  isArtist,
  onSuccess,
  onClose,
}: {
  profileData: {
    phone: string;
    dob: string;
    gender: string;
    address: string;
    stageName: string;
    firstName: string;
    lastName: string;
    managerName?: string | null;
    firstReleaseYear: string | number;
  };
  isArtist: boolean;
  onSuccess: (data?: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const initialValue = {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    phone: profileData.phone,
    dob: profileData.dob ? moment(profileData.dob).format("YYYY-MM-DD") : "",
    gender: profileData.gender,
    address: profileData.address,
    stageName: profileData.stageName,
    firstReleaseYear: profileData.firstReleaseYear,
  };

  const [formData, setFormData] = useState(initialValue);
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
        await artistService.updateMyArtistProfile(
          validatedData.data as Artist.IUpdateMyArtistProfilePayload,
        );
        onSuccess(validatedData.data as unknown as Record<string, unknown>);
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
        await usersService.updateMyProfile(
          validatedData.data as User.IUpdateProfilePayload,
        );
        onSuccess(validatedData.data as unknown as Record<string, unknown>);
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

        {/* Form fields for Artist Details update */}
        {isArtist && (
          <>
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
            <Input
              label="Stage Name"
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              error={errors.stageName}
              placeholder="Enter stage name"
              required
            />
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
            <Input
              label="First Release Year"
              name="firstReleaseYear"
              type="number"
              value={formData.firstReleaseYear}
              onChange={handleChange}
              error={errors.firstReleaseYear}
              placeholder="Enter first release year"
            />
          </>
        )}

        {/* Form fields for Super Admin and Artist Manager */}
        {!isArtist && (
          <>
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
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Enter phone number"
            />
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
          </>
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
