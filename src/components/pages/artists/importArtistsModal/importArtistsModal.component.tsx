import { useState, useRef, type ChangeEvent } from "react";
import styles from "./importArtistsModal.module.scss";
import { Button, Modal } from "../../../../common";
import { artistService } from "../../../../services";
import { getErrorMessage, validateData } from "../../../../utils";
import {
  HiOutlineUpload,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import { artistSchema } from "../../../../validationSchema/artist.schema";
import Papa from "papaparse";
import { ImportStatus, type ImportStatusType } from "../../../../constants";

interface ImportArtistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  activeJobId: string | null;
  importStatus: ImportStatusType;
  importError: string | null;
  importResult: number | null;
  onJobStart: (jobId: string) => void;
  onReset: () => void;
}

interface ParsedRow {
  row: number;
  email: string;
  first_name: string;
  last_name: string;
  stage_name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: string;
}

interface RowError {
  row: number;
  errors: string[];
}

const EXPECTED_HEADERS = [
  "email",
  "first_name",
  "last_name",
  "stage_name",
  "dob",
  "gender",
  "address",
  "first_release_year",
];

function validateRows(rows: ParsedRow[]): RowError[] {
  const errors: RowError[] = [];
  const emailSet = new Set<string>();

  for (const row of rows) {
    const rowErrors: string[] = [];

    const validatedData = validateData(artistSchema.artistCsvRowSchema, row);

    if (!validatedData.success) {
      for (const [field, message] of Object.entries(validatedData.errors)) {
        rowErrors.push(`${field}: ${message}`);
      }
    }

    const lowerEmail = row.email.toLowerCase().trim();
    if (emailSet.has(lowerEmail)) {
      rowErrors.push("email: Duplicate email in CSV");
    }
    emailSet.add(lowerEmail);

    if (rowErrors.length > 0) {
      errors.push({ row: row.row, errors: rowErrors });
    }
  }

  return errors;
}

