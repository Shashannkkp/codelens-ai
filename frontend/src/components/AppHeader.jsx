
import { Code2 } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#17191c] px-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-[#06291d] shadow-lg shadow-emerald-950/30">
          <Code2 size={19} strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              CodeLens <span className="text-emerald-400">AI</span>
            </h1>

            <span className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 sm:inline">
              WORKSPACE
            </span>
          </div>

          <p className="text-[10px] text-slate-500">
            Intelligent code review
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_#34d399]" />
          Backend ready
        </div>

        <div className="h-4 w-px bg-white/10" />

        <span className="text-[10px] text-slate-500">v1.0</span>
      </div>
    </header>
  );
}
