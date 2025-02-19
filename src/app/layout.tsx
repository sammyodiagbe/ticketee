import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";
import Script from "next/script";
import { SupabaseAuthProvider } from "@/components/providers/supabase-auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Ticketee - Event Management Platform",
  description: "Create, manage and sell tickets for your events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const savedTheme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', savedTheme);
            } catch (e) {
              console.error('Failed to set initial theme:', e);
            }
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} font-grotesk min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
