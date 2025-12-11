export interface ButtonBaseProps {
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function ButtonBase({ label, type, disabled }: ButtonBaseProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex w-full justify-center text-white font-semibold rounded-md p-2 transition duration-150 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-cyan-700 hover:bg-cyan-600"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}
