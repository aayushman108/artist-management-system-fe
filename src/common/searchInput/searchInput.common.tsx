import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import styles from "./searchInput.module.scss";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  size?: "sm" | "md";
}

export function SearchInput({
  label,
  size = "md",
  className = "",
  id,
  ...props
}: SearchInputProps) {
  const inputId = id || "search";

  return (
    <div
      className={`${styles.inputGroup} ${size === "sm" ? styles.sm : ""} ${className}`}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        <HiOutlineSearch className={styles.icon} />
        <input
          id={inputId}
          type="text"
          className={`${styles.input} ${size === "sm" ? styles.inputSm : ""}`}
          {...props}
        />
      </div>
    </div>
  );
}
