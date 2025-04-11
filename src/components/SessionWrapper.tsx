"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const withoutSession = ["/register", "/login"];

  const isAuthPage = withoutSession.includes(pathname);

  if (isAuthPage) return <>{children}</>;

  return <SessionProvider>{children}</SessionProvider>;
}
