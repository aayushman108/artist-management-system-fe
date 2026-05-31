import { useRoutes } from "react-router-dom";
import { Routes } from "./routing/routes.app";

function App() {
  const routes = useRoutes(Routes);
  return <main>{routes}</main>;
}

export default App;
