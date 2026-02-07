import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "../store/auth";
import { auth } from "../utils/firebase";

interface SignInResult {
  success: boolean;
  error?: string;
}

export const signIn = async (data: {
  username: string;
  password: string;
}): Promise<SignInResult> => {
  useAuthStore.setState({ loading: true });

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.username,
      data.password,
    );
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    const response = await fetch("/api/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    });

    if (!response.ok) {
      throw new Error("Falha ao definir o cookie de sessão.");
    }

    useAuthStore.setState({ loading: false, success: true });
    return { success: true };
  } catch (error: unknown) {
    useAuthStore.setState({ loading: false, success: false });

    let errorMessage = "Ocorreu um erro inesperado.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "E-mail ou senha inválidos.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
          break;
        default:
          errorMessage = "Erro ao realizar login. Tente novamente.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};
