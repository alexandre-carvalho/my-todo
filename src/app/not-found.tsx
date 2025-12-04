"use client";

import { LinkNavigation } from "@/components/buttons/link-navigation";
import { PrivateRoutes, PublicRoutes } from "@/routes";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center font-bold text-3xl">Página não encontrada</h1>

      <LinkNavigation
        linkNavigation={PublicRoutes.SIGN_IN}
        label="Ir para login"
      />

      <LinkNavigation
        linkNavigation={PrivateRoutes.HOME}
        label="Ir para home"
      />
    </div>
  );
}
