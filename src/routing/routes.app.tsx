import { type RouteObject, Navigate } from "react-router-dom";
import { Login, Signup } from "../components";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <div>Dashboard</div>,
      },
      {
        path: "artist-manager",
        element: <div>Artist Manager</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
];
