import styles from "./badge.module.scss";

interface BadgeProps {
  variant: string;
  label: string;
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant] || ""}`}>{label}</span>
  );
}
