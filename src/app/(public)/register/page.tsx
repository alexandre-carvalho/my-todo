"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { FloatingInput } from "@/components/ui/floating-input";
import { useToast } from "@/components/ui/toast";
import { auth } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function Register() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Force clear form on mount to override browser autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue("username", "");
      setValue("password", "");
    }, 50);

    return () => clearTimeout(timer);
  }, [setValue]);

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsPending(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.username,
        data.password,
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      const response = await fetch("/api/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        throw new Error("Falha ao definir o cookie de sessão.");
      }

      reset();
      setIsPending(false);
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      setIsPending(false);

      let errorMessage = "Ocorreu um erro inesperado.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este e-mail já está em uso.";
            break;
          case "auth/invalid-email":
            errorMessage = "E-mail inválido.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha é muito fraca.";
            break;
          default:
            errorMessage = "Erro ao cadastrar. Tente novamente.";
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
            Faça seu cadastro
          </h2>
        </div>
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleRegister)}
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

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FloatingInput
                {...field}
                type="password"
                label="Digite sua senha"
                autoComplete="new-password"
                showPasswordToggle
                error={errors.password?.message}
              />
            )}
          />

          <div className="pt-2">
            <ButtonBase
              label="Cadastrar"
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
