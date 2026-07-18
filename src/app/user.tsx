import { createContext, useContext, useState, ReactNode } from "react";

// ─── User profile ───────────────────────────────────────────────────────────
// Collected during onboarding, persisted to localStorage, read across the app.
export type UserInfo = {
  name: string;
  village: string;
  district: string;
  state: string;
  farmSize: string; // numeric value as string
  unit: string; // "acres" | "hectares" | "bigha"
  landType: string;
  crops: string[]; // crop keys (see CROPS in App.tsx)
  onboarded: boolean;
};

const EMPTY_USER: UserInfo = {
  name: "",
  village: "",
  district: "",
  state: "",
  farmSize: "",
  unit: "acres",
  landType: "",
  crops: [],
  onboarded: false,
};

const STORAGE_KEY = "krishimitra.user";

function loadUser(): UserInfo {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...EMPTY_USER, ...JSON.parse(saved) };
  } catch {
    /* localStorage unavailable */
  }
  return EMPTY_USER;
}

type UserCtx = {
  user: UserInfo;
  setUser: (u: Partial<UserInfo>) => void;
  resetUser: () => void;
};
const Ctx = createContext<UserCtx>({ user: EMPTY_USER, setUser: () => {}, resetUser: () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo>(loadUser);
  const persist = (u: UserInfo) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* localStorage unavailable */
    }
  };
  const setUser = (patch: Partial<UserInfo>) => {
    setUserState((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  };
  const resetUser = () => {
    setUserState(EMPTY_USER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* localStorage unavailable */
    }
  };
  return <Ctx.Provider value={{ user, setUser, resetUser }}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);
