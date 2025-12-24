import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "../store/auth";
import { auth } from "../utils/firebase";

export const signIn = async (data: { username: string; password: string }) => {
  useAuthStore.setState({ loading: true });

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.username,
      data.password
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

    useAuthStore.setState({ loading: false });
    useAuthStore.setState({ success: true });
  } catch (error: unknown | FirebaseError) {
    useAuthStore.setState({ loading: false });
    useAuthStore.setState({ success: false });

    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(
        "Erro ao logar usuário: " +
          JSON.stringify(errorMessage) +
          " - " +
          JSON.stringify(errorCode)
      );
    } else if (error instanceof Error) {
      alert("Ocorreu um erro inesperado: " + error.message);
    }
  }
};
