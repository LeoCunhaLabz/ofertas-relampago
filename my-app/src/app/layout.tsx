import type { Metadata } from "next";
import { Inter } from "next/font/google";
/*
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
*/
import Providers from "@/app/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ofertas Relâmpago',
  description: 'Ofertas de Curta Duração!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /*const queryClient = new QueryClient()*/
  return (
    <html lang="en">
      <body 
      className={`${inter.className} flex flex-col min-h-screen items-center bg-primary text-default`}
      >
        <div className="p-4 md:p-6 w-full max-w-[1256px]">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}