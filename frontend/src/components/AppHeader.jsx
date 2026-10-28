import { Code2 } from "lucide-react";

export default function AppHeader({ review, loading }) {
  const issues = review?.issues ?? [];

  const hasCriticalOrHigh = issues.some(
    (issue) =>
      ["CRITICAL", "HIGH"].includes(
        String(issue.severity ?? issue.type ?? "").toUpperCase()
      )
  );

  const hasMedium = issues.some(
    (issue) =>
      String(issue.severity ?? issue.type ?? "").toUpperCase() === "MEDIUM"
  );

  const health = loading
    ? {
        label: "Analyzing code",
        color: "bg-sky-500",
        glow: "shadow-[0_0_8px_#0ea5e9]",
        pulse: "bg-sky-400",
        text: "text-sky-700",
      }
    : !review
      ? {
          label: "Engine ready",
          color: "bg-slate-400",
          glow: "",
          pulse: "bg-slate-400",
          text: "text-slate-600",
        }
      : hasCriticalOrHigh
        ? {
            label: "Critical issues",
            color: "bg-red-500",
            glow: "shadow-[0_0_8px_#ef4444]",
            pulse: "bg-red-400",
            text: "text-red-700",
          }
        : hasMedium
          ? {
              label: "Needs attention",
              color: "bg-amber-500",
              glow: "shadow-[0_0_8px_#f59e0b]",
              pulse: "bg-amber-400",
              text: "text-amber-700",
            }
          : {
              label: "Code health good",
              color: "bg-emerald-500",
              glow: "shadow-[0_0_8px_#10b981]",
              pulse: "bg-emerald-400",
              text: "text-emerald-700",
            };

  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-sky-200/70 bg-gradient-to-r from-sky-100/90 via-sky-100/80 to-sky-200/90 px-4 text-slate-900 shadow-lg shadow-sky-200/30 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-[#06291d] shadow-lg shadow-emerald-500/25">
          <Code2 size={19} strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              CodeLens <span className="text-emerald-600">AI</span>
            </h1>

            <span className="hidden rounded border border-sky-200/80 bg-white/40 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 sm:inline">
              WORKSPACE
            </span>
          </div>

          <p className="text-[10px] text-slate-600">
            Intelligent code review
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div
          className={`hidden items-center gap-1.5 text-[11px] sm:flex ${health.text}`}
          role="status"
          aria-live="polite"
        >
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span
              className={`absolute h-4 w-4 animate-ping rounded-full opacity-60 ${health.pulse}`}
            />
            <span
              className={`relative h-2.5 w-2.5 rounded-full ${health.color} ${health.glow}`}
            />
          </span>

          <span>{health.label}</span>
        </div>

        <div className="h-4 w-px bg-sky-300/70" />

        <span className="text-[10px] text-slate-600">v1.0</span>
      </div>
    </header>
  );
}