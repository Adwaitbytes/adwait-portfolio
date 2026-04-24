"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "@/lib/data";
import { Plus } from "lucide-react";
import AskAdwait from "@/components/AskAdwait";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28">
      <div className="container-rail">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="section-label mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-white/30" />
              06 · FAQ
            </div>
            <h2 className="display-title text-balance text-4xl text-white md:text-5xl">
              Questions before we talk?
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-white/55">
              If you're still scrolling, you're probably serious. Here's the
              short version.
            </p>
          </div>
          <div>
            <div className="divide-y divide-white/8 border-y border-white/8">
              {faq.map((f, i) => {
                const isOpen = open === i;
                return (
                  <button
                    key={f.q}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full py-6 text-left"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="text-lg text-white md:text-xl">{f.q}</div>
                      <Plus
                        size={18}
                        className={`shrink-0 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 text-[15px] leading-relaxed text-white/60">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            {/* AI concierge — question not in the list? ask Adwait directly */}
            <div className="mt-10">
              <AskAdwait mode="inline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
