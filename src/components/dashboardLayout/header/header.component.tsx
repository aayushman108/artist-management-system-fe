import { useAuth } from "../../../context";
import styles from "./header.module.scss";

export function Header({ sidebarOpen }: { sidebarOpen: boolean }) {
  const { user } = useAuth();
  const companyName = user?.company_name?.split(" ")[0] || "User";

  return (
    <header
      className={`${styles.header} ${!sidebarOpen ? styles.collapsed : ""}`}
    >
      <div className={styles.left}>
        <h1 className={styles.greeting}>{companyName}</h1>
      </div>
    </header>
  );
}
