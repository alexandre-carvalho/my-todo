"use client";

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
      await signOut(auth);
      await fetch("/api/sign-out", {
        method: "POST",
      });

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
          className="default"
        />
      </div>
      <p className="mt-6">Bem-vindo à área logada da aplicação.</p>
    </div>
  );
}
