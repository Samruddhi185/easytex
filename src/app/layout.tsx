"use client"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";
import './globals.css';
import React, { useEffect, useState } from 'react';
import SplashScreen from './splashScreen';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'EasyTeX'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathName = usePathname()
  const isHome = pathName === "/"
  const [isLoading, setIsLoading] = useState(isHome)

  useEffect(() => {
    if (isLoading) return
  }, [isLoading])

  return (
    <html lang="en" className='dark'>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/"></link>
      </head>
      <body className={inter.className}>
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)}/>
        ) : (
          <Providers>
          {children}
          </Providers>
        )
        }
      </body>
    </html>
  );
}
