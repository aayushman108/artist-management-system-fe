import { type RouteObject, Navigate } from "react-router-dom";
import {
  AcceptInvite,
  ArtistManagerDetailsPage,
  ArtistDetailsPage,
  ArtistsPage,
  DashboardLayout,
  ForgotPassword,
  InvitationsPage,
  Login,
  MusicsPage,
  ProfilePage,
  ResetPassword,
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
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
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
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "users/artist-managers/:managerId",
            element: <ArtistManagerDetailsPage />,
          },
          {
            path: "users/artist-manager/:managerId/artists/:artistId",
            element: <ArtistDetailsPage />,
          },
          {
            path: "users/artists/:artistId",
            element: <ArtistDetailsPage />,
          },

          {
            path: "artists",
            element: <ArtistsPage />,
          },
          {
            path: "artists/:artistId",
            element: <ArtistDetailsPage />,
          },
          {
            path: "invitations",
            element: <InvitationsPage />,
          },

          {
            path: "musics",
            element: <MusicsPage />,
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
