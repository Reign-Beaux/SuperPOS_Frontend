import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/elements/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as z from "zod";
import { Button } from "../../../components/elements/button";
import { Input } from "../../../components/elements/input";
import { Label } from "../../../components/elements/label";
import { authService } from "../services/AuthService";
import { Routes } from "@/config/router/Routes";
import { ChevronLeft, Timer, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";

const verifyCodeSchema = z.object({
  code: z.string().length(6, "El código debe ser de 6 dígitos").regex(/^\d+$/, "Solo se permiten números"),
});

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

export const VerifyCodeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [attempts, setAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const codeValue = watch("code");

  // Redirigir si no hay email en el estado
  useEffect(() => {
    if (!email) {
      navigate(Routes.ForgotPassword);
    }
  }, [email, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = useCallback(async (data: VerifyCodeFormData) => {
    if (!email) return;
    setError(null);
    setIsLoading(true);

    try {
      const verificationToken = await authService.verifyCode(email, data.code);
      navigate(Routes.ResetPassword, { state: { verificationToken, email } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Código incorrecto";
      setError(message);
      setAttempts((prev) => prev + 1);

      if (message.includes("máximo de intentos") || message.includes("expirado")) {
        setTimeout(() => navigate(Routes.ForgotPassword), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, navigate]);

  const handleResendCode = async () => {
    if (!email) return;
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setTimeLeft(900);
      setAttempts(0);
      setError(null);
      // Opcionalmente mostrar un mensaje de éxito
    } catch {
      setError("Error al reenviar el código.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (codeValue?.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [codeValue, handleSubmit, onSubmit]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Verificar Código</CardTitle>
        <CardDescription>
          Ingresa el código de 6 dígitos enviado a <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-start gap-2"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 text-center">
            <Label htmlFor="code" className="sr-only">Código de Verificación</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              className="text-center text-3xl tracking-[0.5em] font-bold h-16"
              maxLength={6}
              {...register("code")}
              disabled={isLoading || timeLeft <= 0}
              autoFocus
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm px-1">
            <div className="flex items-center text-muted-foreground">
              <Timer className="mr-1 h-4 w-4" />
              <span>Expira en: <span className={timeLeft < 60 ? "text-destructive font-medium" : ""}>{formatTime(timeLeft)}</span></span>
            </div>
            <div className="text-muted-foreground">
              Intentos: <span className={attempts >= 2 ? "text-destructive font-medium" : ""}>{attempts}/3</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || timeLeft <= 0 || codeValue?.length !== 6}>
            {isLoading ? "Verificando..." : "Verificar Código"}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleResendCode}
            disabled={isLoading || (timeLeft > 840)} // Disable for 1 minute after sending
          >
            Reenviar Código
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <Link
          to={Routes.ForgotPassword}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Cambiar correo electrónico
        </Link>
      </CardFooter>
    </Card>
  );
};
