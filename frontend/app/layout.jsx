import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lihon Gebre - Software Engineer, AI Developer, DevOps Engineer",
  description: "Portfolio of Lihon Gebre, showcasing expertise in Software Engineering, AI Development, and DevOps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Header />
       {children}
      </body>
    </html>
  );
}