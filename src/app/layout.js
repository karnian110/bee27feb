import Footer from "@/components/custom/Footer";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";

export const metadata = {
  title: "ScholarBee",
  description: "Knowledge in Motion",
  icons: {
    icon: "/favicon.svg",          // modern browsers
    shortcut: "/favicon.svg",      // older browsers
    apple: "/favicon.svg",         // iOS home screen
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}