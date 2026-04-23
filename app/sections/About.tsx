"use client";
import { motion } from "motion/react";
import { profile } from "@/lib/data";
import CircleBadge from "@/components/CircleBadge";

export default function About() {
  return (
    <section id="about" className="relative border-t border-white/5 py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="container-rail">
        {/* rail */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>03 — The operator</span>
          <span>adwait.keshari</span>
        </div>

        {/* giant statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
          className="display-title mt-10 text-balance text-[14vw] leading-[0.9] md:text-[11vw] lg:text-[9vw]"
          style={{ letterSpacing: "-0.035em" }}
        >
          I translate <span className="italic font-normal text-white/50">hard</span> primitives <br className="hidden md:block" />
          into products people <br className="hidden md:block" />
          <span className="gradient-text">actually want to use.</span>
        </motion.h2>

        {/* two-col */}
        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          {/* left — vitals */}
          <div className="space-y-10">
            <div className="flex items-center gap-5">
              <div
                className="glow-ring grid h-24 w-24 place-items-center rounded-full font-semibold text-black md:h-28 md:w-28 md:text-3xl"
                style={{
                  background:
                    "conic-gradient(from 140deg at 50% 50%, #f4d35e, #ff7f50, #d8b4fe, #7dd3fc, #f4d35e)",
                }}
              >
                AK
              </div>
              <div className="leading-tight">
                <div className="font-display text-2xl text-white md:text-3xl">
                  Adwait Keshari
                </div>
                <div className="mt-1 text-sm text-white/55">IIT Madras · Bhopal, IN</div>
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-[var(--color-success)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                  available for work
                </div>
              </div>
            </div>

            <dl className="divide-y divide-white/8 border-y border-white/8">
              {[
                ["Currently", "IIT Madras, BS Data Science"],
                ["Leading", "Bhopal DAO · AarambhLabs"],
                ["Shipping", "Melodex · StellaRay · Tempo Books"],
                ["Writing in", "TypeScript · Rust · Solidity · Python"],
                ["Studying", "ZK · Applied crypto · Rust systems"],
                ["Based in", "Bhopal → the world"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[100px_1fr] gap-4 py-3.5 text-sm md:grid-cols-[140px_1fr]"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {k}
                  </dt>
                  <dd className="text-white/85">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="hidden md:block">
              <CircleBadge size={120} className="text-white/85" />
            </div>
          </div>

          {/* right — narrative */}
          <div className="space-y-7 text-[17px] leading-[1.75] text-white/75 md:text-[18px]">
            <p className="text-balance">
              <span className="mr-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                §1
              </span>
              I'm a full-stack engineer at{" "}
              <span className="text-white">IIT Madras</span>, currently
              community-leading <span className="text-white">Bhopal DAO</span>{" "}
              and <span className="text-white">AarambhLabs</span>. The thread
              across my work is translating cryptography, AI, and distributed
              systems into product surfaces where the primitive is invisible —
              and the only thing the user notices is that it finally just
              works.
            </p>
            <p>
              <span className="mr-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                §2
              </span>
              In 2025 I shipped three production-grade products back-to-back.{" "}
              <span className="text-white">Melodex</span> put creative IP
              on-chain via Story Protocol.{" "}
              <span className="text-white">Tempo Books</span> turned stablecoin
              payroll into real accounting software.{" "}
              <span className="text-white">StellaRay</span> replaced seed
              phrases with a single Google sign-in using zero-knowledge proofs.
              I'm the person on the team who will write the ZK circuit — and
              then argue about why the button copy matters more.
            </p>
            <p>
              <span className="mr-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                §3
              </span>
              Off the keyboard I organize ETH Builders Day Bhopal, run
              workshops for Sahyog Club at IITM, and spend too much time making
              tools that help other engineers stop forgetting what their AI
              agents did last week.
            </p>
          </div>
        </div>

        {/* footer rail */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>{profile.email}</span>
          <span>— end of §3 —</span>
        </div>
      </div>
    </section>
  );
}
