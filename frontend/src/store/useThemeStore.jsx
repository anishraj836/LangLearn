import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("LangLearn-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("LangLearn-theme", theme);
    set({ theme });
  },
}));
export default useThemeStore;