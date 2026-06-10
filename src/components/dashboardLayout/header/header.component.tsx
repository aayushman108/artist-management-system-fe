import { UserRoleMeta } from "../../../constants";
import { useAuth } from "../../../context";
import styles from "./header.module.scss";

export function Header({ sidebarOpen }: { sidebarOpen: boolean }) {
  const { user } = useAuth();
  const userName = [
    user?.first_name,
    user?.last_name,
    `( ${UserRoleMeta[user!.role].label} )`,
  ].join(" ");

  return (
    <header
      className={`${styles.header} ${!sidebarOpen ? styles.collapsed : ""}`}
    >
      <div className={styles.left}>
        <h1 className={styles.greeting}>{userName}</h1>
      </div>
    </header>
  );
}
