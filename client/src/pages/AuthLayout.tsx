import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();

  return (
    <>
      {
        user
          ? <Navigate to="/" />
          : <Outlet />
      }
    </>
  );
}
