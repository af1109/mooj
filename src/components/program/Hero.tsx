import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SaduBand, WaveDivider } from "@/components/ui/Decor";

function HeroArt() {
  return (
    <svg viewBox="0 0 420 360" className="mx-auto w-full max-w-md" role="img" aria-label="رسمة شمس وأمواج الخليج">
      <circle cx="300" cy="90" r="56" fill="#F4E8D2" />
      <circle cx="300" cy="90" r="40" fill="#FFF9F0" opacity=".6" />
      <g fill="#B96548">
        <path d="M60 60l10 10-10 10-10-10zM90 60l10 10-10 10-10-10zM120 60l10 10-10 10-10-10z" />
      </g>
      <path d="M0 200c40-30 80-30 120 0s80 30 120 0 80-30 120 0 40 15 60 5v155H0z" fill="#21B6B0" />
      <path d="M0 245c40-30 80-30 120 0s80 30 120 0 80-30 120 0 40 15 60 5v110H0z" fill="#087E83" />
      <path d="M0 290c40-30 80-30 120 0s80 30 120 0 80-30 120 0 40 15 60 5v65H0z" fill="#064B50" />
      {/* swimmer goggles + head */}
      <circle cx="170" cy="185" r="26" fill="#F4E8D2" />
      <rect x="150" y="176" width="40" height="14" rx="7" fill="#064B50" />
      <circle cx="162" cy="183" r="5" fill="#21B6B0" />
      <circle cx="178" cy="183" r="5" fill="#21B6B0" />
      <path d="M205 190c20-6 40-30 60-24" stroke="#F4E8D2" strokeWidth="12" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gulf text-white">
      <div className="container-x grid items-center gap-8 pb-8 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-sand">
            برنامج الصيف للأعمار 6–17 سنة
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">صيفهم غير مع موجة! 🌊</h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-sand">
            14 يوم من السباحة والوناسة والتعلّم، بأجواء صيفية كويتية مميزة.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryButton href="/seasons" className="bg-turquoise text-gulf hover:bg-white">
              يلا نبدأ التسجيل
            </PrimaryButton>
            <PrimaryButton href="/#program" className="border-2 border-sand bg-transparent text-white hover:bg-white/10">
              اكتشف البرنامج
            </PrimaryButton>
          </div>
        </div>
        <HeroArt />
      </div>
      <SaduBand light className="opacity-80" />
      <WaveDivider fill="text-cream" />
    </section>
  );
}