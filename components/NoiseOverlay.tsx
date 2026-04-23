export default function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] noise"
      style={{ opacity: 0.05 }}
    />
  );
}
