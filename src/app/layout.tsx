"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useMemo } from "react";
import { initRelayEnvironment } from "@/RelayEnvironment";
import { RelayEnvironmentProvider } from "react-relay";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const environment = useMemo(() => {
    return initRelayEnvironment();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <RelayEnvironmentProvider environment={environment}>
          {children}
        </RelayEnvironmentProvider>
      </body>
    </html>
  );
}
