import { useEffect, useRef } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import type { Dish } from "../types/food";
import { useT } from "../i18n";

const SEGMENT_COLOURS = [
  // Every pair passes WCAG AA (4.5:1) for the small bold labels.
  { fill: "#F97336", text: "#24211F" },
  { fill: "#FFF8EF", text: "#24211F" },
  { fill: "#EF5350", text: "#24211F" },
  { fill: "#FFE7CF", text: "#24211F" },
  { fill: "#4F7A3B", text: "#FFFFFF" },
  { fill: "#FFF8EF", text: "#24211F" },
  { fill: "#E85D24", text: "#24211F" },
  { fill: "#FFE7CF", text: "#24211F" },
];

const SIZE = 400;
const R = 190;
const C = SIZE / 2;

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)];
}

function wedge(start: number, end: number) {
  const [x1, y1] = polar(start, R);
  const [x2, y2] = polar(end, R);
  const large = end - start > 180 ? 1 : 0;
  return `M ${C} ${C} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

function shortName(name: string) {
  return name.length > 13 ? `${name.slice(0, 12)}…` : name;
}

interface Props {
  dishes: Dish[];
  /** Index in `dishes` to land on. Changing `spinKey` starts a spin. */
  targetIndex: number;
  spinKey: number;
  onDone: () => void;
  onCenterClick?: () => void;
  disabled?: boolean;
}

export function SpinWheel({ dishes, targetIndex, spinKey, onDone, onCenterClick, disabled }: Props) {
  const [scope, animate] = useAnimate<SVGGElement>();
  const rotation = useRef(0);
  const reduce = useReducedMotion();
  const t = useT();
  const n = Math.max(dishes.length, 1);
  const seg = 360 / n;

  useEffect(() => {
    if (spinKey === 0 || dishes.length === 0) return;
    const centre = (targetIndex + 0.5) * seg;
    const current = rotation.current;
    // Land the target segment's centre under the pointer at the top, with a little jitter.
    const jitter = (Math.random() - 0.5) * seg * 0.5;
    const restAngle = ((-centre + jitter) % 360 + 360) % 360;
    const base = current - (current % 360);
    const turns = reduce ? 0 : 6;
    let next = base + turns * 360 + restAngle;
    if (next <= current) next += 360;
    rotation.current = next;

    const controls = animate(
      scope.current,
      { rotate: next },
      reduce ? { duration: 0.2 } : { duration: 4.2, ease: [0.11, 0.72, 0.12, 1] }
    );
    controls.then(onDone);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* pointer */}
      <svg viewBox="0 0 40 44" className="absolute left-1/2 top-[-6px] z-10 w-10 -translate-x-1/2 drop-shadow" aria-hidden="true">
        <path d="M20 42 L4 8 Q20 -2 36 8 Z" fill="#24211F" />
        <circle cx="20" cy="12" r="4" fill="#FFF8EF" />
      </svg>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" role="img" aria-label={t.picker.wheelLabel}>
        <circle cx={C} cy={C} r={R + 8} fill="#24211F" />
        <g ref={scope} style={{ transformOrigin: "50% 50%", transformBox: "view-box" }}>
          {dishes.length <= 1 ? (
            <circle cx={C} cy={C} r={R} fill={SEGMENT_COLOURS[0].fill} />
          ) : (
            dishes.map((d, i) => {
              const colour = SEGMENT_COLOURS[i % SEGMENT_COLOURS.length];
              return <path key={d.id} d={wedge(i * seg, (i + 1) * seg)} fill={colour.fill} stroke="#24211F" strokeWidth="1.5" />;
            })
          )}
          {dishes.map((d, i) => {
            const colour = SEGMENT_COLOURS[i % SEGMENT_COLOURS.length];
            const mid = (i + 0.5) * seg;
            return (
              <g key={`label-${d.id}`} transform={`rotate(${mid} ${C} ${C})`}>
                <text
                  x={C}
                  y={C - R + 32}
                  textAnchor="middle"
                  fontSize="22"
                  aria-hidden="true"
                >
                  {d.emoji}
                </text>
                <text
                  x={C}
                  y={C - R + 46}
                  textAnchor={mid > 0 && mid < 180 ? "end" : "start"}
                  dominantBaseline="middle"
                  fontSize={12.5}
                  fontWeight={700}
                  fill={colour.text}
                  transform={`rotate(${mid > 0 && mid < 180 ? -90 : 90} ${C} ${C - R + 46})`}
                  fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
                >
                  {shortName(d.name)}
                </text>
              </g>
            );
          })}
          {/* rim studs */}
          {Array.from({ length: 24 }).map((_, i) => {
            const [x, y] = polar(i * 15, R + 4);
            return <circle key={i} cx={x} cy={y} r="2.2" fill="#FFF8EF" opacity="0.85" />;
          })}
        </g>
      </svg>

      <motion.button
        type="button"
        onClick={onCenterClick}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        className="absolute left-1/2 top-1/2 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-ink bg-white text-sm font-extrabold text-ink shadow-lift disabled:cursor-wait sm:text-base"
      >
        {disabled ? "…" : t.picker.center}
      </motion.button>
    </div>
  );
}
