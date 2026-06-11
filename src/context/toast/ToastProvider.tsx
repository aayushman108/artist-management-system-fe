import { Toaster } from "react-hot-toast";

const TOAST_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            fontSize: "14px",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#188038",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#d93025",
              secondary: "#fff",
            },
          },
        }}
      />
      {children}
    </>
  );
}
