import Link from "next/link";

export interface HeaderProps {
  data: {
    href: string;
    label: string;
  }[];
}

export function Header({ data }: HeaderProps) {
  return (
    <header className="flex px-4 sm:px-6 lg:px-8 py-4 bg-zinc-900 text-white">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <div>
          <Link href={"/"}>NextJS</Link>
        </div>
        <nav>
          <ul className="flex items-center justify-center gap-2">
            {data.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
