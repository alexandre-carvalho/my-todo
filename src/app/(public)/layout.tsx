import { Header } from "@/components/header";
import { publicNavbarLinks } from "@/models/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header data={[...publicNavbarLinks]} />
      {children}
    </div>
  );
}
