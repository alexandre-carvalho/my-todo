import { Header } from "@/components/header";
import { externalNavbarLinks } from "@/models/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header data={[...externalNavbarLinks]} />
      <main className="flex justify-center items-center py-8">{children}</main>
    </div>
  );
}
