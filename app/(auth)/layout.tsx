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
            <NiraWordmark size="lg" variant="mono-white" />
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

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
