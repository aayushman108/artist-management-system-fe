import { type RouteObject, Navigate } from "react-router-dom";
import {
  AcceptInvite,
  ArtistManagerDetailsPage,
  ArtistDetailsPage,
  ArtistsPage,
  DashboardLayout,
  ForgotPassword,
  HomePage,
  InvitationsPage,
  Login,
  MusicsPage,
  NotFoundPage,
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
            element: <HomePage />,
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
    path: "not-found",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
];
