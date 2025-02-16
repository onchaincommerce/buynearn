import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buy & Earn',
  description: 'Buy and earn yield on Base',
  manifest: '/manifest.json',
  themeColor: '#1a1a1a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    title: 'Buy & Earn',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Buy & Earn" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/splash.png" />
        <Script 
          id="prevent-standalone-navigation"
          strategy="beforeInteractive"
        >
          {`
            if (window.navigator.standalone) {
              window.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.getAttribute('target') !== '_blank') {
                  e.preventDefault();
                  window.location.href = e.target.href;
                }
              });
            }
          `}
        </Script>
        <Script src="/register-sw.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
