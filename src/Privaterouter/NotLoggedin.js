import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLoggedinuser() {
  const user = useSelector((users) => users.login.loggedIn);
  return user ? <Navigate to="/" /> : <Outlet />;
}
