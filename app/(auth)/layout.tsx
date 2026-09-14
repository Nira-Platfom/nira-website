import Link from "next/link";
import NiraWordmark from "@/components/NiraWordmark";
import AuthVisual from "@/components/AuthVisual";
import { CountUp, FadeUp } from "@/components/animations";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-coral via-[#ff8585] to-coral-dark flex-col overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-16 bottom-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/3 right-8 w-40 h-40 rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 pt-10 pb-8">
          <FadeUp>
            <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              {/* Source PNG's opaque pixels are coral, not white — brightness(0)
                  invert(1) forces a true white silhouette regardless, since
                  coral-on-coral here would be nearly invisible. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/nira-icon-white.png"
                alt=""
                className="w-8 h-8"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <NiraWordmark size="lg" variant="mono-white" />
            </Link>
            <p className="text-white/90 text-lg font-serif mt-2">Africa&rsquo;s AI Beauty Marketplace</p>
          </FadeUp>

          <div className="flex-1 min-h-0">
            <FadeUp delay={0.15} className="h-full">
              <AuthVisual />
            </FadeUp>
          </div>

          <FadeUp delay={0.25}>
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <p className="font-serif text-2xl text-white">
                  <CountUp to={500} suffix="+" />
                </p>
                <p className="text-white/70 text-xs mt-1">Businesses</p>
              </div>
              <div className="border-x border-white/20">
                <p className="font-serif text-2xl text-white">24/7</p>
                <p className="text-white/70 text-xs mt-1">AI support</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-white">4.9 ★</p>
                <p className="text-white/70 text-xs mt-1">Avg. rating</p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-5">
              <p className="text-white/90 text-[14px] italic mb-1.5">&ldquo;Nira transformed how my salon operates&rdquo;</p>
              <p className="text-white/70 text-[12px]">— Grace Kamau, Grace Beauty Salon ★★★★★</p>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Mobile/tablet: the desktop branding panel above is hidden entirely
          below lg, which previously left nothing but a bare white page and
          a small centered logo — the actual cause of it reading as "cheap"
          on a phone. A compact gradient hero (echoing the desktop panel)
          with the form rising over it as a rounded sheet gives mobile real
          brand presence instead of just disappearing at that breakpoint. */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-coral via-[#ff8585] to-coral-dark pt-14 pb-20 px-6">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -left-12 -bottom-8 w-48 h-48 rounded-full bg-white/[0.08] pointer-events-none" />
          <Link href="/" className="relative z-10 inline-flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/nira-icon-white.png"
              alt=""
              className="w-7 h-7"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <NiraWordmark size="md" variant="mono-white" />
          </Link>
          <p className="relative z-10 text-white/90 text-sm mt-2">Africa&rsquo;s AI Beauty Marketplace</p>
        </div>

        <div className="flex-1 lg:flex-none lg:w-full lg:max-w-md bg-white rounded-t-[28px] lg:rounded-none -mt-8 lg:mt-0 relative z-10 shadow-[0_-12px_32px_rgba(30,41,59,0.08)] lg:shadow-none px-6 pt-8 pb-10 sm:px-8 lg:p-0">
          {children}
        </div>
      </div>
    </div>
  );
}
