import type { LucideIcon } from "lucide-react";
import { formatDuration } from "../../utils/format";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
      <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      <div className="text-3xl font-bold text-white tracking-tight">
        {typeof value === "number" ? formatDuration(value) : value}
      </div>
      {subtitle && (
        <div className="text-xs text-neutral-400 mt-1 font-mono">
          {subtitle}
        </div>
      )}
    </div>
  );
}
