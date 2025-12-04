import Link from "next/link";

export interface LinkNavigationProps {
  linkNavigation: string;
  label: string;
}

export function LinkNavigation({ label, linkNavigation }: LinkNavigationProps) {
  return (
    <Link href={linkNavigation} className='flex justify-center bg-cyan-700 hover:bg-cyan-600 text-white font-semibold rounded-md w-[200px] p-2 transition duration-150'>
      <span>{label}</span>
    </Link>
  )
}