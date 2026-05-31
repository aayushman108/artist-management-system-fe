import { Navigate, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Login, Signup } from "../components";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [],
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
];
