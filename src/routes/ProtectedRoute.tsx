import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../modules/Auth/hooks/useAuthStore";
import { authService } from "../modules/Auth/services/AuthService";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: "Administrador" | "Gerente" | "Vendedor";
  requireManagerOrAbove?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireManagerOrAbove,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const token = authService.getAccessToken();

  // If loading, we could show a spinner. 
  // But for now, if we have a token but state says not auth (maybe strict mode init), trust the token.
  if (!isAuthenticated && !token) {
     return <Navigate to="/login" replace />;
  }

  // Check roles
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireManagerOrAbove && !authService.isManagerOrAbove()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
      const userRole = authService.getUserRole();
      if (!userRole || !allowedRoles.includes(userRole)) {
          return <Navigate to="/unauthorized" replace />;
      }
  }

  return children ? <>{children}</> : <Outlet />;
};
