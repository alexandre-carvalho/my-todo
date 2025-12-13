"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { auth } from "@/utils/firebase";
import { FirebaseError } from "firebase/app";
import { deleteUser, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccount() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (user) {
      // Confirmação extra antes de prosseguir
      if (
        !window.confirm(
          "Tem certeza que deseja DELETAR sua conta? Esta ação é irreversível."
        )
      ) {
        return;
      }

      setIsPending(true);
      try {
        // Tenta deletar o usuário no Firebase Auth
        await deleteUser(user);

        // SUCESSO: Forçar o logout e redirecionar para o login

        // 1. Limpa a sessão do lado do cliente (Firebase SDK)
        await signOut(auth);

        // 2. Chama a API Route para limpar o cookie HTTP-only (que já criamos)
        await fetch("/api/sign-out", {
          method: "POST",
        });

        // 3. Feedback e Redirecionamento forçado para a tela de login
        alert("Sua conta foi deletada com sucesso. Sentiremos sua falta!");

        router.push("/sign-in");
      } catch (error: unknown) {
        setIsPending(false); // Resetar loading state no erro

        if (error instanceof FirebaseError) {
          // O erro mais comum aqui será auth/requires-recent-login.
          if (error.code === "auth/requires-recent-login") {
            alert(
              "Esta ação é sensível e requer um login recente. Por favor, faça logout e login novamente para confirmar sua identidade antes de deletar a conta."
            );
            // Redireciona para o login para que o usuário possa re-autenticar
            router.push("/sign-in");
          } else {
            alert(
              "Erro ao deletar conta: " +
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
            Deletar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Atenção: Esta ação é irreversível. Todos os seus dados serão
            perdidos.
          </p>
        </div>

        {/* Formulário Simples com Apenas um Botão */}
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault(); // Previne o refresh padrão do form HTML
            handleDeleteAccount();
          }}
        >
          <div>
            <ButtonBase
              label="Confirmar Exclusão da Conta"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              className="danger"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
