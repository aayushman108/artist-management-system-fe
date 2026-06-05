import styles from "./spinner.module.scss";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size, className = "" }: SpinnerProps) {
  return (
    <span
      className={`${styles.spinner} ${className}`}
      style={size ? { width: size, height: size } : undefined}
      role="status"
      aria-label="Loading"
    />
  );
}
