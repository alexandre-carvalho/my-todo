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
      className={`flex w-full justify-center text-white font-semibold rounded-md p-2 transition duration-150 ${
        disabled ?? "bg-gray-400 cursor-not-allowed"
      } ${
        className === "danger"
          ? "bg-red-600 hover:bg-red-700"
          : "bg-cyan-700 hover:bg-cyan-600"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">
        {isLoading ? (
          <Loader2 className="animate-spin size-4 text-white mr-2  " />
        ) : (
          label
        )}
      </span>
    </button>
  );
}
