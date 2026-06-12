import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ImportStatus,
  UserRole,
  type ImportStatusType,
  type UserRoleType,
} from "../constants";
import { artistService } from "../services";
import { getErrorMessage } from "../utils";
import { useAuth } from "../context";

const IMPORT_EXPORT_ROLES: UserRoleType[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ARTIST_MANAGER,
];

export function useImportExport(onSuccess: () => void) {
  const { user } = useAuth();

  const canImportExport = IMPORT_EXPORT_ROLES.includes(
    user?.role as UserRoleType,
  );

  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(() =>
    sessionStorage.getItem("importJobId"),
  );

  const [importStatus, setImportStatus] = useState<ImportStatusType>(() =>
    sessionStorage.getItem("importJobId")
      ? ImportStatus.PROCESSING
      : ImportStatus.IDLE,
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<number | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const pollJob = useCallback(
    async function executePoll(id: string, signal: { aborted: boolean }) {
      if (signal.aborted) return;

      try {
        const res = await artistService.getJobStatus(id);

        if (signal.aborted) return;

        const status = res.data;

        if (status.status === ImportStatus.COMPLETED) {
          clearPollTimer();
          sessionStorage.removeItem("importJobId");
          setImportStatus(ImportStatus.COMPLETED);
          setImportResult(status.result?.imported ?? 0);
          setActiveJobId(null);
          toast.success(`Successfully imported ${status.result?.imported ?? 0} artist(s)`);
          onSuccess();
          return;
        }

        if (status.status === ImportStatus.FAILED) {
          clearPollTimer();
          sessionStorage.removeItem("importJobId");
          setImportStatus(ImportStatus.FAILED);
          setImportError(status.error ?? "Import failed");
          setActiveJobId(null);
          return;
        }

        if (!signal.aborted) {
          pollTimerRef.current = setTimeout(
            () => executePoll(id, signal),
            2500,
          );
        }
      } catch (error) {
        if (signal.aborted) return;

        clearPollTimer();
        sessionStorage.removeItem("importJobId");
        setImportStatus(ImportStatus.FAILED);
        setImportError(getErrorMessage(error));
        setActiveJobId(null);
      }
    },
    [clearPollTimer, onSuccess],
  );

  useEffect(() => {
    if (!activeJobId) return;

    const signal = { aborted: false };
    pollTimerRef.current = setTimeout(() => pollJob(activeJobId, signal), 0);

    return () => {
      signal.aborted = true;
      clearPollTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJobStart = useCallback(
    (jobId: string) => {
      clearPollTimer();
      const signal = { aborted: false };
      sessionStorage.setItem("importJobId", jobId);
      setActiveJobId(jobId);
      setImportStatus(ImportStatus.PROCESSING);
      setImportError(null);
      setImportResult(null);
      pollTimerRef.current = setTimeout(() => pollJob(jobId, signal), 2500);
    },
    [clearPollTimer, pollJob],
  );

  const handleImportReset = useCallback(() => {
    setImportStatus(ImportStatus.IDLE);
    setImportError(null);
    setImportResult(null);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setExportLoading(true);
      setExportError(null);
      const blob = await artistService.exportArtists();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().split("T")[0];
      a.download = `artists-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(getErrorMessage(error));
    } finally {
      setExportLoading(false);
    }
  }, []);

  const importing = importStatus === ImportStatus.PROCESSING;

  return {
    canImportExport,
    importModalOpen,
    setImportModalOpen,
    exportLoading,
    exportError,
    activeJobId,
    importStatus,
    importError,
    importResult,
    importing,
    handleJobStart,
    handleImportReset,
    handleExport,
  };
}
