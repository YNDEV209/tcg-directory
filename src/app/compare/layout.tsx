import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Cards',
  description: 'Compare trading cards side by side on TCG Directory',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
