import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./(components)/Header";
import Footer from "./(components)/Footer";
import { AppProvider } from "./context/AppContext";
import AuthProvider from "./(components)/AuthProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StackUp",
  description: "StackUp Improvements by Nashki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <AppProvider>
        <Header />
        {children}
        <Footer />
        </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
