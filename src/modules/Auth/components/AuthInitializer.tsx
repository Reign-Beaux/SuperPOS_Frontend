import { useEffect, useRef } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

/**
 * Componente que inicializa la autenticación al cargar la aplicación.
 * Intenta restaurar la sesión usando el refresh token almacenado.
 */
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, isLoading } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
        initialized.current = true;
        // Intentar restaurar sesión al montar la app
        checkAuth();
    }
  }, [checkAuth]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
