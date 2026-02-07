"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export interface HeaderProps {
  data: {
    href: string;
    label: string;
  }[];
}

export function Header({ data }: HeaderProps) {
  return (
    <header className="flex px-4 sm:px-6 lg:px-8 py-4 bg-zinc-900 text-white sticky top-0 z-50">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <div>
          <Link href={"/"} className="font-semibold text-lg">
            My Todo List
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex items-center justify-center gap-4">
              {data.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
