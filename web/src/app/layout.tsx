import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JSON Image Cleaner",
  description:
    "Validate image URLs in a JSON file and download a cleaned version — entirely in your browser.",
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
