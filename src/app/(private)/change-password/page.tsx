"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { auth } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { signOut, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema ajustado para validar a nova senha
const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "A nova senha deve ter pelo menos 6 caracteres."),
});

// Tipagem correta para os dados do formulário
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Tipagem do argumento ajustada para newPassword
  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    const user = auth.currentUser;

    if (user) {
      setIsPending(true);
      try {
        await updatePassword(user, data.newPassword);

        // SUCESSO: Forçar o logout e redirecionar para o login

        // 1. Limpa a sessão do lado do cliente (Firebase SDK)
        await signOut(auth);

        // 2. Chama a API Route para limpar o cookie HTTP-only (que já criamos)
        await fetch("/api/sign-out", {
          method: "POST",
        });

        // 3. Feedback e Redirecionamento forçado para a tela de login
        alert(
          "Sua senha foi alterada com sucesso! Por favor, faça login novamente com a nova senha."
        );

        router.push("/sign-in");
        // setIsPending(false); // Removido, pois o router.push já muda a página
      } catch (error: unknown) {
        setIsPending(false); // Resetar loading state no erro

        if (error instanceof FirebaseError) {
          // O erro mais comum aqui será auth/requires-recent-login.
          if (error.code === "auth/requires-recent-login") {
            alert(
              "Esta ação é sensível e requer um login recente. Por favor, faça logout e login novamente para confirmar sua identidade."
            );
            // Redireciona para o login para que o usuário possa re-autenticar
            router.push("/sign-in");
          } else {
            alert(
              "Erro ao alterar senha: " +
                error.message +
                " Código: " +
                error.code
            );
          }
        } else {
          alert("Ocorreu um erro inesperado.");
        }
      }
    } else {
      // Caso o usuário não esteja logado (currentUser é null), redirecione para login
      alert("Usuário não autenticado. Redirecionando para login.");
      router.push("/sign-in");
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-12">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Alterar Senha
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="sr-only">
                Digite sua nova senha
              </label>
              <input
                id="newPassword"
                type="password" // Tipo password para esconder a senha
                autoComplete="new-password"
                className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-cyan-700 focus:outline-none focus:ring-cyan-700 sm:text-sm"
                placeholder="Digite sua nova senha"
                {...register("newPassword")} // Registrar com o nome correto
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <ButtonBase
              label="Alterar Senha"
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
