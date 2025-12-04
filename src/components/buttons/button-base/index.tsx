import { MouseEvent } from "react";

export interface ButtonBaseProps {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function ButtonBase({ label, onClick }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className="flex justify-center bg-cyan-700 hover:bg-cyan-600 text-white font-semibold rounded-md w-[200px] p-2 transition duration-150"
    >
      <span>{label}</span>
    </button>
  );
}
