import { profile } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/8 bg-black/40">
      <div className="container-rail py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-4)] text-[10px] font-bold text-black">
              AK
            </span>
            <span className="text-sm text-white/70">
              {profile.name} · {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <span>Built with Next.js, Tailwind & too much coffee.</span>
            <span className="hidden sm:block">·</span>
            <span className="hidden sm:block">Bhopal → the world</span>
          </div>
        </div>
        <div className="mt-8 select-none">
          <div className="display-title bg-gradient-to-b from-white/12 to-transparent bg-clip-text text-[18vw] font-medium leading-[0.8] text-transparent md:text-[9rem] lg:text-[12rem]">
            ADWAIT KESHARI
          </div>
        </div>
      </div>
    </footer>
  );
}
