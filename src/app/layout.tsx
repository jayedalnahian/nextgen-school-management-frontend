import type { Metadata } from "next";

import { Inter as FontSans } from "next/font/google";

import "./globals.css";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", // This creates a CSS variable
});

export const metadata: Metadata = {
  title: {
    default: "NextGen | School Management System",
    template: "%s | NextGen School",
  },
  description:
    "A comprehensive digital solution for educational institutions to manage students, teachers, routines, and online fee payments through Stripe.",
  keywords: [
    "School Management System",
    "Education ERP",
    "Student Information System",
    "Next.js Dashboard",
    "Online School Fees",
    "Academic Management",
  ],
  authors: [{ name: "Jayed Al Nahian" }],
  creator: "Jayed Al Nahian",
  publisher: "Jayed Al Nahian",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
