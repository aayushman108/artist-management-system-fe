import { useState, type ChangeEvent } from "react";
import moment from "moment";
import styles from "./musicModal.module.scss";
import { Modal, Input, Button } from "../../../../common";
import { musicSchema } from "../../../../validationSchema/music.schema";
import { validateData } from "../../../../utils/validation";
import { getErrorMessage } from "../../../../utils";

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  music?: Music.IMusic | null;
  onSubmit: (
    payload: Music.ICreateMusicPayload | Music.IUpdateMusicPayload,
    id?: string,
  ) => Promise<void>;
}

export function MusicModal({
  isOpen,
  onClose,
  music,
  onSubmit,
}: MusicModalProps) {
  const formKey = isOpen ? music?.id || "create" : "closed";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={music ? "Edit Music" : "Add Music"}
      size="md"
    >
      <MusicForm
        key={formKey}
        music={music}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}

function MusicForm({
  music,
  onSubmit,
  onClose,
}: {
  music?: Music.IMusic | null;
  onSubmit: MusicModalProps["onSubmit"];
  onClose: () => void;
}) {
  const isEditing = !!music;

  const toDateInputValue = (date: string | null | undefined) => {
    if (!date) return "";
    const m = moment(date);
    return m.isValid() ? m.format("YYYY-MM-DD") : date;
  };

  const initialValue = {
    title: music?.title || "",
    albumId: music?.album_id || "",
    genre: music?.genre || "",
    language: music?.language || "",
    releaseDate: toDateInputValue(music?.release_date),
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

    const schema = isEditing
      ? musicSchema.updateMusicSchema
      : musicSchema.createMusicSchema;

    const validatedData = validateData(schema, formData);
    if (!validatedData.success) {
      setErrors(validatedData.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validatedData.data, music?.id);
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
          placeholder="Enter music title"
        />
        <Input
          label="Album ID"
          name="albumId"
          value={formData.albumId}
          onChange={handleChange}
          error={errors.albumId}
          placeholder="Enter album ID (optional)"
        />
        <Input
          label="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          error={errors.genre}
          placeholder="Enter genre (optional)"
        />
        <Input
          label="Language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          error={errors.language}
          placeholder="Enter language (optional)"
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
