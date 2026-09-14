// The cover-reveal transition (branded wavy panel -> form) and the
// desktop split-screen / mobile full-screen responsive handling both now
// live in AuthCoverReveal, wrapped around each page's own form content —
// this layout just passes children through.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
