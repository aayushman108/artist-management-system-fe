import { type RouteObject, Navigate } from "react-router-dom";
import {
  AcceptInvite,
  ArtistsPage,
  DashboardLayout,
  InvitationsPage,
  Login,
  Signup,
  UsersPage,
} from "../components";
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
      {
        path: "accept-invite",
        element: <AcceptInvite />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <div>Home</div>,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "users/super-admin/:userId",
            element: <div>User Details</div>,
          },
          {
            path: "users/artist-manager/:userId",
            element: <div>Artist Manager Details</div>,
          },
          {
            path: "users/artist-manager/:userId/artists/:artistId",
            element: <div>Artist Details</div>,
          },
          {
            path: "users/artist/:userId",
            element: <div>Artist Details</div>,
          },
          {
            path: "artist-managers",
            element: <div>Artist Manager</div>,
          },
          {
            path: "artists",
            element: <ArtistsPage />,
          },
          {
            path: "invitations",
            element: <InvitationsPage />,
          },
          {
            path: "artists/:artistId",
            element: <div>Artist Details</div>,
          },
          {
            path: "musics",
            element: <div>Musics</div>,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
];
