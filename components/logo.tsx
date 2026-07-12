import { cn } from "@/lib/utils";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      {/* Shared stem + foot: the "L" (steel) */}
      <path
        d="M10 8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V8Z"
        className="fill-foreground"
      />
      {/* Cantilevered arm: the "T" (amber) */}
      <path
        d="M3 3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3Z"
        className="fill-primary"
      />
      {/* Rivet: joint between arm and stem */}
      <circle cx="12" cy="4" r="1" className="fill-primary-foreground" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tighter",
          textClassName
        )}
      >
        Tender<span className="text-primary">Labs</span>
      </span>
    </span>
  );
}

export { LogoMark };
