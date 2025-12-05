import { Header } from "@/components/header";
import { privateNavbarLinks } from "@/models/navbar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header data={[...privateNavbarLinks]} />
      <main className="flex justify-center items-center max-w-screen">
        {children}
      </main>
    </div>
  );
}
