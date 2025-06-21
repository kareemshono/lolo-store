"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const pathname = usePathname();

  // Stop loading when pathname changes
  useEffect(() => {
    setIsLoading(false);
    console.log("TransitionProvider: Stopped loading for pathname:", pathname);
  }, [pathname]);

  const startLoading = () => {
    setIsLoading(true);
    console.log("TransitionProvider: Started loading");
  };

  const stopLoading = () => {
    setIsLoading(false);
    console.log("TransitionProvider: Stopped loading");
  };

  return (
    <TransitionContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}