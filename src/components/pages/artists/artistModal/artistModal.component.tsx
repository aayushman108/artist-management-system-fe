import { useState, type ChangeEvent } from "react";
import moment from "moment";
import styles from "./artistModal.module.scss";
import { Modal, Input, Select, Button } from "../../../../common";
import { artistSchema } from "../../../../validationSchema/artist.schema";
import { validateData } from "../../../../utils/validation";
import { getErrorMessage } from "../../../../utils";
import { GENDER_ARR } from "../../../../constants";
import { usePermissions } from "../../../../hooks";

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist?: Artist.IArtist | null;
  managers?: Artist.IManagerOption[];
  onSubmit: (
    payload: Artist.IUpdateArtistPayload,
    id?: string,
  ) => Promise<void>;
}

export function ArtistModal({
  isOpen,
  onClose,
  artist,
  managers = [],
  onSubmit,
}: ArtistModalProps) {
  const formKey = isOpen ? artist?.id || "create" : "closed";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={artist ? "Edit Artist" : "Add Artist"}
      size="md"
    >
      <ArtistForm
        key={formKey}
        artist={artist}
        managers={managers}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}

function ArtistForm({
  artist,
  managers,
  onSubmit,
  onClose,
}: {
  artist?: Artist.IArtist | null;
  managers: Artist.IManagerOption[];
  onSubmit: ArtistModalProps["onSubmit"];
  onClose: () => void;
}) {
  const { isSuperAdmin } = usePermissions();

  const isEditing = !!artist;

  const initialValue = {
    stageName: artist?.stage_name || "",
    dob: artist?.dob ? moment(artist?.dob).format("YYYY-MM-DD") : "",
    gender: artist?.gender || "",
    address: artist?.address || "",
    firstReleaseYear: artist?.first_release_year?.toString() || "",
    managerId: artist?.manager_id || "",
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

    const validatedData = validateData(
      artistSchema.updateArtistSchema,
      formData,
    );
    if (!validatedData.success) {
      setErrors(validatedData.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validatedData.data, artist?.id);
      onClose();
    } catch (error) {
      setErrors({ _global: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formBody}>
        {errors._global && (
          <div className={styles.globalError}>{errors._global}</div>
        )}
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
          placeholder="Select date of birth"
        />
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={errors.gender}
          options={[{ value: "", label: "None" }, ...GENDER_ARR]}
          placeholder="Select gender"
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
        {isSuperAdmin && (
          <Select
            label="Manager"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            error={errors.managerId}
            options={[
              { value: "", label: "None" },
              ...managers.map((m) => ({ value: m.id, label: m.name })),
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
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
