"use client";
import { ButtonBase } from "@/components/buttons/button-base";
import { FloatingInput } from "@/components/ui/floating-input";
import { useToast } from "@/components/ui/toast";
import { signIn } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  username: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function SignIn() {
  const router = useRouter();
  const { loading } = useAuthStore();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Force clear form on mount to override browser autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue("username", "");
      setValue("password", "");
    }, 50);

    return () => clearTimeout(timer);
  }, [setValue]);

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn(data);

    if (result.success) {
      reset();
      router.refresh();
      router.push("/");
    } else if (result.error) {
      showToast(result.error, "error");
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Faça seu login
          </h2>
        </div>
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleSignIn)}
          autoComplete="off"
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <FloatingInput
                {...field}
                type="email"
                label="Digite seu e-mail"
                autoComplete="new-password"
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FloatingInput
                {...field}
                type="password"
                label="Digite sua senha"
                autoComplete="new-password"
                showPasswordToggle
                error={errors.password?.message}
              />
            )}
          />

          <div className="pt-2">
            <ButtonBase
              label="Entrar"
              type="submit"
              isLoading={loading}
              disabled={loading || !isValid}
              className="default"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
