import { Routes } from "@/config/router/Routes";
import { useAuthStore } from "@/modules/Auth/hooks/useAuthStore";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
    const { user } = useAuthStore();
    
    if (user?.role?.name === 'Vendedor') {
        return <Navigate to={Routes.POS} replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Bienvenido a SuperPOS</h1>
            <p className="text-xl text-muted-foreground">
                Hola, {user?.name || 'Usuario'}. Has iniciado sesión como {user?.role?.name || 'Invitado'}.
            </p>
            <p className="text-muted-foreground">
                Selecciona una opción del menú lateral para comenzar.
            </p>
        </div>
    );
};
