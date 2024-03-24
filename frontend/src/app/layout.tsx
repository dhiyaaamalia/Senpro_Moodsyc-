"use client";
import { Stick_No_Bills, Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/store/react-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";

const stick = Stick_No_Bills({
  subsets: ["latin"],
  variable: "--font-stick",
});
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${stick.variable} ${poppins.variable}`}
        >
          <NextTopLoader color="#0084F3" height={5} />
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ReduxProvider>
  );
}
