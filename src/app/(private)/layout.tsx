import { Header } from "@/components/header";
import { internalNavbarLinks } from "@/models/navbar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header data={[...internalNavbarLinks]} />
      <main className="flex justify-center items-center max-w-screen">
        {children}
      </main>
    </div>
  );
}
