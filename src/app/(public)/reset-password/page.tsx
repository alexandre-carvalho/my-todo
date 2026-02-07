"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { FloatingInput } from "@/components/ui/floating-input";
import { useToast } from "@/components/ui/toast";
import { auth } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  username: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Endereço de e-mail inválido"),
});

export default function ResetPassword() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  // Force clear form on mount to override browser autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue("username", "");
    }, 50);

    return () => clearTimeout(timer);
  }, [setValue]);

  const handleResetPassword = async (
    data: z.infer<typeof resetPasswordSchema>,
  ) => {
    setIsPending(true);
    try {
      await sendPasswordResetEmail(auth, data.username);
      reset();
      showToast(
        "E-mail de recuperação enviado! Verifique sua caixa de entrada.",
        "success",
      );
      setIsPending(false);
      router.push("/sign-in");
    } catch (error: unknown) {
      setIsPending(false);

      let errorMessage = "Ocorreu um erro inesperado.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "Não existe conta com este e-mail.";
            break;
          case "auth/invalid-email":
            errorMessage = "E-mail inválido.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = "Erro ao enviar e-mail. Tente novamente.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Digite seu e-mail para receber um link de recuperação
          </p>
        </div>
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleResetPassword)}
          autoComplete="off"
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <FloatingInput
                {...field}
                type="email"
                label="Digite seu e-mail"
                autoComplete="new-password"
                error={errors.username?.message}
              />
            )}
          />

          <div className="pt-2">
            <ButtonBase
              label="Enviar e-mail"
              type="submit"
              isLoading={isPending}
              disabled={isPending || !isValid}
              className="default"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
