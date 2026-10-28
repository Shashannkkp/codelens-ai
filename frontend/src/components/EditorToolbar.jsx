import { Play, Trash2 } from "lucide-react";

export default function EditorToolbar({
  language,
  setLanguage,
  loading,
  code,
  reviewCode,
  clearCode,
}) {
  return (
    <div className="shrink-0 flex h-12 items-center justify-between gap-3 border-b border-sky-200 bg-gradient-to-r from-sky-200/80 via-sky-100 to-sky-200/60 px-4">
      {/* Language selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="code-language"
          className="text-xs font-medium text-slate-700"
        >
          Code
        </label>

        <select
          id="code-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          disabled={loading}
          className="rounded-lg border border-sky-200 bg-white/70 px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition hover:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
      </div>

      {/* Editor actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clearCode}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white/50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={14} className="text-sky-600" />
          Clear
        </button>

        <button
          type="button"
          onClick={reviewCode}
          disabled={loading || !code.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400 bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-300/40 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play size={13} fill="currentColor" />
          {loading ? "Analyzing..." : "Review Code"}
        </button>
      </div>
    </div>
  );
}