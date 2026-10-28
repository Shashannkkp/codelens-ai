import EditorToolbar from "./EditorToolbar";
import EditorFileTab from "./EditorFileTab";

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
  const lineHeight = 24;

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden border border-white/80 bg-gradient-to-br from-sky-100 via-sky-200/70 to-sky-100 shadow-lg shadow-sky-200/40">
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
      <EditorFileTab language={language} />

      {/* Code editing area */}
      <div className="flex-1 min-h-0 flex overflow-hidden bg-sky-100">
        {/* Line numbers */}
        <div
          className="shrink-0 w-12 overflow-hidden border-r border-sky-200 bg-sky-200/50 pt-4 pr-3 text-right font-mono text-xs text-slate-600 select-none"
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
          className="flex-1 min-w-0 h-full resize-none overflow-auto bg-sky-100 px-4 pt-4 pb-6 font-mono text-[13px] leading-6 text-slate-800 placeholder:text-sky-700/60 outline-none selection:bg-sky-300/60 focus:ring-1 focus:ring-inset focus:ring-sky-400/40 [scrollbar-color:transparent_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-corner]:bg-transparent"
        />
      </div>

      {/* Editor status bar */}
      <div className="shrink-0 flex h-8 items-center justify-between gap-3 border-t border-sky-200 bg-sky-200/60 px-3 text-[11px] text-slate-700">
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