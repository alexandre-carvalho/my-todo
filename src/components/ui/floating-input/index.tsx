"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface FloatingInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      error,
      showPasswordToggle = false,
      type = "text",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasValue = props.value !== undefined ? Boolean(props.value) : false;
    const isFloating = isFocused || hasValue;

    const inputType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholder=" "
          className={`
            peer w-full px-4 pt-5 pb-2 bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border-2 rounded-xl
            transition-all duration-200 ease-out
            focus:outline-none
            ${
              isFocused
                ? "border-cyan-600"
                : error
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${showPasswordToggle ? "pr-12" : ""}
            ${className}
          `}
        />

        <label
          className={`
            absolute left-4 pointer-events-none
            transition-all duration-200 ease-out
            ${
              isFloating
                ? "top-1.5 text-xs font-medium " +
                  (isFocused
                    ? "text-cyan-600"
                    : "text-gray-500 dark:text-gray-400")
                : "top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400"
            }
          `}
        >
          {label}
        </label>

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FloatingInput.displayName = "FloatingInput";
