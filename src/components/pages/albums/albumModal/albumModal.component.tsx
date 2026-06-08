import { useState, type ChangeEvent } from "react";
import moment from "moment";
import styles from "./albumModal.module.scss";
import { Modal, Input, Button } from "../../../../common";
import { albumSchema } from "../../../../validationSchema/album.schema";
import { validateData } from "../../../../utils/validation";
import { getErrorMessage } from "../../../../utils";

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album?: Album.IAlbum | null;
  onSubmit: (
    payload: Album.ICreateAlbumPayload | Album.IUpdateAlbumPayload,
    id?: string,
  ) => Promise<void>;
}

export function AlbumModal({
  isOpen,
  onClose,
  album,
  onSubmit,
}: AlbumModalProps) {
  const formKey = isOpen ? album?.id || "create" : "closed";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={album ? "Edit Album" : "Add Album"}
      size="md"
    >
      <AlbumForm
        key={formKey}
        album={album}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}

function AlbumForm({
  album,
  onSubmit,
  onClose,
}: {
  album?: Album.IAlbum | null;
  onSubmit: AlbumModalProps["onSubmit"];
  onClose: () => void;
}) {
  const isEditing = !!album;

  const toDateInputValue = (date: string | null | undefined) => {
    if (!date) return "";
    const m = moment(date);
    return m.isValid() ? m.format("YYYY-MM-DD") : date;
  };

  const initialValue = {
    title: album?.title || "",
    releaseDate: toDateInputValue(album?.release_date),
  };

  const [formData, setFormData] = useState(initialValue);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const schema = isEditing
      ? albumSchema.updateAlbumSchema
      : albumSchema.createAlbumSchema;

    const validatedData = validateData(schema, formData);
    if (!validatedData.success) {
      setErrors(validatedData.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validatedData.data, album?.id);
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
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Enter album title"
        />
        <Input
          label="Release Date"
          name="releaseDate"
          type="date"
          value={formData.releaseDate}
          onChange={handleChange}
          error={errors.releaseDate}
          placeholder="Select release date (optional)"
        />
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
