import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiLogOut, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../../../context";
import { ConfirmationModal } from "../../../common/modal";
import styles from "./sidebar.module.scss";
import { getInitials } from "../../../utils";
import {
  DASHBOARD_NAV_ITEMS,
  type UserRoleType,
} from "../../../constants/general.constant";

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ""}`}
      >
        <div className={styles.logo}>
          <Link
            to="/"
            onClick={(e) => {
              if (!sidebarOpen) {
                e.preventDefault();
                setSidebarOpen(true);
              }
            }}
          >
            <img src="/logo.png" alt="Logo" className={styles.logoIcon} />
            <span>Artist Management System</span>
          </Link>
          <button
            className={styles.collapseBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <FiChevronLeft
              style={{
                transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        <nav className={styles.nav}>
          {DASHBOARD_NAV_ITEMS[user?.role as UserRoleType].map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            className={`${styles.navItem} ${styles.logoutBtn}`}
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>

        <div className={styles.userSection}>
          <Link to="/profile" className={styles.userCard}>
            <div className={styles.avatar}>
              {getInitials([user?.first_name, user?.last_name].join(" "))}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.first_name}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </Link>
        </div>
      </aside>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        confirmVariant="danger"
      />
    </>
  );
}
