import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import your AuthProvider
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AK Nexus | Attendance System",
  description: "Next-generation campus attendance management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. Wrap children with the Provider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}