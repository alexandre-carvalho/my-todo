// src/app/page.tsx
"use client"; // Marca como Client Component para usar hooks e eventos do navegador

import { ButtonBase } from "@/components/buttons/button-base";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      // 1. Limpa a sessão do lado do cliente (Firebase SDK)
      await signOut(auth);

      // 2. Chama a API Route para limpar o cookie HTTP-only
      await fetch("/api/sign-out", {
        method: "POST",
      });

      // 3. Redireciona para a página de login
      // router.refresh() garante que o middleware seja re-executado e veja que o cookie sumiu
      router.refresh();
      router.push("/sign-in");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Ocorreu um erro ao sair. Tente novamente.");
    }
    setIsPending(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center flex-col md:flex-row mb-6">
        <h1>Página Inicial (Home)</h1>
        <ButtonBase
          label="Sair"
          type="submit"
          onClick={handleSignOut}
          isLoading={isPending}
          disabled={isPending}
        />
      </div>
      <p className="mt-6">Bem-vindo à área logada da aplicação.</p>
    </div>
  );
}
