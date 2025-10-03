/**
 * This is the wrapper so only logged in users can get to the
 * /edit-user route in App.jsx.
 */

import { Navigate } from "react-router";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  //go to login if there's no token
  if (!token) return;
  <Navigate to="/login" replace />; //back button to login will not be in history

  return children;
}
