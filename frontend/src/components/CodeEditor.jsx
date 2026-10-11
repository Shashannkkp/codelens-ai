import {
  Code2,
  Play,
  Trash2,
} from "lucide-react";

function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  loading,
  reviewCode,
  clearCode,
  resetCode,
}) {
  const lines = code.split("\n");
  const lineCount = lines.length;

  const languageExtensions = {
    Java: "CodeLens.java",
    JavaScript: "CodeLens.js",
    Python: "CodeLens.py",
  };

  const lineHeight = 24;

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden  bg-slate-950 rounded">

      {/* Editor toolbar */}
      <div className="shrink-0 h-12 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900">

           <div className="flex items-center gap-2">
          <label
            htmlFor="code-language"
            className="text-xs text-slate-500"
          >
            Code
          </label>

          <select
            id="code-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            disabled={loading}
            className="bg-slate-950 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-slate-500"
          >
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
        </div>
        {/* Actions */}
      <div className="shrink-0 px-3 py-3 flex items-center justify-between gap-3 border-t border-slate-800 bg-slate-900">

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearCode}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs text-white hover:text-red-600
             rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            Clear
          </button>

        </div>

        <button
          type="button"
          onClick={reviewCode}
          disabled={loading || !code.trim()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-green-400 text-white rounded text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={13} fill="currentColor" />

          {loading ? "Analyzing..." : "Review Code"}
        </button>
      </div>

     
      </div>

      {/* File tab */}
      <div className="shrink-0 h-9 px-4 flex items-center   bg-slate-950">
        <div className="h-full flex items-center gap-2 px-2  text-slate-300">
          <Code2 size={13} className="text-slate-500" />

          <span className="text-xs font-mono">
            {languageExtensions[language] || "CodeLens.txt"}
          </span>
        </div>
      </div>

      {/* Code editing area */}
      <div className="flex-1 min-h-0 flex overflow-hidden bg-slate-950">

        {/* Line numbers */}
        <div
          className="shrink-0 w-12 overflow-hidden pt-4 pr-3 text-right font-mono text-xs text-slate-600 select-none"
          aria-hidden="true"
        >
          {lines.map((_, index) => (
            <div
              key={index}
              style={{ height: `${lineHeight}px` }}
              className="leading-6"
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Text editor */}
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault();

              const start = event.target.selectionStart;
              const end = event.target.selectionEnd;
              const updatedCode =
                code.substring(0, start) +
                "    " +
                code.substring(end);

              setCode(updatedCode);

              requestAnimationFrame(() => {
                event.target.selectionStart = start + 4;
                event.target.selectionEnd = start + 4;
              });
            }
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Source code editor"
          placeholder="// Paste or write your code here"
          className="flex-1 min-w-0 h-full resize-none overflow-auto bg-transparent px-4 pt-4 pb-6 font-mono text-[13px] leading-6 text-slate-300 placeholder:text-slate-700 outline-none"
        />
      </div>

      {/* Editor status bar */}
      <div className="shrink-0 h-8 px-3 flex items-center justify-between gap-3  bg-slate-900 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>{language}</span>
          <span>Ln {lineCount}</span>
          <span>UTF-8</span>
        </div>

        <span className="truncate">
          {code.length} characters
        </span>
      </div>

      
    </div>
  );
}

export default CodeEditor;