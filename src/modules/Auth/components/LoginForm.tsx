import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/elements/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as z from "zod";
import { Button } from "../../../components/elements/button";
import { Input } from "../../../components/elements/input";
import { Label } from "../../../components/elements/label";
import { useAuthStore } from "../hooks/useAuthStore";
import { authService } from "../services/AuthService";
import { Routes } from "@/config/router/Routes";
import { CheckCircle2 } from "lucide-react";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(data.email, data.password);
      login(response.user);
      
      if (response.user.role.name === 'Vendedor') {
          navigate("/pos");
      } else {
          navigate("/"); // Redirect to dashboard or home
      }
    } catch (err) {
      const errorResponse = err as AxiosError<{ detail?: string }>;
      if (errorResponse.response?.status === 400) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.");
      } else if (errorResponse.response?.status === 403) {
        const detail = errorResponse.response.data?.detail || "";
        if (detail.includes("bloqueada")) {
          const matches = detail.match(/(\d+) minutos/);
          const minutes = matches ? matches[1] : "30";
          setError(`Tu cuenta ha sido bloqueada. Intenta en ${minutes} minutos.`);
        } else if (detail.includes("inactiva")) {
          setError("Tu cuenta está inactiva. Contacta al administrador.");
        } else {
          setError(detail || "Acceso denegado.");
        }
      } else {
        setError("Error al conectar con el servidor. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a SuperPOS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage && (
          <div
            className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-start gap-2"
            role="alert"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div
            className="p-3 text-sm text-destructive bg-destructive/10 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@superpos.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                to={Routes.ForgotPassword}
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <p>© 2026 SuperPOS. Todos los derechos reservados.</p>
      </CardFooter>
    </Card>
  );
};
