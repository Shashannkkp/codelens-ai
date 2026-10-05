import {
  Code2,
  Play,
  ChevronRight,
  RotateCcw,
  Trash2,
  FileCode2,
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
  const lines = code ? code.split("\n").length : 1;
  const characters = code.length;

  const languageConfig = {
    Java: {
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      extension: ".java",
    },

    JavaScript: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      extension: ".js",
    },

    Python: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      extension: ".py",
    },
  };

  const currentLanguage =
    languageConfig[language] || languageConfig.Java;

  return (
    <div className="h-full w-full min-h-0 bg-transparent border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/20 flex flex-col">

      {/* =========================================
          Editor Header
      ========================================= */}
      <div className="shrink-0 border-b border-slate-800 bg-transparent">

        <div className="px-4 py-3 flex items-center justify-between gap-3">

          {/* Left Side */}
          <div className="flex items-center gap-3 min-w-0">

            {/* Icon */}
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <FileCode2
                size={18}
                className="text-blue-400"
              />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">

                <h3 className="text-sm font-semibold text-white">
                  Code Editor
                </h3>

              </div>

              <p className="text-[11px] text-slate-600 mt-0.5">
                Write or paste your code
              </p>
            </div>

          </div>

          {/* Language Selector */}
          <div className="relative shrink-0">

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`
                appearance-none
                ${currentLanguage.bg}
                ${currentLanguage.border}
                ${currentLanguage.color}
                border
                rounded-lg
                pl-3
                pr-8
                py-2
                text-xs
                font-medium
                outline-none
                cursor-pointer
                transition
                hover:bg-opacity-20
                focus:ring-2
                focus:ring-blue-500/20
              `}
            >
              <option
                value="Java"
                className="bg-slate-900 text-white"
              >
                Java
              </option>

              <option
                value="JavaScript"
                className="bg-slate-900 text-white"
              >
                JavaScript
              </option>

              <option
                value="Python"
                className="bg-slate-900 text-white"
              >
                Python
              </option>
            </select>

            <ChevronRight
              size={13}
              className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-slate-500"
            />

          </div>

        </div>

        {/* File Tab */}
        <div className="px-4 flex items-end">

          <div className="flex items-center gap-2 px-3 py-2 border border-b-0 border-slate-800 rounded-t-lg bg-slate-950/70">

            <Code2
              size={13}
              className={currentLanguage.color}
            />

            <span className="text-xs text-slate-400 font-mono">
              CodeLens{currentLanguage.extension}
            </span>

          </div>

        </div>

      </div>


      {/* =========================================
          Editor Area
      ========================================= */}
      <div className="flex-1 min-h-0 flex bg-slate-950">

        {/* Line Numbers */}
        <div className="shrink-0 w-12 border-r border-slate-800 bg-slate-950/80 overflow-hidden select-none">

          <div className="py-4 text-right pr-3 text-[12px] leading-6 font-mono text-slate-700">

            {Array.from(
              { length: lines },
              (_, index) => (
                <div key={index}>
                  {index + 1}
                </div>
              )
            )}

          </div>

        </div>


        {/* Code Input */}
        <div className="flex-1 min-w-0 min-h-0 relative">

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="// Start writing your code here..."
            className="
              w-full
              h-full
              min-h-0
              resize-none
              bg-transparent
              text-slate-300
              caret-blue-400
              font-mono
              text-[13px]
              leading-6
              p-4
              outline-none
              overflow-auto
              placeholder:text-slate-700
              selection:bg-blue-500/20
              focus:bg-slate-950/50
            "
          />

        </div>

      </div>


      {/* =========================================
          Editor Footer
      ========================================= */}
      <div className=" bg-transparent shrink-0 border-t border-slate-900">

        {/* Statistics */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-slate-900">

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600">
                Lines
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                {lines}
              </span>
            </div>

            <div className="w-px h-3 bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600">
                Characters
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                {characters}
              </span>
            </div>

          </div>

          <div className="flex items-center gap-1.5">

            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

            <span className="text-[10px] text-slate-600">
              Ready
            </span>

          </div>

        </div>


        {/* Action Buttons */}
        <div className="p-3 flex items-center justify-between gap-3">

          {/* Secondary Actions */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={clearCode}
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                border
                border-slate-800
                bg-slate-950/60
                text-slate-500
                text-xs
                transition
                hover:text-red-400
                hover:border-red-500/20
                hover:bg-red-500/5
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">
                Clear
              </span>
            </button>

            <button
              type="button"
              onClick={resetCode}
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                border
                border-slate-800
                bg-slate-950/60
                text-slate-500
                text-xs
                transition
                hover:text-slate-300
                hover:border-slate-700
                hover:bg-slate-800/40
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">
                Reset
              </span>
            </button>

          </div>


          {/* Review Button */}
          <button
            type="button"
            onClick={reviewCode}
            disabled={loading || !code.trim()}
            className="
              group
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-lg
              bg-blue-600
              hover:bg-blue-500
              active:bg-blue-700
              text-white
              text-xs
              font-semibold
              shadow-lg
              shadow-blue-600/20
              transition-all
              duration-200
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:bg-blue-600
            "
          >

            {loading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />

                <span>
                  Analyzing...
                </span>
              </>
            ) : (
              <>
                <Play
                  size={12}
                  fill="currentColor"
                  className="transition-transform group-hover:scale-110"
                />

                <span>
                  Review
                </span>

                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default CodeEditor;
