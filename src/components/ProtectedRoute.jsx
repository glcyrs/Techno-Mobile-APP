import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("currentUser");

  const subscription = JSON.parse(
    localStorage.getItem("subscription") || "null"
  );

  //  no user = balik login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  no subscription = choose plan
  if (!subscription) {
    return <Navigate to="/choose-plan" replace />;
  }

  //  expired subscription = reset then choose plan
  const expired =
    subscription.expiryDate &&
    new Date(subscription.expiryDate) < new Date();

  if (expired) {
    localStorage.removeItem("subscription");
    return <Navigate to="/choose-plan" replace />;
  }

  //  allowed access
  return children;
}