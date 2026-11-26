import { Link } from "react-router";
import { useT } from "../i18n";

export function Logo({ className = "" }: { className?: string }) {
  const t = useT();
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-extrabold text-ink ${className}`} aria-label={t.nav.homeLink}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#F97336" />
        <circle cx="16" cy="17" r="8.5" fill="#FFF8EF" />
        <path d="M16 8.5v8.5l6 3.5" stroke="#24211F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <span className="text-lg tracking-tight">
        Makan Mana<span className="text-orange">?</span>
      </span>
    </Link>
  );
}
