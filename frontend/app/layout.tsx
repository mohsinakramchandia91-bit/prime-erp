import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar"; // Humara naya sidebar

export const metadata: Metadata = {
  title: "Prime ERP",
  description: "Advanced AI ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex"
      suppressHydrationWarning={true}
      >
        {/* Sidebar Hamesha Left Par Rahega */}
        <Sidebar />
        
        {/* Main Content Area (Jahan Dashboard dikhega) */}
        <main className="flex-1 ml-64 p-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}