import { type RouteObject, Navigate } from "react-router-dom";
import { Login, Signup } from "../components";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const Routes: RouteObject[] = [
  {
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
        element: <div>Home</div>,
      },
      {
        path: "users",
        element: <div>Users</div>,
      },
      {
        path: "artist-managers",
        element: <div>Artist Manager</div>,
      },
      {
        path: "artists",
        element: <div>Artists</div>,
      },
      {
        path: "musics",
        element: <div>Musics</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
];
