import logo from "@/assets/senviok-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
};

export function Logo({ className, showWordmark = true, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="Senviok"
        className={cn(sizes[size], "w-auto object-contain")}
        style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.35))" }}
      />
      {showWordmark && (
        <span className="sr-only">Senviok</span>
      )}
    </div>
  );
}
