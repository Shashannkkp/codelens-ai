

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
    <div className="shrink-0 h-12 px-4 flex items-center justify-between gap-3 bg-slate-900">
      {/* Language selector */}

      
      <div className="flex items-center gap-2">
        <label
          htmlFor="code-language"
          className="text-xs text-white hover:text-red-500"
        >
          Code
        </label>

        <select
          id="code-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          disabled={loading}
          className="bg-slate-950 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-slate-500 hover:text-green-500"
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
          className="inline-flex items-center gap-2 px-3 py-2 text-xs text-white hover:text-red-600 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} />
          Clear
        </button>

        <button
          type="button"
          onClick={reviewCode}
          disabled={loading || !code.trim()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-blue-400 text-white rounded text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={13} fill="currentColor" />
          {loading ? "Analyzing..." : "Review Code"}
        </button>
      </div>
    </div>
  );
}
