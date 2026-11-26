/**
 * Shared card primitives (shadcn/ui pattern: plain markup we own, styled with our tokens).
 * Every card variant builds on these so borders, radius and spacing stay consistent.
 */

type ClassValue = string | false | null | undefined;

/** Joins class names, skipping empty values. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={cn("relative overflow-hidden rounded-card border border-line bg-white", className)} {...props} />;
}

export function CardBody({ className, ...props }: DivProps) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("flex flex-wrap items-center gap-2 px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

/** Small pill shown on cards, e.g. "Pedas". */
export function CardBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", className)} {...props} />;
}
