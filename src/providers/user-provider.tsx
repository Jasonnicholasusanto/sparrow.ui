"use client";

import { createContext, ReactNode, useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import React from "react";
import { getUserProfile } from "@/lib/data/server/me";
import { UserResponse } from "@/schemas/user";

interface AppContextType {
  user: UserResponse | null;
  authUser: User | null;
  setUser: (user: UserResponse | null) => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export default function UserProvider({
  children,
  user: initialUser,
  authUser,
}: {
  children: ReactNode;
  user: UserResponse | null;
  authUser: User | null;
}) {
  const [user, setUser] = useState(initialUser);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getUserProfile();
      setUser(res);
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, authUser, setUser, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a UserProvider");
  }
  return context;
}
