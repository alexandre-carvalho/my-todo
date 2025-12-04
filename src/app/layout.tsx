import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Todo List",
  description: "Aplicação de lista de tarefas",
  // openGraph é responsável por miniaturas de compartilhamento
  openGraph: {
    title: "My Todo List",
    description: "Aplicação de lista de tarefas",
    images:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNpSY-CNK93T2vWYNj6CnNM1oyPWG_JkhIXQ&s",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
