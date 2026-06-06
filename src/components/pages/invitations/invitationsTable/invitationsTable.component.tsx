import { useCallback, useState } from "react";
import styles from "./invitationsTable.module.scss";
import {
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import {
  UserRoleMeta,
  type UserRoleType,
} from "../../../../constants/general.constant";
import {
  Badge,
  Table,
  ConfirmationModal,
  DeleteConfirmationModal,
  type Column,
} from "../../../../common";
import {
  InvitationRequestStatus,
  InvitationRequestStatusMeta,
  type InvitationRequestStatusType,
} from "../../../../constants";

interface IInvitation {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  status: InvitationRequestStatusType;
}

interface IInvitationsTableProps {
  data: IInvitation[];
  isLoading?: boolean;
  pagination?: Common.IPagination;
  onSendInvite: (id: string) => Promise<void>;
  onUpdateStatus: (
    id: string,
    status: InvitationRequestStatusType,
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPageChange?: (page: number) => void;
  mutationLoading?: boolean;
}

export function InvitationsTable({
  data,
  isLoading,
  pagination,
  onSendInvite,
  onUpdateStatus,
  onDelete,
  onPageChange,
  mutationLoading,
}: IInvitationsTableProps) {
  const [activeModal, setActiveModal] = useState<{
    type: "send" | "toggle" | "delete";
    invitation: IInvitation;
  } | null>(null);

  const columns: Column<IInvitation>[] = [
    {
      header: "Name",
      key: "name",
      render: (user) => <span>{user.name}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (user) => <span>{user.email}</span>,
    },
    {
      header: "Role",
      key: "role",
      render: (user) => {
        return (
          <Badge
            variant={UserRoleMeta[user.role].badgeVariant}
            label={UserRoleMeta[user.role].label}
          />
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (user) => {
        return (
          <Badge
            variant={
              InvitationRequestStatusMeta[
                user.status as keyof typeof InvitationRequestStatusMeta
              ].badgeVariant
            }
            label={
              InvitationRequestStatusMeta[
                user.status as keyof typeof InvitationRequestStatusMeta
              ].label
            }
          />
        );
      },
    },
  ];

  const renderActions = useCallback(
    (invitation: IInvitation) => (
      <>
        {invitation.status !== InvitationRequestStatus.INVITED && (
          <button
            className={`${styles.actionBtn} ${styles.send}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal({ type: "send", invitation });
            }}
            title="Send Invite"
          >
            <HiOutlinePaperAirplane />
          </button>
        )}

        {(invitation.status === InvitationRequestStatus.PENDING ||
          invitation.status === InvitationRequestStatus.REJECTED) && (
          <button
            className={`${styles.actionBtn} ${styles.toggle}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal({ type: "toggle", invitation });
            }}
            title={
              invitation.status === InvitationRequestStatus.PENDING
                ? "Reject"
                : "Set as Pending"
            }
          >
            {invitation.status === InvitationRequestStatus.PENDING ? (
              <HiOutlineXCircle />
            ) : (
              <HiOutlineCheckCircle />
            )}
          </button>
        )}

        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveModal({ type: "delete", invitation });
          }}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </>
    ),
    [],
  );

  return (
    <>
      <Table<IInvitation>
        data={data}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        actions={renderActions}
      />

      {activeModal?.type === "send" && (
        <ConfirmationModal
          isOpen
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            onSendInvite(activeModal.invitation.id);
          }}
          title="Send Invite"
          message={
            <span>
              Are you sure you want to send an invitation to{" "}
              <strong>{activeModal.invitation.name}</strong>?
            </span>
          }
          confirmText="Send"
          confirmVariant="primary"
          isLoading={mutationLoading}
        />
      )}

      {activeModal?.type === "toggle" && (
        <ConfirmationModal
          isOpen
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            onUpdateStatus(
              activeModal.invitation.id,
              activeModal.invitation.status === InvitationRequestStatus.PENDING
                ? InvitationRequestStatus.REJECTED
                : InvitationRequestStatus.PENDING,
            );
          }}
          title={
            activeModal.invitation.status === InvitationRequestStatus.PENDING
              ? "Reject Invitation"
              : "Set as Pending"
          }
          message={
            activeModal.invitation.status ===
            InvitationRequestStatus.PENDING ? (
              <span>
                Are you sure you want to reject the invitation for{" "}
                <strong>{activeModal.invitation.name}</strong>?
              </span>
            ) : (
              <span>
                Are you sure you want to set the invitation for{" "}
                <strong>{activeModal.invitation.name}</strong> back to pending?
              </span>
            )
          }
          confirmText={
            activeModal.invitation.status === InvitationRequestStatus.PENDING
              ? "Reject"
              : "Set as Pending"
          }
          confirmVariant={
            activeModal.invitation.status === InvitationRequestStatus.PENDING
              ? "danger"
              : "primary"
          }
          isLoading={mutationLoading}
        />
      )}

      {activeModal?.type === "delete" && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            onDelete(activeModal.invitation.id);
          }}
          title="Delete Invitation"
          itemName={activeModal.invitation.name}
          isLoading={mutationLoading}
        />
      )}
    </>
  );
}
