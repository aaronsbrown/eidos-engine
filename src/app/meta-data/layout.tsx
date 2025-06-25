// AIDEV-NOTE: Layout for admin pages - Issue #44 Phase 5
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semantic Metadata Admin | Pattern Generator',
  description: 'Internal admin view of pattern generator semantic data',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}