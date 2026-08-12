import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TaskFlow",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow is a simple task management application for organizing tasks and categories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}