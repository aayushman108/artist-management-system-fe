import { useLocation, useParams } from "react-router-dom";
import { MusicsPage } from "../musics";
import { UserDetailsCard } from "../../../common";
import styles from "./artistDetails.module.scss";
import { useMemo } from "react";
import { useQuery } from "../../../hooks";

export function ArtistDetailsPage() {
  const { managerId, artistId } = useParams();
  const query = useQuery();

  const { pathname } = useLocation();

  const isArtistsDetailsPage = useMemo(
    () => pathname.includes("/artists/"),
    [pathname],
  );

  if (!artistId) return null;

  return (
    <div className={styles.container}>
      <UserDetailsCard
        artistId={isArtistsDetailsPage ? query?.userId : artistId}
        managerId={managerId}
      />

      <div className={styles.musicsSection}>
        <MusicsPage />
      </div>
    </div>
  );
}
