'use client'
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import LenisProvider from "./lenis-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LenisProvider>
        <Toaster />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </LenisProvider>
    </QueryClientProvider>
  );
}