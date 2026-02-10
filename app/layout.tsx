import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MedSkillz - Educación e Investigación Médica',
  description:
    'Potenciando tu camino en la Medicina: Educación, Investigación y Resultados. Asesoría de tesis, proyectos de investigación y reportes de caso.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#6D28D9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
