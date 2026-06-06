import { useCallback, useEffect, useMemo, useState } from "react";
import type { Invitation } from "../@types/invitation";
import { useQuery } from "./useQuery.hook";
import { invitationService } from "../services/invitation.service";
import { getErrorMessage } from "../utils";
import { useUpdateQuery } from "./useUpdateQuery.hook";

export const useSentInvitations = () => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [sentInvitations, setSentInvitations] =
    useState<Invitation.IPaginatedSentInvitationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: Number(query.s_page || 1),
      limit: Number(query.s_limit || 10),
      search: query.s_search || undefined,
      status: query.s_status || undefined,
      role: query.s_role || undefined,
    }),
    [query.s_page, query.s_limit, query.s_search, query.s_status, query.s_role],
  );

  const fetchSentInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invitationService.getSentInvitations(
        filters as Invitation.ISentInvitationParams,
      );
      setSentInvitations(response?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchSentInvitations();
  }, [fetchSentInvitations]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ s_page: String(page) });
    },
    [updateQuery],
  );

  return {
    data: sentInvitations,
    loading,
    error,
    handlePageChange,
    fetchSentInvitations,
  };
};
