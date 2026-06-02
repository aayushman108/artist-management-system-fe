import { SignupForm } from "./signupForm.component";
import styles from "./signup.module.scss";

export function Signup() {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Company Logo" className={styles.logo} />
          <h1>Create an account</h1>
          <p>Sign up to get started</p>
        </div>
        <SignupForm />
        <div className={styles.footer}>
          <p>
            Already have an account?<a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
