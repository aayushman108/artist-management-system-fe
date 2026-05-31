import React from "react";
import { Modal } from "./modal.common";
import { Button } from "../button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "secondary";
  isLoading?: boolean;
  confirmDisabled?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
  confirmDisabled = false,
}: ConfirmationModalProps) {
  const [localLoading, setLocalLoading] = React.useState(false);
  const isCurrentlyLoading = isLoading || localLoading;

  const handleConfirmClick = async () => {
    let isPromise = false;
    try {
      const result = onConfirm();
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
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disableClose={isCurrentlyLoading}
      title={title}
      size="sm"
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
            variant={confirmVariant}
            onClick={handleConfirmClick}
            isLoading={isCurrentlyLoading}
            disabled={confirmDisabled || isCurrentlyLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ color: "#5f6368", lineHeight: 1.5 }}>{message}</div>
    </Modal>
  );
}
