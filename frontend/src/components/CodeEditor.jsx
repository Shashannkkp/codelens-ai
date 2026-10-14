import EditorToolbar from "./EditorToolbar";

import { Code2 } from "lucide-react";

function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  loading,
  reviewCode,
  clearCode,
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
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-slate-950 rounded">
        
        
      {/* Editor toolbar */}
      <EditorToolbar
  language={language}
  setLanguage={setLanguage}
  loading={loading}
  code={code}
  reviewCode={reviewCode}
  clearCode={clearCode}
/>

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