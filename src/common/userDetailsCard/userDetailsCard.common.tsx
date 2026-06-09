import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Badge } from "../badge/badge.common";
import { UserRoleMeta, UserStatusMeta, UserRole } from "../../constants";
import { usersService } from "../../services";
import styles from "./userDetailsCard.module.scss";
import type { User } from "../../@types/user";

interface DetailField {
  label: string;
  value: string | number | null | undefined;
  isDate?: boolean;
}

interface UserSection {
  title?: string;
  fields: DetailField[];
}

interface UserDetailsCardProps {
  artistId?: string;
  managerId?: string;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFieldValue(field: DetailField): string {
  if (field.value === null || field.value === undefined) return "—";
  if (field.isDate) {
    return field.value ? moment(field.value).format("ll") : "—";
  }
  return String(field.value) || "—";
}

export function UserDetailsCard({ artistId, managerId }: UserDetailsCardProps) {
  const [artistData, setArtistData] = useState<User.IExtendedUser | null>(null);
  const [managerData, setManagerData] = useState<User.IExtendedUser | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const isManagerDetailsPage = useMemo(() => {
    return !!managerId && !artistId;
  }, [managerId, artistId]);

  // Fetch manager details or artist details based on their user id
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!artistId && !managerId) {
          throw new Error("Either artistId or managerId must be available");
        }

        const [artistRes, managerRes] = await Promise.all([
          artistId ? usersService.getUserById(artistId) : Promise.resolve(null),
          managerId
            ? usersService.getUserById(managerId)
            : Promise.resolve(null),
        ]);

        setArtistData(artistRes?.data || null);
        setManagerData(managerRes?.data || null);
      } catch {
        setArtistData(null);
        setManagerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId, managerId]);

  const primaryUser = artistData || managerData;

  const sections = useMemo(() => {
    if (!primaryUser) return [];

    const isArtist = primaryUser.user.role === UserRole.ARTIST;
    const currentSections: UserSection[] = [];

    if (isArtist) {
      const artist = primaryUser.artist;

      const genderLabel = artist?.gender ? capitalize(artist.gender) : null;

      const managerName = managerData
        ? `${managerData.user.first_name} ${managerData.user.last_name}`
        : artist?.artist_manager_name || null;

      currentSections.push({
        fields: [
          { label: "Stage Name", value: artist?.stage_name },
          { label: "Phone", value: primaryUser.profile?.phone },
          { label: "Date of Birth", value: artist?.dob, isDate: true },
          { label: "Gender", value: genderLabel },
          { label: "Address", value: artist?.address },
          { label: "First Release Year", value: artist?.first_release_year },
          { label: "Artist Manager", value: managerName },
        ],
      });
    } else {
      const profile = primaryUser.profile;
      const genderLabel = profile?.gender ? capitalize(profile.gender) : null;

      currentSections.push({
        fields: [
          { label: "Phone", value: profile?.phone },
          { label: "Date of Birth", value: profile?.dob, isDate: true },
          { label: "Gender", value: genderLabel },
          { label: "Address", value: profile?.address },
          { label: "Created By", value: primaryUser.user.creator_name },
        ],
      });
    }

    if (managerData && !isManagerDetailsPage) {
      currentSections.push({
        title: "Manager Details",
        fields: [
          {
            label: "Name",
            value: `${managerData.user.first_name} ${managerData.user.last_name}`,
          },
          { label: "Email", value: managerData.user.email },
        ],
      });
    }

    return currentSections;
  }, [primaryUser, managerData, isManagerDetailsPage]);

  if (loading || !primaryUser) return null;

  const fullName = `${primaryUser.user.first_name} ${primaryUser.user.last_name}`;
  const roleLabel = UserRoleMeta[primaryUser.user.role]?.label || "";
  const statusMeta =
    UserStatusMeta[primaryUser.user.status as keyof typeof UserStatusMeta];

  return (
    <div className={styles.userCard}>
      <div className={styles.userCardTop}>
        <div className={styles.basicInfo}>
          <h2 className={styles.name}>{fullName}</h2>
          <p className={styles.email}>{primaryUser.user.email}</p>
        </div>
        <div className={styles.badges}>
          <Badge
            variant={UserRoleMeta[primaryUser.user.role]?.badgeVariant}
            label={roleLabel}
          />
          {statusMeta && (
            <Badge variant={statusMeta.badgeVariant} label={statusMeta.label} />
          )}
        </div>
      </div>

      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {section.title && (
            <h3 className={styles.sectionTitle}>{section.title}</h3>
          )}
          <div className={styles.detailGrid}>
            {section.fields.map((field, fieldIdx) => (
              <div key={fieldIdx} className={styles.detailCard}>
                <span className={styles.detailLabel}>{field.label}</span>
                <span className={styles.detailValue}>
                  {formatFieldValue(field)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
