
import { ReduxProvider } from "@/redux/ReduxProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import Whatsapp from "../components/whatsapp/Whatsapp";
import AppWrapper from "../components/appWrapper/AppWrapper";
import Head from "next/head";


const inter = Inter({subsets:["latin"], weight:["100","200","300","400","500","600","700","800","900"]})
export const metadata = {
  title: "NS Fashion Store",
  description: "Discover the latest trends in fashion at NS Fashion Store. Shop high-quality clothing, accessories, and more with fast delivery and exclusive offers.",
  metadataBase: new URL("https://nsfashionbrand.com"),
  openGraph: {
    title: "NS Fashion Store",
    description: "Shop the latest fashion trends at NS Fashion Store with exclusive offers and fast delivery.",
    url: "https://nsfashionbrand.com",
    siteName: "NS Fashion Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NS Fashion Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NS Fashion Store",
    description: "Shop the latest fashion trends at NS Fashion Store.",
    images: ["/og-image.jpg"],
  },
};

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="NS Fashion Store" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#e74c3c" />
      </Head>
      <body className={`${inter.className}`}>
        <ReduxProvider >
          <AppWrapper>
            {children}
          </AppWrapper>
        </ReduxProvider>
        <Whatsapp />
      </body>
    </html>
  );
}
