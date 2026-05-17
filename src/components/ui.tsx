import { ReactNode } from "react";
import { cn } from "../lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-zinc-900/50 border border-zinc-800 rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

export function Tag({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "critical" | "warning" | "success" }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-400 border border-transparent",
    critical: "bg-red-900/20 text-red-400 border border-red-900/30",
    warning: "bg-amber-900/20 text-amber-400 border border-amber-900/30",
    success: "bg-lime-400/5 text-lime-400 border border-lime-400/30 larva-glow",
  };
  
  return (
    <span className={cn("px-2 py-0.5 text-[10px] uppercase font-mono rounded mr-2", variants[variant])}>
      {children}
    </span>
  );
}
