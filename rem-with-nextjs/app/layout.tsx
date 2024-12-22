import type { Metadata } from "next";
import { Balsamiq_Sans } from "next/font/google";
import "./globals.css";

const balsmiqSans = Balsamiq_Sans({
  variable: "--font-balsamiq-sans",
  subsets: ["latin"],
  weight: [ "400", "700" ]
})

export const metadata: Metadata = {
  title: "REM API Demo",
  description: "Demonstrate using a next.js server-side function to avoid exposing API keys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${balsmiqSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
