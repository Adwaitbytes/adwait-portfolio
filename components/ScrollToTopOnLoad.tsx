"use client";
import { useEffect } from "react";

/**
 * Defeats browser scroll restoration on fresh loads.
 *
 * If the URL has no hash, we force scroll-to-top so opening the site
 * always starts at the Hero — even when the browser is tempted to
 * restore the prior scroll position, or when an earlier anchor
 * click left behind a stale `#section` in history.
 *
 * If the URL DOES have a hash, we respect it (user clicked a deep
 * link and expects to land in that scene).
 */
export default function ScrollToTopOnLoad() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable the browser's auto-restore behavior.
    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch {}

    if (!window.location.hash) {
      // jump to top immediately, then again after paint to beat any
      // late layout-shift caused by shader mounts / font loads.
      window.scrollTo(0, 0);
      requestAnimationFrame(() => window.scrollTo(0, 0));
      setTimeout(() => window.scrollTo(0, 0), 60);
    }
  }, []);

  return null;
}
