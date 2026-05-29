import type { Metadata } from "next";
import { Inter, Oswald, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const anton = Anton({
  weight: '400',
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission Dilse NGO",
  description: "Making a difference from the heart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

