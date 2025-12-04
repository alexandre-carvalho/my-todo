import { PrivateRoutes, PublicRoutes } from "@/routes/index";

export interface NavbarLink {
  href: string;
  label: string;
}

export const publicNavbarLinks: NavbarLink[] = [
  { href: PublicRoutes.SIGN_IN, label: "Entrar" },
  { href: PublicRoutes.REGISTER, label: "Cadastrar" },
  { href: PublicRoutes.RESET_PASSWORD, label: "Recuperar Senha" },
  { href: PublicRoutes.ABOUT, label: "Sobre" },
];

export const privateNavbarLinks: NavbarLink[] = [
  { href: PrivateRoutes.HOME, label: "Início" },
  { href: PrivateRoutes.CHANGE_PASSWORD, label: "Alterar Senha" },
];
