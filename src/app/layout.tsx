import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Script from "next/script";


const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Qiens Home | Modern ve Şık Mobilya Tasarımları",
    template: "%s | Qiens Home"
  },
  description: "Eviniz için en şık ve modern mobilya tasarımları. Koltuk takımları, yatak odaları ve yemek odalarında Qiens Home farkını keşfedin.",
  keywords: ["mobilya", "qiens home", "koltuk takımı", "yatak odası", "yemek odası", "ev dekorasyonu"],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://qienshome.com',
    siteName: 'Qiens Home',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${outfit.variable} ${fraunces.variable} scroll-smooth`}>
      <body className="antialiased bg-background text-foreground font-sans min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'premium-toast',
              style: {
                borderRadius: '0px',
                background: '#1A1A1A',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.1em',
              }
            }} 
          />
          <main className="flex-grow">
            {children}
          </main>
          <CartDrawer />
          <SearchOverlay />
          <WhatsAppButton />
        </AuthProvider>
        <Script 
          src="/scripts/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
