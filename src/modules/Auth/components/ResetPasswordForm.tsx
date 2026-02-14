import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/elements/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import * as z from "zod";
import { Button } from "../../../components/elements/button";
import { Input } from "../../../components/elements/input";
import { Label } from "../../../components/elements/label";
import { authService } from "../services/AuthService";
import { Routes } from "@/config/router/Routes";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener como máximo 32 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[$%&@]/, "Debe contener al menos un carácter especial ($, %, &, @)"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verificationToken = location.state?.verificationToken;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("newPassword", "");

  // Redirigir si no hay token
  useEffect(() => {
    if (!verificationToken) {
      navigate(Routes.ForgotPassword);
    }
  }, [verificationToken, navigate]);

  const requirements = [
    { label: "8-32 caracteres", met: password.length >= 8 && password.length <= 32 },
    { label: "Una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Una minúscula", met: /[a-z]/.test(password) },
    { label: "Un número", met: /[0-9]/.test(password) },
    { label: "Carácter especial ($%&@)", met: /[$%&@]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!verificationToken) return;
    setError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword(verificationToken, data.newPassword);
      // Redirigir al login con mensaje de éxito
      navigate(Routes.Login, { 
        state: { 
          message: "Tu contraseña ha sido cambiada exitosamente. Inicia sesión con tu nueva contraseña." 
        } 
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Error al cambiar la contraseña";
      setError(message);
      
      if (message.includes("expirado") || message.includes("utilizado")) {
        setTimeout(() => navigate(Routes.ForgotPassword), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Nueva Contraseña</CardTitle>
        <CardDescription>
          Crea una contraseña segura para tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("newPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Requisitos de seguridad:</p>
            <div className="grid grid-cols-1 gap-1.5">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center text-xs">
                  {req.met ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground/50 mr-2" />
                  )}
                  <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !requirements.every(r => r.met) || watch("newPassword") !== watch("confirmPassword")}
          >
            {isLoading ? "Cambiando contraseña..." : "Cambiar Contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
