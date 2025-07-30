"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Users from '@pages/Users'
import Profile from '@pages/Profile'
import Informes from '@pages/Informes';
import AgendarJunta from '@pages/AgendarJunta';
import AgendarJuntaPres from '@pages/AgendarJuntaPres';
import Actas from '@pages/Actas';
import ProtectedRoute from '@components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["Presidente", "Secretario"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/informes",
        element: (
          <ProtectedRoute allowedRoles={["Presidente", "Tesorero", "Secretario"]}>
            <Informes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/agendar",
        element: (
          <ProtectedRoute allowedRoles={["Secretario"]}>
            <AgendarJunta />
          </ProtectedRoute>
        ),
      },
      {
        path: "/actas",
        element: (
          <ProtectedRoute allowedRoles={["Secretario"]}>
            <Actas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/agendarjuntapres",
        element: (
          <ProtectedRoute allowedRoles={["Presidente"]}>
            <AgendarJuntaPres />
        </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
