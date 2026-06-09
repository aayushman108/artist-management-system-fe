import { useParams } from "react-router-dom";
import { ArtistsPage } from "../artists";
import { UserDetailsCard } from "../../../common";
import styles from "./artistManagerDetails.module.scss";

export function ArtistManagerDetailsPage() {
  const { managerId } = useParams();

  if (!managerId) return null;

  return (
    <div className={styles.container}>
      <UserDetailsCard managerId={managerId} />

      <div className={styles.artistsSection}>
        <ArtistsPage />
      </div>
    </div>
  );
}
