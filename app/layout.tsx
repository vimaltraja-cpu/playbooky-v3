import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayBooky V3 Design Portal",
  description: "The PlayBooky V3 design system source of truth."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
