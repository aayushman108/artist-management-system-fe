import { useRoutes } from "react-router-dom";
import { Routes } from "./routing/routes.app";
import { useAuth } from "./context";
import { DashboardLayout } from "./components";

function App() {
  const { isAuthenticated } = useAuth();
  const routes = useRoutes(Routes);
  return <main>{isAuthenticated ? <DashboardLayout /> : routes}</main>;
}

export default App;
