import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Skillyards Sales CRM",
  description: "High-velocity Sales Operations and Lead Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-platinum-950 text-platinum-50 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
