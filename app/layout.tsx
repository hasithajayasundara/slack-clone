import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import "./globals.css";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "../components/convex-client-provider";

export const metadata: Metadata = {
  title: "slack-clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <NuqsAdapter>
              <Toaster />
              <Modals />
              {children}
            </NuqsAdapter>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
