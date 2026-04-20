import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import Layout from "@/src/features/layout";
import { buildMetadata } from "@/lib/metadata/buildMetadata";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} h-full antialiased`}
    >
      <body className="min-h-[100svh] bg-[#79c9f7]">
        {/* Фиксированный фон отдельным слоем */}
        <div className="fixed inset-0 -z-10 bg-[#79c9f7] bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center" />

        {/* Основной контент */}
        <div className="relative min-h-[100svh] p-8">
          <Layout>{children}</Layout>
        </div>
      </body>
    </html>
  );
}
