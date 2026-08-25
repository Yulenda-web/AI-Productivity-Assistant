import logo from "@/assets/booster-hub-logo.png.asset.json";
import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/** The uploaded Booster Hub logo. Never re-create or restyle the mark itself. */
export function BrandLogo({ size = 36, className, showWordmark = false, wordmarkClassName }: Props) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <img
        src={logo.url}
        alt="Booster Hub CRM logo"
        width={size}
        height={size}
        className="shrink-0 rounded-lg object-cover"
        style={{ width: size, height: size }}
      />
      {showWordmark ? (
        <span className={cn("min-w-0 leading-tight", wordmarkClassName)}>
          <span className="block truncate text-sm font-extrabold tracking-wide">BOOSTER HUB</span>
          <span className="block truncate text-[10px] uppercase tracking-[0.14em] opacity-70">CRM</span>
        </span>
      ) : null}
    </span>
  );
}
