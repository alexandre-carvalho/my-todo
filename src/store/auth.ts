import { create } from "zustand";

interface AuthStore {
  success: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setSuccess: (success: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  success: false,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setSuccess: (success: boolean) => set({ success }),
}));
