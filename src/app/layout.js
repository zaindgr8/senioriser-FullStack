import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import FooterWhite from "../components/footer-white";
import { Inter_Tight } from "next/font/google";

import Header from "../components/Header";
const inter = Inter_Tight({ subsets: ["latin"] });
export const metadata = {
  title: "Senioriser",
  description: "Connects Communities with Real Estate Agents",
  icons: {
    icon: ["/home.png?v=4"],
    apple: ["/home.png?v4"],
    shortcut: ["/home.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Header />
          {children}
          <FooterWhite />
        </div>
      </body>
    </html>
  );
}
