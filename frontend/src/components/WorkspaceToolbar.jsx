
import { GitBranch, RefreshCw } from "lucide-react";

export default function WorkspaceToolbar({
  repository,
  selectedPath,
  onReset,
}) {
  return (
    <div className="flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-[#151719] px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2 text-xs">
        <GitBranch
          size={13}
          className="shrink-0 text-emerald-400"
        />

        <span className="truncate text-slate-400">
          {repository?.repository || "Local workspace"}
        </span>

        {repository?.branch && (
          <>
            <span className="text-slate-700">/</span>

            <span className="max-w-24 truncate rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-slate-400">
              {repository.branch}
            </span>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {selectedPath && (
          <span className="hidden max-w-48 truncate text-[10px] text-slate-500 lg:inline">
            {selectedPath}
          </span>
        )}

        <button
          type="button"
          onClick={onReset}
          title="Restore sample code"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1.5 text-[10px] text-slate-400 transition hover:border-white/20 hover:text-white"
        >
          <RefreshCw size={11} />
          Reset
        </button>
      </div>
    </div>
  );
}
