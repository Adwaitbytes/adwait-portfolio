"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * 3D perspective tilt wrapper.
 *
 * The child sits inside a motion.div with a persistent perspective.
 * On mousemove within the card's bounds, we normalize the cursor
 * position (-1..1) on each axis and drive rotateX / rotateY via
 * springs. Pointer-leave springs back to rest. Additive translateZ
 * pops the card forward slightly on hover for real depth.
 */
export default function TiltCard({
  children,
  max = 7, // degrees
  className = "",
  ...rest
}: React.ComponentProps<typeof motion.div> & {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0); // -1..1
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const rx = useSpring(useTransform(py, [-1, 1], [max, -max]), { stiffness: 220, damping: 22, mass: 0.6 });
  const ry = useSpring(useTransform(px, [-1, 1], [-max, max]), { stiffness: 220, damping: 22, mass: 0.6 });
  const tz = useSpring(useTransform(hover, [0, 1], [0, 18]), { stiffness: 260, damping: 26 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    px.set(nx);
    py.set(ny);
  };
  const onEnter = () => hover.set(1);
  const onLeave = () => {
    hover.set(0);
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        perspective: 1100,
        transformStyle: "preserve-3d",
        ...(rest.style ?? {}),
      }}
      className={className}
      {...rest}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, translateZ: tz, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
