import { useCallback, useEffect, useMemo, useState } from "react";
import type { Invitation } from "../@types/invitation";
import { useQuery } from "./useQuery.hook";
import { invitationService } from "../services/invitation.service";
import { getErrorMessage } from "../utils";

export const useInvitations = () => {
  const query = useQuery();

  const [invitations, setInvitations] =
    useState<Invitation.IPaginatedInvitationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
      search: query.search || undefined,
      status: query.status || undefined,
      role: query.role || undefined,
    }),
    [query],
  );

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invitationService.getInvitationRequests(
        filters as Invitation.IInvitationRequestParams,
      );
      setInvitations(response?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSendInvite = useCallback(
    async (id: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await invitationService.sendInvitation(id);
        fetchInvitations();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchInvitations],
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await invitationService.updateInvitationStatus(id, { status });
        fetchInvitations();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchInvitations],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await invitationService.deleteInvitation(id);
        fetchInvitations();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchInvitations],
  );

  return {
    data: invitations,
    loading,
    error,
    mutationLoading,
    mutationError,
    handleSendInvite,
    handleUpdateStatus,
    handleDelete,
  };
};
