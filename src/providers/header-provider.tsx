"use client";

import { getNavbarRoutes } from "@/lib/data/server/navbarRoutes";
import { NavbarRoute } from "@/schemas/navbarRoute";
import { createContext, ReactNode, useCallback, useState } from "react";
import React from "react";

interface HeaderContextType {
  navbarRoutes: NavbarRoute[];
  setNavbarRoutes: (routes: NavbarRoute[]) => void;
  refreshNavbarRoutes: () => Promise<void>;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export default function HeaderProvider({
  children,
  navbarRoutes: initialNavbarRoutes,
}: {
  children: ReactNode;
  navbarRoutes: NavbarRoute[];
}) {
  const [navbarRoutes, setNavbarRoutes] = useState(initialNavbarRoutes);

  const refreshNavbarRoutes = useCallback(async () => {
    try {
      const res: NavbarRoute[] | null = await getNavbarRoutes();
      setNavbarRoutes(res ?? []);
    } catch (err) {
      console.error("refreshNavbarRoutes error:", err);
    }
  }, []);

  return (
    <HeaderContext.Provider
      value={{ navbarRoutes, setNavbarRoutes, refreshNavbarRoutes }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = React.useContext(HeaderContext);

  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  return context;
}
