"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { auth } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Endereço de e-mail inválido"),
});

export default function ResetPassword() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const handleResetPassword = async (data: z.infer<typeof registerSchema>) => {
    setIsPending(true);
    try {
      const userCredential = await sendPasswordResetEmail(auth, data.username);
      const user = userCredential;
      alert("Email enviado para resetar a senha! " + JSON.stringify(user));
      setIsPending(false);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(
          "Erro ao enviar email para resetar a senha: " +
            JSON.stringify(errorMessage) +
            " - " +
            JSON.stringify(errorCode)
        );
      }
    }
    setIsPending(false);
  };

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-12">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Faça seu reset de senha
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleResetPassword)}
        >
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
          </div>

          <div>
            <ButtonBase
              label="Enviar email"
              type="submit"
              isLoading={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
