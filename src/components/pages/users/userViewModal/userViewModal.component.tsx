import moment from "moment";
import { Modal, Badge } from "../../../../common";
import { UserRoleMeta, UserStatusMeta } from "../../../../constants";
import styles from "./userViewModal.module.scss";
import type { User } from "../../../../@types/user";

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User.IExtendedUser | null;
}

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const roleLabel = UserRoleMeta[user.user.role]?.label || user.user.role;
  const statusLabel =
    UserStatusMeta[user.user.status as keyof typeof UserStatusMeta]?.label ||
    user.user.status;
  const genderLabel = user.profile?.gender
    ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      <div className={styles.body}>
        <div className={styles.field}>
          <span className={styles.label}>First Name</span>
          <span className={styles.value}>{user.user.first_name || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Last Name</span>
          <span className={styles.value}>{user.user.last_name || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user.user.email}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Role</span>
          <span className={styles.value}>
            <Badge
              variant={UserRoleMeta[user.user.role].badgeVariant}
              label={roleLabel}
            />
          </span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Status</span>
          <span className={styles.value}>
            <Badge
              variant={
                UserStatusMeta[user.user.status as keyof typeof UserStatusMeta]
                  .badgeVariant
              }
              label={statusLabel}
            />
          </span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Phone</span>
          <span className={styles.value}>{user.profile?.phone || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Date of Birth</span>
          <span className={styles.value}>
            {user.profile?.dob ? moment(user.profile.dob).format("ll") : "—"}
          </span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Gender</span>
          <span className={styles.value}>{genderLabel || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Address</span>
          <span className={styles.value}>{user.profile?.address || "—"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Created By</span>
          <span className={styles.value}>{user.user.creator_name || "—"}</span>
        </div>
      </div>
    </Modal>
  );
}
