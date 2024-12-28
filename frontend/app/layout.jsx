import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WanduGPT",
  description: "WanduGPT AI for Wandubot, providing advanced AI chat capabilities.",
  keywords: "WanduGPT, Wandubot, AI, Chatbot, AI Development",
  author: "Wandubot Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <strong>
          <Header />
        </strong>
        {children}
      </body>
    </html>
  );
}