import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Profile.ai - Personal Profile',
  description: 'Create and share your personal profile',
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


