import { cn } from "./Card";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Colour at the centre of the light. */
  color?: string;
  /** Radius of the light in pixels. */
  size?: number;
}

/**
 * Soft light that follows the mouse (after Magic UI's MagicCard).
 * The position lives in CSS variables, so moving the mouse never re-renders React.
 * Touch and pen input are ignored: there is no hover to follow.
 */
export function Spotlight({ children, className, color = "rgba(255, 248, 239, 0.28)", size = 260 }: Props) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={cn("group/spot relative", className)}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 70%)` }}
      />
    </div>
  );
}
