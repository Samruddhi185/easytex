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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"></link>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" ></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05"></script>
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
