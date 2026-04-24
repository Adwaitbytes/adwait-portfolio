import { profile } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-10 border-t border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)]">
      <div className="container-rail py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-4)] text-[10px] font-bold text-black">
              AK
            </span>
            <span className="text-sm text-[color:var(--color-ink-dim)]">
              {profile.name} · {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-[color:var(--color-ink-mute)]">
            <span>Built with Next.js, Tailwind & too much coffee.</span>
            <span className="hidden sm:block">·</span>
            <span className="hidden sm:block">Bhopal → the world</span>
          </div>
        </div>
        <div className="mt-8 select-none">
          <div
            className="display-title bg-clip-text text-[18vw] font-medium leading-[0.8] text-transparent md:text-[9rem] lg:text-[12rem]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(var(--tone-fg), 0.14), transparent)",
            }}
          >
            ADWAIT KESHARI
          </div>
        </div>
      </div>
    </footer>
  );
}
