import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasyTeX'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/"></link>
      </head>
      <body className={inter.className}>
      <Providers>
       {children}
      </Providers>
      </body>
    </html>
  );
}
