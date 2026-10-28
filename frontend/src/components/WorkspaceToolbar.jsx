
import { GitBranch, RefreshCw } from "lucide-react";

export default function WorkspaceToolbar({
  repository,
  selectedPath,
  onReset,
}) {
  return (
    <div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-stone-300/50 bg-white/40 px-3 text-slate-900 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-2 text-xs">
        <GitBranch
          size={13}
          className="shrink-0 text-sky-700"
        />

        <span className="truncate text-slate-700">
          {repository?.repository || "Local workspace"}
        </span>

        {repository?.branch && (
          <>
            <span className="text-stone-500">/</span>

            <span className="max-w-24 truncate rounded border border-stone-300/60 bg-white/50 px-1.5 py-0.5 text-[10px] text-slate-700">
              {repository.branch}
            </span>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {selectedPath && (
          <span className="hidden max-w-48 truncate text-[10px] text-stone-600 lg:inline">
            {selectedPath}
          </span>
        )}

        <button
          type="button"
          onClick={onReset}
          title="Restore sample code"
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-300/70 bg-white/40 px-2 py-1.5 text-[10px] font-medium text-slate-700 transition hover:border-sky-400/70 hover:bg-sky-100/70 hover:text-slate-900"
        >
          <RefreshCw size={11} />
          Reset
        </button>
      </div>
    </div>
  );
}
