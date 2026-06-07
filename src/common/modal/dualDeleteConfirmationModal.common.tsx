import React, { useState } from "react";
import { Modal } from "./modal.common";
import { Button } from "../button";
import styles from "./dualDeleteConfirmationModal.module.scss";
import { DeleteType, type DeleteTypeType } from "../../constants";

interface DualDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  onSoftDelete: () => void | Promise<void>;
  onHardDelete: () => void | Promise<void>;
  softDeleteDisabled?: boolean;
  hardDeleteDisabled?: boolean;
  softDeleteDescription?: string;
  hardDeleteDescription?: string;
  softDeleteLabel?: string;
  hardDeleteLabel?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DualDeleteConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  onSoftDelete,
  onHardDelete,
  softDeleteDisabled = false,
  hardDeleteDisabled = false,
  softDeleteDescription,
  hardDeleteDescription,
  softDeleteLabel = "Soft Delete",
  hardDeleteLabel = "Hard Delete",
  cancelText = "Cancel",
  isLoading = false,
}: DualDeleteConfirmationModalProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<DeleteTypeType | null>(null);
  const isCurrentlyLoading = isLoading || localLoading;

  const handleAction = async (
    action: DeleteTypeType,
    handler: () => void | Promise<void>,
  ) => {
    setActiveAction(action);
    let isPromise = false;
    try {
      const result = handler();
      if (result instanceof Promise) {
        isPromise = true;
        setLocalLoading(true);
        await result;
      }
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      if (isPromise) {
        setLocalLoading(false);
      }
      setActiveAction(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disableClose={isCurrentlyLoading}
      title={title}
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isCurrentlyLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAction(DeleteType.SOFT, onSoftDelete)}
            isLoading={isCurrentlyLoading && activeAction === DeleteType.SOFT}
            disabled={softDeleteDisabled || isCurrentlyLoading}
          >
            {`${softDeleteLabel}`}
          </Button>
          <Button
            variant="danger"
            onClick={() => handleAction(DeleteType.HARD, onHardDelete)}
            isLoading={isCurrentlyLoading && activeAction === DeleteType.HARD}
            disabled={hardDeleteDisabled || isCurrentlyLoading}
          >
            {hardDeleteLabel}
          </Button>
        </>
      }
    >
      <div className={styles.body}>
        <p className={styles.message}>{message}</p>

        {(softDeleteDescription || hardDeleteDescription) && (
          <div className={styles.descriptionsContainer}>
            {softDeleteDescription && (
              <div className={styles.description}>
                <span className={styles.descriptionLabel}>
                  {`${softDeleteLabel}${softDeleteDisabled ? " (Disabled)" : ""}`}
                </span>
                <span className={styles.descriptionText}>
                  {softDeleteDescription}
                </span>
              </div>
            )}
            {hardDeleteDescription && (
              <div className={`${styles.description} ${styles.danger}`}>
                <span className={styles.descriptionLabel}>
                  {`${hardDeleteLabel}${hardDeleteDisabled ? " (Disabled)" : ""}`}
                </span>
                <span className={styles.descriptionText}>
                  {hardDeleteDescription}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
