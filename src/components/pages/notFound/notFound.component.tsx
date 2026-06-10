import { useNavigate } from "react-router-dom";
import { Button } from "../../../common";
import styles from "./notFound.module.scss";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundPage}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
