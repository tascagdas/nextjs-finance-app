import { Inter } from "next/font/google";
import "./globals.css";
import useServerDarkMode from "@/hooks/use-server-dark-mode";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Taş Finans",
    default: "Taş Finans"
  },
  description: "Gelir ve Giderleri takip etmek için hazırlanmış bir finans uygulaması",
};

export default function RootLayout({ children }) {
  const theme = useServerDarkMode();

  return (
    <html lang="en" className={theme}>
      <body className={`${inter.className} min-h-screen flex flex-col px-8`}>{children}</body>
    </html>
  );
}
