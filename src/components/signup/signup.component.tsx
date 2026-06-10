import { SignupForm } from "./signupForm.component";
import { InvitationRequestForm } from "./invitationRequestForm.component";
import styles from "./signup.module.scss";
import { authService } from "../../services/auth.service";
import { useEffect, useState } from "react";
import { Spinner } from "../../common";

export function Signup() {
  const [isLoading, setIsLoading] = useState(true);
  const [signupAllowed, setSignupAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authService.checkSignupEligibility();
        setSignupAllowed(data.isSignupAllowed);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.signupContainer}>
        <div className={`${styles.signupCard} ${styles.loadingCard}`}>
          <Spinner size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1>{signupAllowed ? "Create an account" : "Request Invitation"}</h1>
          <p className={styles.projectName}>Artist Management System</p>
        </div>
        {signupAllowed ? <SignupForm /> : <InvitationRequestForm />}
        <div className={styles.footer}>
          <p>
            Already have an account?<a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