export function ImportArtistsModal({
  isOpen,
  onClose,
  onJobStart,
  onReset,
  importStatus,
  importError,
  importResult,
}: ImportArtistsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<RowError[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handler for file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setUploadError(null);
    setValidationErrors([]);
    setParsedRows([]);

    if (selected.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    if (!selected.name.endsWith(".csv") && selected.type !== "text/csv") {
      setUploadError("File must be a CSV file");
      return;
    }

    setFile(selected);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;

      const result = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(),
      });

      if (!result.data || result.data.length === 0) {
        setUploadError("CSV file contains no valid data rows");
        return;
      }

      const csvHeaders = Object.keys(result.data[0]);
      const headerMatch = EXPECTED_HEADERS.every((h) => csvHeaders.includes(h));
      if (!headerMatch) {
        setUploadError(
          `CSV headers must include: ${EXPECTED_HEADERS.join(", ")}`,
        );
        return;
      }

      const rows: ParsedRow[] = result.data.map((row, i) => ({
        row: i + 1,
        email: row.email ?? "",
        first_name: row.first_name ?? "",
        last_name: row.last_name ?? "",
        stage_name: row.stage_name ?? "",
        dob: row.dob ?? "",
        gender: row.gender ?? "",
        address: row.address ?? "",
        first_release_year: row.first_release_year ?? "",
      }));

      setParsedRows(rows);

      try {
        const errors = validateRows(rows);
        setValidationErrors(errors);
      } catch {
        setUploadError("An unexpected error occurred while validating the CSV");
      }
    };
    reader.readAsText(selected);
  };

  const handleImport = async () => {
    if (!file || validationErrors.length > 0) return;

    try {
      setUploading(true);
      setUploadError(null);

      const res = await artistService.importArtists(file);
      const id = res.data?.jobId;

      if (!id) {
        throw new Error("Backend did not return a job ID");
      }

      setUploading(false);
      onJobStart(id);
    } catch (error) {
      setUploading(false);
      setUploadError(getErrorMessage(error));
    }
  };

  const handleTryAgain = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadError(null);
    onReset();
  };

  const handleClose = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadError(null);
    setUploading(false);
    onClose();
  };

  const hasValidationErrors = validationErrors.length > 0;

  const canImport =
    file &&
    parsedRows.length > 0 &&
    !hasValidationErrors &&
    importStatus === ImportStatus.IDLE;

  const errorRowSet = new Set(validationErrors.map((e) => e.row));

  const isProcessing = importStatus === ImportStatus.PROCESSING || uploading;

  const renderResult = () => {
    if (importStatus === ImportStatus.COMPLETED) {
      return (
        <>
          <div className={styles.successBanner}>
            <HiOutlineCheckCircle />
            <span>Successfully imported {importResult} artist(s).</span>
          </div>
        </>
      );
    }

    if (importStatus === ImportStatus.FAILED) {
      return (
        <>
          <div className={styles.errorBanner}>
            <HiOutlineExclamationCircle />
            <span>{importError ?? "Import failed"}</span>
          </div>
          <div className={styles.resultActions}>
            <Button onClick={handleTryAgain}>Try Again</Button>
          </div>
        </>
      );
    }

    return null;
  };

  const renderProcessing = () => (
    <div className={styles.loadingBanner}>
      <CgSpinner className={styles.spinner} />
      <span>Processing import…</span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        importStatus === ImportStatus.COMPLETED
          ? "Import Complete"
          : importStatus === ImportStatus.FAILED
            ? "Import Failed"
            : "Import Artists from CSV"
      }
      size="lg"
      disableClose={false}
      footer={
        <>
          {importStatus === ImportStatus.IDLE && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                isLoading={uploading}
                disabled={!canImport}
              >
                <span className={styles.btnContent}>
                  <HiOutlineUpload />
                  Import
                </span>
              </Button>
            </>
          )}
          {importStatus !== ImportStatus.IDLE && (
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          )}
        </>
      }
    >
      <div className={styles.importModal}>
        {importStatus === ImportStatus.IDLE && (
          <>
            {/* CSV file upload section */}
            <div
              className={styles.csvUploader}
              onClick={() => fileInputRef.current?.click()}
            >
              <HiOutlineUpload className={styles.uploadIcon} />
              <p>{file ? file.name : "Click to select CSV file"}</p>
              {file && (
                <span className={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                hidden
              />
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className={styles.errorBanner}>
                <HiOutlineExclamationCircle />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Validation error from zod validation schema */}
            {hasValidationErrors && (
              <div className={styles.validationSummary}>
                <strong>
                  CSV has {validationErrors.length} invalid row(s):
                </strong>
                {validationErrors.map((ve) => (
                  <p key={ve.row} className={styles.validationRow}>
                    Row {ve.row}: {ve.errors.join("; ")}
                  </p>
                ))}
              </div>
            )}

            {/* Preview parsed data */}
            {parsedRows.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Email</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Stage Name</th>
                      <th>DOB</th>
                      <th>Gender</th>
                      <th>Address</th>
                      <th>First Release Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row) => (
                      <tr
                        key={row.row}
                        className={
                          errorRowSet.has(row.row) ? styles.errorRow : ""
                        }
                      >
                        <td>{row.row}</td>
                        <td>{row.email}</td>
                        <td>{row.first_name}</td>
                        <td>{row.last_name || "-"}</td>
                        <td>{row.stage_name}</td>
                        <td>{row.dob || "-"}</td>
                        <td>{row.gender || "-"}</td>
                        <td>{row.address || "-"}</td>
                        <td>{row.first_release_year || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Show data processing loader */}
        {isProcessing && renderProcessing()}

        {/* Show import result */}
        {(importStatus === ImportStatus.COMPLETED ||
          importStatus === ImportStatus.FAILED) &&
          renderResult()}
      </div>
    </Modal>
  );
}
