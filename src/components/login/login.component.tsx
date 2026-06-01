import { LoginForm } from "./loginForm.component";
import styles from "./login.module.scss";

export function Login() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <img src="/logo.png" alt="Company Logo" className={styles.logo} />
          <h1>Welcome back</h1>
          <p>Sign in to manage your profile</p>
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
