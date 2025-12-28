import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { LocaleProvider } from "../components/LocaleProvider";
import { AuthProvider } from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Dog Academy | Book courses and meetings",
  description: "Discover and book events, courses, and meetings at the dog academy."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="bg-slate-50 text-slate-900 antialiased font-body">
        <LocaleProvider>
          <AuthProvider>
            <Navbar />
            <main className="px-4 pb-16 sm:px-8 lg:px-16">{children}</main>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
