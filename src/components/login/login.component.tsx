import { LoginForm } from "./loginForm.component";
import styles from "./login.module.scss";

export function Login() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Welcome back to</h1>
          <p className={styles.projectName}>Artist Management System</p>
        </div>
        <LoginForm />
        <div className={styles.footer}>
          <p>
            Don't have an account?<a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
