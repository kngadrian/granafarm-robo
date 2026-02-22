import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "GRANA FARM — Command Center",
  description: "Centrul de comandă agricol pentru GRANA FARM SRL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="font-nunito bg-background text-foreground flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
