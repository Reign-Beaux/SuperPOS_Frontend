import { useNavigate } from "react-router-dom";
import { Button } from "../elements/button";

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
            <h1 className="text-4xl font-bold text-red-600">403</h1>
            <h2 className="text-2xl font-semibold">Acceso Denegado</h2>
            <p className="text-gray-600">No tienes permisos para ver esta página.</p>
            <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
        </div>
    );
};
