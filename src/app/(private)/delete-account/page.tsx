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
      if (
        !window.confirm(
          "Tem certeza que deseja DELETAR sua conta? Esta ação é irreversível."
        )
      ) {
        return;
      }

      setIsPending(true);
      try {
        await deleteUser(user);
        await signOut(auth);

        await fetch("/api/sign-out", {
          method: "POST",
        });
        alert("Sua conta foi deletada com sucesso. Sentiremos sua falta!");

        router.push("/sign-in");
      } catch (error: unknown) {
        setIsPending(false);

        if (error instanceof FirebaseError) {
          if (error.code === "auth/requires-recent-login") {
            alert(
              "Esta ação é sensível e requer um login recente. Por favor, faça logout e login novamente para confirmar sua identidade antes de deletar a conta."
            );
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

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
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
