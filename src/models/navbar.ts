import { PrivateRoutes, PublicRoutes } from "@/routes/index";

export interface NavbarLink {
  href: string;
  label: string;
}

export const externalNavbarLinks: NavbarLink[] = [
  { href: PublicRoutes.SIGN_IN, label: "Entrar" },
  { href: PublicRoutes.REGISTER, label: "Cadastrar" },
  { href: PublicRoutes.RESET_PASSWORD, label: "Recuperar Senha" },
];

export const internalNavbarLinks: NavbarLink[] = [
  { href: PrivateRoutes.HOME, label: "Início" },
  { href: PrivateRoutes.CHANGE_PASSWORD, label: "Alterar Senha" },
];
