// Force dynamic rendering for product pages (fixes Turbopack SSR chunk error)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
