"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { auth } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  username: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function SignIn() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    setIsPending(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.username,
        data.password
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

      setIsPending(false);

      router.refresh();
      router.push("/");
    } catch (error: unknown | FirebaseError) {
      setIsPending(false);

      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(
          "Erro ao logar usuário: " +
            JSON.stringify(errorMessage) +
            " - " +
            JSON.stringify(errorCode)
        );
      } else if (error instanceof Error) {
        alert("Ocorreu um erro inesperado: " + error.message);
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-12">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Faça seu login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignIn)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username-address" className="sr-only">
                Digite seu e-mail
              </label>
              <input
                id="username-address"
                type="email"
                autoComplete="username"
                className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-cyan-700 focus:outline-none focus:ring-cyan-700 sm:text-sm"
                placeholder="Digite seu e-mail"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Digite sua senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-cyan-700 focus:outline-none focus:ring-cyan-700 sm:text-sm"
                placeholder="Digite sua senha"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <ButtonBase
              label="Entrar"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              className="default"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
