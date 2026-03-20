import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    default: "MaiKery – Tiệm Bánh Thủ Công",
    template: "%s | MaiKery",
  },
  description: "Tiệm bánh thủ công MaiKery – Bánh ngon, làm từ tâm.",
  keywords: ["bánh", "tiệm bánh", "MaiKery", "bakery"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${geist.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
