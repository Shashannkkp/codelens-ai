
import { ShieldCheck } from "lucide-react";

export default function ReviewResultsHeader() {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <ShieldCheck
          size={14}
          className="text-emerald-400"
        />

        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
          Review results
        </span>
      </div>

      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[9px] font-medium text-emerald-400">
        AI ANALYSIS
      </span>
    </div>
  );
}
