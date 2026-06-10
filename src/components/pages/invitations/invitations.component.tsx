import { useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { useInvitations, useQuery, useSentInvitations } from "../../../hooks";
import { InvitationsFilters } from "./invitaionsFilter";
import { InvitationsTable } from "./invitationsTable";
import { SentInvitationsFilters } from "./sentInvitationsFilter";
import { SentInvitationsTable } from "./sentInvitationsTable";
import { InviteUserModal } from "./inviteUserModal";
import { Button } from "../../../common";
import { useAuth } from "../../../context";
import { UserRole } from "../../../constants/general.constant";
import styles from "./invitations.module.scss";

export function InvitationsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const {
    data: invitations,
    loading,
    mutationLoading,
    handleSendInvite,
    handleUpdateStatus,
    handleDelete,
    handlePageChange,
  } = useInvitations(isSuperAdmin);

  const {
    data: sentInvitations,
    loading: sentLoading,
    handlePageChange: handleSentPageChange,
    fetchSentInvitations,
  } = useSentInvitations();

  const query = useQuery();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const remappedInvitations = useMemo(() => {
    return Array.isArray(invitations?.data)
      ? invitations?.data?.map((invitation) => {
          return {
            id: invitation?.id,
            name: `${invitation?.first_name} ${invitation?.last_name}`,
            email: invitation?.email,
            role: invitation?.role,
            status: invitation?.status,
          };
        })
      : [];
  }, [invitations?.data]);

  const pagination = useMemo(() => {
    return {
      currentPage: Number(query.page) || 1,
      totalPages: invitations?.pagination?.totalPages || 0,
      totalResults: invitations?.pagination?.total || 0,
      pageSize: Number(query.limit) || 10,
    };
  }, [invitations?.pagination, query.limit, query.page]);

  const remappedSentInvitations = useMemo(() => {
    return Array.isArray(sentInvitations?.data)
      ? sentInvitations?.data?.map((invitation) => {
          return {
            id: invitation?.id,
            name: invitation?.name,
            email: invitation?.email,
            role: invitation?.role,
            status: invitation?.status,
            invitedBy: invitation?.invited_by,
            expiresAt: invitation?.expires_at
              ? new Date(invitation?.expires_at).toLocaleDateString()
              : "-",
          };
        })
      : [];
  }, [sentInvitations?.data]);

  const sentPagination = useMemo(() => {
    return {
      currentPage: Number(query.s_page) || 1,
      totalPages: sentInvitations?.pagination?.totalPages || 0,
      totalResults: sentInvitations?.pagination?.total || 0,
      pageSize: Number(query.s_limit) || 10,
    };
  }, [sentInvitations?.pagination, query.s_limit, query.s_page]);

  return (
    <div className={styles.invitationsPageContainer}>
      {/* --- Invitation Requests Section --- */}
      {isSuperAdmin && (
        <div className={styles.invitationRequestsContainer}>
          <div className={styles.headerRow}>
            <h3>Invitation Requests</h3>
          </div>
          <InvitationsFilters />
          <InvitationsTable
            data={remappedInvitations}
            isLoading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSendInvite={async (id: string) => {
              await handleSendInvite(id);
              await fetchSentInvitations();
            }}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            mutationLoading={mutationLoading}
          />
        </div>
      )}

      {/* --- Sent Invitations Section --- */}
      <div className={styles.sentInvitationsContainer}>
        <div className={styles.headerRow}>
          <h3>Sent Invitations</h3>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <HiOutlinePlus size={16} /> Invite
          </Button>
        </div>
        <div className={styles.filterRow}>
          <SentInvitationsFilters />
        </div>
        <SentInvitationsTable
          data={remappedSentInvitations}
          isLoading={sentLoading}
          pagination={sentPagination}
          onPageChange={handleSentPageChange}
        />
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        fetchSentInvitations={fetchSentInvitations}
      />
    </div>
  );
}
