import { useRoutes } from "react-router-dom";
import { Routes } from "./routing/routes.app";

function App() {
  return <main>{useRoutes(Routes)}</main>;
}

export default App;
