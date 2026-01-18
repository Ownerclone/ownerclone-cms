import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OwnerClone CMS',
  description: 'Screenplay-first content management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
