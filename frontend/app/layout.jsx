import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "What'sUp Doc AI",
  description: "What'sUp Doc AI — DrinfinityAI's medical assistant.",
  keywords: "medical AI, clinical assistant, DrinfinityAI, healthcare, What'sUp Doc",
  author: "DrinfinityAI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <strong>
          <Header />
        </strong>
        {children}
      </body>
    </html>
  );
}