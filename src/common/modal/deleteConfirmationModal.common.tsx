import { ConfirmationModal } from "./confirmationModal.common";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName = "this item",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={
        <span>
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </span>
      }
      confirmText="Delete"
      confirmVariant="danger"
      isLoading={isLoading}
    />
  );
}
