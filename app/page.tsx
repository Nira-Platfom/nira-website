import Link from 'next/link'
import AnimatedChat    from '../components/AnimatedChat'
import AnimatedRevenue from '../components/AnimatedRevenue'
import BusinessTypeFeatures from '../components/BusinessTypeFeatures'
import Reveal          from '../components/Reveal'

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Dashboard phone mockup (static — for bookings feature)
function DashboardPhone() {
  return (
    <div className="relative mx-auto w-[265px]">
      <div className="absolute inset-0 -translate-y-4 -translate-x-4 rounded-[44px] bg-lavender opacity-20 blur-3xl pointer-events-none" />
      <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex justify-between items-center px-6 pt-3 pb-1">
          <span className="text-white/80 text-[10px]">9:41</span>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400">Good morning 👋</p>
            <p className="text-sm font-medium text-[#1E293B]">Glam Beauty Salon</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-coral-light flex items-center justify-center">
            <span className="text-[11px] font-medium text-coral">G</span>
          </div>
        </div>
        <div className="bg-[#F8F7FF] px-3 py-3 grid grid-cols-2 gap-2">
          {[
            { label: "Today's Bookings", value: '8', sub: '↑ +2 more', subColor: 'text-mint-dark' },
            { label: 'Revenue Today',    value: 'TZS 480K', sub: '+23%', subColor: 'text-mint-dark' },
            { label: 'Customers',        value: '124', sub: '+12 new', subColor: 'text-lavender-dark' },
            { label: 'Bot Active',       value: '24/7', sub: '● online', subColor: 'text-mint-dark' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-[9px] text-slate-400 mb-0.5 leading-tight">{s.label}</p>
              <p className="text-sm font-serif text-[#1E293B]">{s.value}</p>
              <p className={`text-[9px] font-medium ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-white px-3 py-3">
          <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wide">Upcoming Bookings</p>
          {[
            { name: 'Amina K.',  service: 'Classic Facial', time: '10:00 AM' },
            { name: 'Rehema M.', service: 'Manicure',       time: '11:30 AM' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-lavender-light flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-medium text-lavender-dark">{b.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-[#1E293B]">{b.name}</p>
                <p className="text-[9px] text-slate-400">{b.service}</p>
              </div>
              <span className="text-[9px] font-medium text-coral">{b.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Leaflet data for fern SVGs ───────────────────────────────────────────────
const FERN_LEAFLETS: [number,number,number,number,number,number][] = [
  [76,228,22,9,-38,58],[73,198,24,10,-42,62],[69,168,26,10,-46,64],
  [64,138,26,10,-48,66],[58,108,24,9,-50,68],[51,79,22,8,-52,70],[44,54,18,8,-52,72],
]
const FRONT_FERN_LEAFLETS: [number,number,number,number,number,number][] = [
  [66,145,28,10,-35,55],[62,118,32,11,-40,60],[56,91,30,10,-44,64],
  [49,64,28,10,-47,67],[41,40,24,9,-50,70],
]

// ─── Spa Scene ────────────────────────────────────────────────────────────────
function SpaScene() {
  const W = 520, H = 580
  const starPath = 'M 0 -6 L 1.4 -1.4 L 6 0 L 1.4 1.4 L 0 6 L -1.4 1.4 L -6 0 L -1.4 -1.4 Z'
  const monsteraPath = 'M 110 196 C 75 178 28 150 10 108 C -5 72 15 30 50 16 C 68 7 95 15 110 38 C 125 15 152 7 170 16 C 205 30 225 72 210 108 C 192 150 145 178 110 196 Z'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* ── Canvas ── */}
      <div className="spa-canvas" style={{ position: 'relative', width: W, height: H, overflow: 'hidden' }}>

        {/* ═══ LAYER 1 — ORGANIC BLOBS ═══ */}
        <div style={{
          position: 'absolute', width: 380, height: 340, top: -40, right: -60, zIndex: 0,
          background: 'rgba(107,207,184,0.18)', borderRadius: '71% 29% 60% 40% / 40% 55% 45% 60%',
          animation: 'blob1 12s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 260, height: 240, top: 180, right: 40, zIndex: 0,
          background: 'rgba(184,169,224,0.20)', borderRadius: '40% 60% 45% 55% / 55% 40% 60% 45%',
          animation: 'blob2 10s ease-in-out 3s infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 180, height: 160, bottom: 20, right: 200, zIndex: 0,
          background: 'rgba(255,107,107,0.14)', borderRadius: '60% 40% 55% 45% / 45% 60% 40% 55%',
          animation: 'blob3 8s ease-in-out 5s infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 220, height: 200, bottom: -30, right: -40, zIndex: 0,
          background: 'rgba(245,230,210,0.50)', borderRadius: '50% 50% 65% 35% / 40% 60% 40% 60%',
          animation: 'blob1 14s ease-in-out 1s infinite', pointerEvents: 'none',
        }} />

        {/* ═══ LAYER 2 — BACK LEAVES ═══ */}

        {/* Monstera leaf — top-right, dominant */}
        <div style={{
          position: 'absolute', top: -20, right: -10, zIndex: 1,
          transformOrigin: 'bottom center', animation: 'leaf-sway-1 7s ease-in-out infinite', pointerEvents: 'none',
        }}>
          <svg width={220} height={200} viewBox="0 0 220 200">
            <path d={monsteraPath} fill="#6BCFB8" opacity={0.85} />
            {/* Characteristic monstera holes */}
            <ellipse cx={58} cy={108} rx={20} ry={32} fill="rgba(255,255,255,0.90)" transform="rotate(-16 58 108)" />
            <ellipse cx={162} cy={106} rx={18} ry={30} fill="rgba(255,255,255,0.90)" transform="rotate(16 162 106)" />
            <ellipse cx={110} cy={150} rx={13} ry={19} fill="rgba(255,255,255,0.82)" />
            {/* Veins */}
            <path d="M 110 196 C 109 155 108 92 110 38" stroke="rgba(255,255,255,0.42)" strokeWidth={1.5} fill="none" />
            <path d="M 110 94 C 88 84 62 75 38 72"  stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
            <path d="M 110 114 C 82 102 55 95 30 94" stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
            <path d="M 110 134 C 88 126 65 123 46 123" stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
            <path d="M 110 94 C 132 84 158 75 182 72"  stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
            <path d="M 110 114 C 138 102 165 95 190 94" stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
            <path d="M 110 134 C 132 126 155 123 174 123" stroke="rgba(255,255,255,0.28)" strokeWidth={1} fill="none" />
          </svg>
        </div>

        {/* Fern/palm leaf — upper left of products */}
        <div style={{
          position: 'absolute', top: 55, right: 175, zIndex: 1,
          transformOrigin: 'bottom center', animation: 'leaf-sway-2 9s ease-in-out 1.5s infinite', pointerEvents: 'none',
        }}>
          <svg width={160} height={260} viewBox="0 0 160 260">
            <path d="M 80 258 C 77 205 68 148 54 93 C 43 50 34 16 38 5"
              stroke="#B8A9E0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
            {FERN_LEAFLETS.map((l, i) => (
              <ellipse key={`fl${i}`} cx={l[0]} cy={l[1]} rx={l[2]/2} ry={l[3]/2}
                fill="#B8A9E0" opacity={0.68} transform={`rotate(${l[4]} ${l[0]} ${l[1]})`} />
            ))}
            {FERN_LEAFLETS.map((l, i) => (
              <ellipse key={`fr${i}`} cx={l[0]} cy={l[1]} rx={l[2]/2} ry={l[3]/2}
                fill="#B8A9E0" opacity={0.68} transform={`rotate(${l[5]} ${l[0]} ${l[1]})`} />
            ))}
          </svg>
        </div>

        {/* Tiny accent leaf — right edge */}
        <div style={{ position: 'absolute', top: 275, right: -10, zIndex: 1, pointerEvents: 'none' }}>
          <svg width={70} height={90} viewBox="0 0 70 90">
            <path d="M 35 88 C 15 70 5 40 20 15 C 28 3 42 3 50 15 C 65 40 55 70 35 88 Z"
              fill="rgba(107,207,184,0.58)" />
            <path d="M 35 88 C 34 60 33 30 35 10" stroke="rgba(255,255,255,0.35)" strokeWidth={1} fill="none" />
          </svg>
        </div>

        {/* Leaf 3 — small, z-index 4 (partial depth in front of products) */}
        <div style={{
          position: 'absolute', bottom: 95, right: 375, zIndex: 4,
          animation: 'leaf-float 5s ease-in-out 2s infinite', pointerEvents: 'none',
        }}>
          <svg width={100} height={130} viewBox="0 0 100 130">
            <path d="M 50 128 C 20 100 5 60 15 25 C 22 5 38 0 50 8 C 62 0 78 5 85 25 C 95 60 80 100 50 128 Z"
              fill="#6BCFB8" opacity={0.73} />
            <path d="M 50 128 C 49 90 48 50 50 8" stroke="rgba(255,255,255,0.38)" strokeWidth={1.2} fill="none" />
          </svg>
        </div>

        {/* ═══ LAYER 3 — PRODUCT CLUSTER ═══ */}
        <div className="spa-cluster" style={{
          position: 'absolute', left: 85, top: 112, zIndex: 3,
          animation: 'cluster-breathe 7s ease-in-out infinite',
        }}>

          {/* Reed Diffuser — back-center, tallest */}
          <div style={{ position: 'absolute', left: 122, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Sticks */}
            <div style={{ position: 'relative', width: 64, height: 104, transformOrigin: 'bottom center', animation: 'reed-sway 6s ease-in-out infinite' }}>
              {[-25,-14,-4,5,15,25].map((deg, i) => (
                <div key={i} style={{
                  position: 'absolute', bottom: 0, left: 31, width: 2, height: 78 + i * 9,
                  background: '#8B6F5E', borderRadius: 1,
                  transformOrigin: 'bottom center', transform: `rotate(${deg}deg)`,
                }} />
              ))}
            </div>
            {/* Vase */}
            <div style={{
              width: 44, height: 70, background: '#F5F0E8', border: '1.5px solid #E8DDD4',
              borderRadius: '4px 4px 8px 8px', boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -2,
            }}>
              <div style={{ width: 28, height: 30, background: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={14} height={14} viewBox="0 0 14 14">
                  <path d="M 7 13 C 3 10 1 5 4 2 C 5.5 0.5 8.5 0.5 10 2 C 13 5 11 10 7 13 Z" fill="#6BCFB8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pump Bottle — tall, left of diffuser */}
          <div style={{ position: 'absolute', left: 58, top: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 28, height: 4, background: '#B8745A', borderRadius: 2, alignSelf: 'flex-start', marginLeft: 5, transform: 'rotate(-5deg)', marginBottom: -2 }} />
            <div style={{ width: 16, height: 24, background: '#C4845A', borderRadius: 2 }} />
            <div style={{
              width: 50, height: 110, background: '#D4956A', borderRadius: '8px 8px 4px 4px', marginTop: -1,
              boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 34, height: 40, background: 'rgba(255,255,255,0.85)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={16} height={16} viewBox="0 0 14 14">
                  <path d="M 7 13 C 3 10 1 5 4 2 C 5.5 0.5 8.5 0.5 10 2 C 13 5 11 10 7 13 Z" fill="#6BCFB8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dark Dropper Bottle — amber glass, left side */}
          <div style={{ position: 'absolute', left: 10, top: 42, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 18, height: 22, background: '#8B6F5E', borderRadius: '3px 3px 2px 2px' }} />
            <div style={{ width: 14, height: 16, background: '#5A3422', marginTop: -1 }} />
            <div style={{
              position: 'relative', width: 32, height: 90, background: '#6B3F2A',
              borderRadius: '4px 4px 6px 6px', boxShadow: '2px 0 8px rgba(0,0,0,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -1,
            }}>
              <div style={{ width: 18, height: 22, background: 'rgba(245,230,208,0.25)', borderRadius: 2 }} />
              {/* Golden drop */}
              <div style={{
                position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
                width: 6, height: 8, background: '#F5C842',
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                animation: 'drop-fall 2.5s ease-in infinite',
              }} />
            </div>
          </div>

          {/* Cream Jar — hero product, front-center */}
          <div style={{ position: 'absolute', left: 85, top: 198 }}>
            {/* Lid (angled, slightly behind) */}
            <div style={{ width: 84, height: 18, background: '#E8D5C0', borderRadius: '6px 6px 2px 2px', transform: 'rotate(-8deg)', position: 'absolute', top: -14, left: -2 }} />
            {/* Body */}
            <div style={{
              position: 'relative', width: 80, height: 36, background: '#FAF6F0', border: '1.5px solid #E8DDD4',
              borderRadius: '8px 8px 12px 12px', boxShadow: '0px 6px 16px rgba(0,0,0,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4,
            }}>
              <div style={{ width: 58, height: 10, background: 'rgba(255,255,255,0.92)', borderRadius: '50%' }} />
            </div>
            {/* Spatula */}
            <div style={{ position: 'absolute', right: -18, top: -12, width: 4, height: 42, background: '#B8A9E0', borderRadius: 2, transform: 'rotate(28deg)' }} />
          </div>

          {/* Serum Bottle — mint cap, right side */}
          <div style={{ position: 'absolute', left: 198, top: 112, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 16, height: 14, background: '#6BCFB8', borderRadius: '3px 3px 1px 1px' }} />
            <div style={{ width: 12, height: 10, background: '#A0522D', marginTop: -1 }} />
            <div style={{
              width: 28, height: 58, background: '#A0522D', borderRadius: '4px 4px 8px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -1,
            }}>
              <div style={{ width: 14, height: 14, background: 'rgba(255,255,255,0.70)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={8} height={8} viewBox="0 0 8 8">
                  <path d="M 4 7.5 C 1.5 6 0.5 3 2 1.5 C 3 0.5 5 0.5 6 1.5 C 7.5 3 6.5 6 4 7.5 Z" fill="#6BCFB8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Candle Jar — right, front, flickering flame */}
          <div style={{ position: 'absolute', left: 212, top: 184 }}>
            {/* Flame + wick */}
            <div style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 8, height: 14, background: '#FF6B6B',
                borderRadius: '50% 50% 30% 30% / 70% 70% 30% 30%',
                animation: 'flame-flicker 0.8s ease-in-out infinite alternate', alignSelf: 'center',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 2,
              }}>
                <div style={{ width: 4, height: 7, background: '#F5C842', borderRadius: '50% 50% 30% 30% / 70% 70% 30% 30%' }} />
              </div>
              <div style={{ width: 2, height: 8, background: '#4A3728' }} />
            </div>
            {/* Wax surface */}
            <div style={{ width: 44, height: 8, background: '#F5EDD8', borderRadius: '50%', margin: '0 auto' }} />
            {/* Jar */}
            <div style={{
              width: 54, height: 48, background: '#FAF6F0', border: '1px solid #E8DDD4',
              borderRadius: '6px 6px 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 38, height: 28, background: 'white', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: 8, color: '#64748B' }}>Candle</span>
                <svg width={10} height={12} viewBox="0 0 10 12">
                  <path d="M 5 11 C 2 8 1 4 3 1.5 C 4 0.5 6 0.5 7 1.5 C 9 4 8 8 5 11 Z" fill="#FF6B6B" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stacked Lavender Stones — far left, decorative */}
          <div style={{ position: 'absolute', left: -8, top: 193 }}>
            {(['#F0ECFB','#D4C5F0','#B8A9E0'] as const).map((c, i) => (
              <div key={i} style={{
                width: 36 - i * 4, height: 10, background: c, borderRadius: 999,
                marginLeft: [2,-1,1][i], marginBottom: 2,
                boxShadow: i === 2 ? '0 3px 6px rgba(0,0,0,0.08)' : undefined,
              }} />
            ))}
          </div>

        </div>{/* end cluster */}

        {/* ═══ LAYER 4 — FRONT LEAVES (depth overlap) ═══ */}

        {/* Fern branch — bottom-left, in front of products */}
        <div style={{
          position: 'absolute', bottom: -10, right: 325, zIndex: 5,
          transformOrigin: 'bottom center', animation: 'leaf-sway-2 8s ease-in-out 0.5s infinite', pointerEvents: 'none',
        }}>
          <svg width={140} height={180} viewBox="0 0 140 180">
            <path d="M 70 178 C 66 140 55 100 40 62 C 28 30 20 10 24 5"
              stroke="#4DB8A0" strokeWidth={3} fill="none" strokeLinecap="round" />
            {FRONT_FERN_LEAFLETS.map((l, i) => (
              <ellipse key={`ffl${i}`} cx={l[0]} cy={l[1]} rx={l[2]/2} ry={l[3]/2}
                fill="#6BCFB8" opacity={0.88} transform={`rotate(${l[4]} ${l[0]} ${l[1]})`} />
            ))}
            {FRONT_FERN_LEAFLETS.map((l, i) => (
              <ellipse key={`ffr${i}`} cx={l[0]} cy={l[1]} rx={l[2]/2} ry={l[3]/2}
                fill="#6BCFB8" opacity={0.88} transform={`rotate(${l[5]} ${l[0]} ${l[1]})`} />
            ))}
          </svg>
        </div>

        {/* Small sprig — right, in front of jar */}
        <div style={{
          position: 'absolute', bottom: 78, right: 58, zIndex: 5,
          animation: 'leaf-float 5s ease-in-out 3s infinite', pointerEvents: 'none',
        }}>
          <svg width={80} height={100} viewBox="0 0 80 100">
            <path d="M 40 98 C 20 78 10 48 20 22 C 27 5 38 0 40 8 C 42 0 53 5 60 22 C 70 48 60 78 40 98 Z"
              fill="rgba(107,207,184,0.78)" />
            <path d="M 40 98 C 39 70 38 40 40 8" stroke="rgba(255,255,255,0.38)" strokeWidth={1} fill="none" />
          </svg>
        </div>

        {/* ═══ LAYER 5 — SCATTERED PETALS ═══ */}
        {([
          [80, 158, 30,  '#FFB3C1', 5.0, 0.0],
          [352,118, -22, '#FFE8E8', 6.0, 1.2],
          [262,298, 45,  '#F5E6D0', 4.0, 2.5],
          [428,355, -35, '#FFB3C1', 7.0, 0.8],
          [142,418, 15,  '#FFE8E8', 5.5, 3.5],
        ] as [number,number,number,string,number,number][]).map(([x,y,r,c,d,dl], i) => (
          <div key={`pt${i}`} className="spa-sparkle" style={{
            position: 'absolute', left: x, top: y, width: 10, height: 18,
            background: c, borderRadius: '50%', transform: `rotate(${r}deg)`, opacity: 0.78,
            animation: `petal-drift ${d}s ease-in-out ${dl}s infinite alternate`, pointerEvents: 'none',
          }} />
        ))}

        {/* ═══ LAYER 5 — SPARKLES ═══ */}
        {([
          [55,  68,  10, '#F5C842', 'star', 2.5, 0.0],
          [452, 108, 8,  '#F5C842', 'star', 3.0, 0.8],
          [102, 198, 12, '#F5C842', 'star', 2.0, 1.5],
          [398, 248, 9,  '#F5C842', 'star', 3.5, 2.0],
          [58,  338, 6,  '#FF6B6B', 'dot',  2.2, 0.5],
          [470, 328, 5,  '#B8A9E0', 'dot',  2.8, 1.8],
          [298, 78,  6,  '#FF6B6B', 'dot',  1.8, 3.0],
          [162, 458, 5,  '#B8A9E0', 'dot',  3.2, 2.5],
        ] as [number,number,number,string,string,number,number][]).map(([x,y,s,c,t,d,dl], i) => (
          <div key={`sk${i}`} className="spa-sparkle" style={{
            position: 'absolute', left: x, top: y, zIndex: 6,
            animation: `sparkle-twinkle ${d}s ease-in-out ${dl}s infinite`, pointerEvents: 'none',
          }}>
            {t === 'star' ? (
              <svg width={s} height={s} viewBox="-8 -8 16 16">
                <path d={starPath} fill={c} />
              </svg>
            ) : (
              <div style={{ width: s, height: s, borderRadius: '50%', background: c }} />
            )}
          </div>
        ))}

        {/* ═══ LAYER 6 — FLOATING STAT BADGES ═══ */}

        {/* Badge 1 — Bot active (top-left) */}
        <div className="spa-badge" style={{ position: 'absolute', top: 30, left: 8, zIndex: 8, animation: 'badge-float 4s ease-in-out infinite' }}>
          <div style={{ width: 172, background: 'white', borderRadius: 14, boxShadow: '0px 8px 20px rgba(0,0,0,0.10)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.8)', animation: 'fade-in-up 0.5s ease-out 0.6s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6BCFB8', animation: 'dot-pulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#4DB8A0' }}>Bot Active</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 6px' }}>47 messages today</p>
            <div style={{ height: 5, background: '#E4F7F3', borderRadius: 999 }}>
              <div style={{ width: '72%', height: '100%', background: '#6BCFB8', borderRadius: 999 }} />
            </div>
          </div>
        </div>

        {/* Badge 2 — New booking (right side, middle) */}
        <div className="spa-badge" style={{ position: 'absolute', top: 258, right: 5, zIndex: 8, animation: 'badge-float 5s ease-in-out 1.2s infinite' }}>
          <div style={{ width: 166, background: 'white', borderRadius: 14, boxShadow: '0px 8px 20px rgba(0,0,0,0.10)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.8)', animation: 'fade-in-up 0.5s ease-out 0.8s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1E293B' }}>New Booking!</span>
            </div>
            <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 2px' }}>Classic Facial · 10:00 AM</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>Amina Hassan</p>
          </div>
        </div>

        {/* Badge 3 — Rating (right side, upper) */}
        <div className="spa-badge" style={{ position: 'absolute', top: 88, right: 5, zIndex: 8, animation: 'badge-float 3.5s ease-in-out 2.5s infinite' }}>
          <div style={{ width: 152, background: 'white', borderRadius: 14, boxShadow: '0px 8px 20px rgba(0,0,0,0.10)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.8)', animation: 'fade-in-up 0.5s ease-out 1.0s both' }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill="#F5C842">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#1E293B', margin: '0 0 2px' }}>5.0 · 128 reviews</p>
            <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Grace Beauty Salon</p>
          </div>
        </div>

      </div>{/* end canvas */}

      {/* ── Business type pills ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20, animation: 'fade-in-up 0.5s ease-out 0.8s both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0ECFB', border: '1px solid #B8A9E0', borderRadius: 999, padding: '7px 16px' }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth={2.2}>
            <path d="M 6 3 C 6 3 10 8 12 12 C 14 8 18 3 18 3"/>
            <line x1="6" y1="21" x2="6" y2="3"/><line x1="18" y1="21" x2="18" y2="3"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#534AB7' }}>Salon &amp; Spa</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFE8E8', border: '1px solid #FF6B6B', borderRadius: 999, padding: '7px 16px' }}>
          <svg width={14} height={14} viewBox="0 0 16 16" fill="#C04040">
            <path d="M8 0 L9.5 6 L16 8 L9.5 10 L8 16 L6.5 10 L0 8 L6.5 6 Z"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#C04040' }}>Cosmetic Shop</span>
        </div>
      </div>

    </div>
  )
}

export default function HomePage() {
  return (
    <div className="font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-lavender opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="hero-anim-1 inline-flex items-center gap-2 bg-coral-light text-coral text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <span>🇹🇿</span>
                <span>Built for East Africa</span>
              </div>
              <h1 className="hero-anim-2 font-serif text-5xl lg:text-[58px] text-[#1E293B] leading-[1.1] mb-6">
                Your Beauty Business,{' '}
                <span className="text-coral">On Autopilot.</span>
              </h1>
              <p className="hero-anim-3 text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Connect WhatsApp. Let Nira handle bookings, product inquiries and customer support — in Swahili or English — while you focus on your craft.
              </p>
              <div className="hero-anim-4 flex flex-wrap gap-4 mb-10">
                <Link
                  href="/#download"
                  className="btn-shimmer inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-full shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 transition-shadow"
                >
                  Download Free App
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 border border-nira-border text-slate-600 hover:border-coral hover:text-coral font-medium px-7 py-3.5 rounded-full transition-colors"
                >
                  See how it works
                </Link>
              </div>
              {/* Stats */}
              <div className="hero-anim-4 flex flex-wrap gap-8">
                {[
                  { value: '500+', label: 'Active businesses' },
                  { value: '24/7', label: 'AI support' },
                  { value: 'Free', label: 'To get started' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-[#1E293B]">{s.value}</p>
                    <p className="text-sm text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — spa scene */}
            <div className="flex justify-center lg:justify-end">
              <SpaScene />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-nira-border bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[11px] text-slate-400 font-medium uppercase tracking-widest mb-5">
            Trusted by beauty businesses across Tanzania &amp; Kenya
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['💇 Salons', '🧖 Spas', '💄 Cosmetic Shops', '💅 Nail Bars', '✂️ Hair Studios', '🪒 Barbershops'].map((t) => (
              <span key={t} className="text-sm font-medium text-slate-600 bg-white border border-nira-border px-4 py-2 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section id="features">

        {/* Feature 1 — Auto-reply */}
        <div className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <span className="text-xs font-medium text-coral uppercase tracking-widest">01 — Instant Replies</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Never Miss a Customer Message Again
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Nira responds to every WhatsApp message in seconds — even at 3 AM. Prices, availability, product details — answered instantly in your customer&apos;s language.
                </p>
                <ul className="space-y-3">
                  {[
                    'Swahili + English — customer chooses their language',
                    'Instant replies to pricing, services & product questions',
                    'Custom welcome messages that match your brand voice',
                    'Smart AI handles anything outside the standard menu',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-mint-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={150} className="flex justify-center">
                <AnimatedChat />
              </Reveal>
            </div>
          </div>
        </div>

        {/* Feature 2 — Bookings */}
        <div className="py-24 bg-nira-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal delay={150} className="flex justify-center order-2 lg:order-1">
                <DashboardPhone />
              </Reveal>
              <Reveal className="order-1 lg:order-2">
                <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">02 — Smart Bookings</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Fill Your Calendar Without Lifting a Finger
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Customers book appointments directly through WhatsApp. Nira handles the entire flow — service selection, date, time, and confirmation — automatically.
                </p>
                <ul className="space-y-3">
                  {[
                    'Guided booking flow entirely inside WhatsApp chat',
                    'All appointments sync to your mobile dashboard instantly',
                    'See today\'s full schedule at a glance on your phone',
                    'Customers get automatic booking confirmation messages',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-lavender-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Feature 3 — Revenue */}
        <div className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <span className="text-xs font-medium text-mint-dark uppercase tracking-widest">03 — Revenue & Analytics</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Real-Time Revenue. Beautiful Results.
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Watch your revenue grow on a live dashboard. Track bookings, top products, and customer trends — all from your phone with animated, easy-to-read charts.
                </p>
                <ul className="space-y-3">
                  {[
                    'Animated revenue bar chart updates in real time',
                    'Best-selling products & most popular services',
                    'Customer activity — who spends most with you',
                    'Weekly & monthly comparisons at a glance',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-mint-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={150} className="flex justify-center">
                <AnimatedRevenue />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS TYPE FEATURES ────────────────────────────────────── */}
      <section className="py-24 bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">04 — Built for Your Business</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-4">
              Tailored for Salons &amp; Cosmetic Shops
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Nira adapts to your business type. Whether you run a salon, spa, or cosmetic shop — every feature is built around how your customers interact with you on WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <BusinessTypeFeatures />
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-nira-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-lavender opacity-[0.05] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Simple Setup</span>
            <h2 className="font-serif text-4xl text-white mt-3">Up and Running in Minutes</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              No technical skills required. If you have a WhatsApp Business number, you&apos;re ready.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Download & Register',
                desc: 'Download the Nira app and create your business account. Choose your business type — salon, spa, or cosmetic shop.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3" />
                  </svg>
                ),
                delay: 0,
              },
              {
                step: '02',
                title: 'Connect WhatsApp',
                desc: 'Link your existing WhatsApp Business number. Nira gives you a one-click setup URL — paste it in Meta Business Suite.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                ),
                delay: 100,
              },
              {
                step: '03',
                title: 'Nira Does the Rest',
                desc: 'Add your services or products, activate the bot, and watch Nira handle every customer message 24/7.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                delay: 200,
              },
            ].map((item) => (
              <Reveal key={item.step} delay={item.delay}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral mb-5">
                    {item.icon}
                  </div>
                  <p className="step-num font-serif text-3xl mb-2">{item.step}</p>
                  <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Pricing</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3">Simple, Honest Pricing</h2>
            <p className="text-slate-500 mt-4">Start free. Upgrade when you&apos;re ready to grow.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Free',
                price: 'TZS 0',
                desc: 'Perfect for getting started',
                features: ['100 messages/month', '1 user', 'Basic bot replies', 'Bookings & orders'],
                cta: 'Get started free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'TZS 25,000',
                desc: 'For growing businesses',
                features: ['Unlimited messages', '3 users', 'AI skincare advice', 'Full analytics', 'Broadcasts'],
                cta: 'Start free trial',
                highlight: true,
              },
              {
                name: 'Business',
                price: 'TZS 50,000',
                desc: 'For established businesses',
                features: ['Unlimited messages', '10 users', 'Everything in Pro', 'Custom bot flows', 'Priority support'],
                cta: 'Start free trial',
                highlight: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`relative rounded-2xl p-7 h-full ${
                    plan.highlight
                      ? 'bg-coral text-white shadow-2xl shadow-coral/30 md:-mt-3 md:mb-3'
                      : 'bg-white border border-nira-border'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-white/70' : 'text-slate-400'}`}>{plan.name}</h3>
                  <p className={`font-serif text-3xl mb-1 ${plan.highlight ? 'text-white' : 'text-[#1E293B]'}`}>{plan.price}<span className={`text-sm font-sans ml-1 ${plan.highlight ? 'text-white/60' : 'text-slate-400'}`}>/mo</span></p>
                  <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/80' : 'text-slate-500'}`}>{plan.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-white/90' : 'text-slate-600'}`}>
                        <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-mint-dark'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors ${
                      plan.highlight ? 'bg-white text-coral hover:bg-coral-light' : 'bg-coral text-white hover:bg-coral-dark'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-center text-sm text-slate-400">
              All paid plans include a 30-day free trial. No credit card required.{' '}
              <Link href="/pricing" className="text-coral hover:underline font-medium">View full pricing →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Testimonials</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3">Loved by Beauty Businesses</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: 'Before Nira, I spent 3 hours every day just answering WhatsApp. Now the bot handles everything and I focus on my clients. Bookings increased by 40% in the first month!',
                name: 'Fatuma Hassan',
                role: 'Owner, Glam Beauty Salon — Dar es Salaam',
                initials: 'FH',
                bg: 'bg-lavender-light',
                delay: 0,
              },
              {
                quote: 'My shop gets 200+ WhatsApp messages daily. Nira answers product questions, recommends the right creams for each skin type, and even takes orders. I no longer miss a single sale.',
                name: 'Grace Wanjiku',
                role: 'Owner, GlowUp Cosmetics — Nairobi',
                initials: 'GW',
                bg: 'bg-coral-light',
                delay: 100,
              },
            ].map((t) => (
              <Reveal key={t.name} delay={t.delay}>
                <div className="bg-nira-bg border border-nira-border rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-medium text-[#1E293B]">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1E293B] text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <section id="download" className="py-20 relative overflow-hidden">
        {/* Coral gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral via-[#ff8585] to-[#E55555]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white opacity-[0.06] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <Reveal>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">Start Today — It&apos;s Free</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">
              Grow Your Beauty Business with AI
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Join 500+ beauty businesses in East Africa using Nira to serve customers 24/7. Free to start, no technical skills needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a href="#" className="flex items-center gap-3 bg-[#1E293B] hover:bg-[#2D3F57] text-white px-6 py-3.5 rounded-xl transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</p>
                  <p className="text-sm font-medium leading-none">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-[#1E293B] hover:bg-[#2D3F57] text-white px-6 py-3.5 rounded-xl transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.28.15.6.19.91.12l11.64-11.64L12 8.5 3.18 23.76zM20.68 9.8L17.5 8l-3.7 3.7 3.7 3.7 3.22-1.83c.92-.52.92-2.25-.04-2.77zM2.01.37C1.73.56 1.55.87 1.55 1.24v21.52c0 .37.18.68.46.87L13.5 12 2.01.37zM15.6 3.8L4.1.07c-.31-.1-.63-.06-.91.12L15.5 12.2 19.5 8.2l-3.9-4.4z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Get it on</p>
                  <p className="text-sm font-medium leading-none">Google Play</p>
                </div>
              </a>
            </div>
            <p className="text-white/50 text-sm">Free · iOS & Android · No credit card required</p>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
