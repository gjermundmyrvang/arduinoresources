import type { Metadata } from "next";
import Footer from "./components/footer";
import "./globals.css";
import { Baskervville } from "next/font/google";
import { Bitcount_Grid_Single } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import CircuitBackground from "./components/circuit-background";

const baskervville = Baskervville({
  weight: "400",
  subsets: ["latin"],
});

const bitcount = Bitcount_Grid_Single({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bitcount",
});

const mono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Arduino Resources",
  description: "Written and maintained by Gjermund Myrvang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baskervville.className} ${bitcount.variable} ${mono.variable} min-h-screen flex flex-col`}
      >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
