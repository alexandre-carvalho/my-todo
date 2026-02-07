import { Loader2 } from "lucide-react";

export interface ButtonBaseProps {
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className: "danger" | "default";
}

export function ButtonBase({
  label,
  type,
  disabled,
  isLoading,
  onClick,
  className,
}: ButtonBaseProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex w-full justify-center text-white font-semibold rounded-xl p-3 transition duration-200 ${
        disabled
          ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
          : className === "danger"
            ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            : "bg-cyan-700 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500"
      }`}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="animate-spin size-5 text-white" />
        ) : (
          label
        )}
      </span>
    </button>
  );
}
