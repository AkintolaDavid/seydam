
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated =
    !!localStorage.getItem("seydamtoken") 

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
