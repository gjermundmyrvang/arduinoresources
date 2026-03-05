import type { Metadata } from "next";
import Footer from "./components/footer";
import "./globals.css";

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
      <body className="min-h-screen flex flex-col">
        <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
