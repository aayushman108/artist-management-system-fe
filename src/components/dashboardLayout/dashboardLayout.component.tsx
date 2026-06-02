import { useState } from "react";
import { useRoutes } from "react-router-dom";
import { Routes } from "../../routing/routes.app";
import { Sidebar } from "./sidebar";
import styles from "./dashboardLayout.module.scss";

export function DashboardLayout() {
  const routes = useRoutes(Routes);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`${styles.mainContent} ${
          !sidebarOpen ? styles.mainContentCollapsed : ""
        }`}
      >
        {routes}
      </div>
    </div>
  );
}
