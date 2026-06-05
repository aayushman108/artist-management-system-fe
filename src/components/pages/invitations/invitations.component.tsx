import { useMemo } from "react";
import { useInvitations, useQuery } from "../../../hooks";
import { InvitationsFilters } from "./invitaionsFilter";
import { InvitationsTable } from "./invitationsTable";

export function InvitationsPage() {
  const {
    data: invitations,
    loading,
    mutationLoading,
    handleSendInvite,
    handleUpdateStatus,
    handleDelete,
  } = useInvitations();
  const query = useQuery();

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

  return (
    <div>
      <h3>Invitations List</h3>
      <InvitationsFilters />
      <InvitationsTable
        data={remappedInvitations}
        isLoading={loading}
        pagination={pagination}
        onSendInvite={handleSendInvite}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        mutationLoading={mutationLoading}
      />
    </div>
  );
}
