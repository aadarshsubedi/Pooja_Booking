import React from "react";
import { Navigate } from "react-router-dom";

const RequirePandit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const role = (localStorage.getItem("userRole") || "").toLowerCase();

  if (!token) return <Navigate to="/signin" replace />;
  if (role !== "pandit") return <Navigate to="/home" replace />;

  return <>{children}</>;
};

export default RequirePandit;
