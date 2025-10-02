import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext"; // Important: @ et pas ./
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/layout/home/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youssef Mosbah | Data Science Portfolio",
  description: "Étudiant en Data Science passionné par l'analyse de données, l'IA et la création de solutions innovantes.",
  keywords: ["Data Science", "Machine Learning", "Portfolio", "Youssef Mosbah", "IA"],
  authors: [{ name: "Youssef Mosbah" }],
  openGraph: {
    title: "Portfolio | Youssef Mosbah",
    description: "Découvrez mes projets en Data Science, IA et développement.",
    url: "https://youssef-mosbah.com",
    siteName: "Youssef Mosbah Portfolio",
    images: [
      {
        url: "/og-image.png", // image OpenGraph dans /public
        width: 1200,
        height: 630,
        alt: "Youssef Mosbah - Data Science Portfolio",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode') === 'true';
                  const themeColor = localStorage.getItem('themeColor') || 'blue';
                  
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.setAttribute('data-theme', themeColor);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}