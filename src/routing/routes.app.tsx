import { type RouteObject, Navigate } from "react-router-dom";
import {
  AcceptInvite,
  ArtistsPage,
  DashboardLayout,
  ForgotPassword,
  InvitationsPage,
  Login,
  MusicsPage,
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
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "users/artist-managers/:managerId",
            element: (
              <div>
                <p>
                  USERS --- Artist Manager's Details section wherein artist
                  manager details with user detailsand profile details will be
                  seen here.
                </p>
                <ArtistsPage />
              </div>
            ),
          },
          {
            path: "users/artist-manager/:managerId/artists/:artistId",
            element: (
              <div>
                <p>
                  USERS --- Artist's Details section wherein artist details with
                  user details will be seen here.
                </p>
                <MusicsPage />
              </div>
            ),
          },
          {
            path: "users/artists/:artistId",
            element: (
              <div>
                <p>
                  USERS --- Artist's Details section wherein artist details with
                  user details will be seen here.
                </p>
                <MusicsPage />
              </div>
            ),
          },

          {
            path: "artists",
            element: <ArtistsPage />,
          },
          {
            path: "artists/:artistId",
            element: (
              <div>
                <p>
                  ARTISTS --- Artist's Details section wherein artist details
                  with user details will be seen here.
                </p>
                <MusicsPage />
              </div>
            ),
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
