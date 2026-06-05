import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import styles from "./dashboardLayout.module.scss";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`${styles.mainContent} ${
          !sidebarOpen ? styles.mainContentCollapsed : ""
        }`}
      >
        <Header sidebarOpen={sidebarOpen} />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
