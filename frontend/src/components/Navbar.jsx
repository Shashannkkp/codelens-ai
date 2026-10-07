import { Code2 } from "lucide-react";

function Navbar() {
  return (
    <header className="shrink-0 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

              <Code2 size={24} />

            </div>

            <div>

              <h1 className="text-lg font-bold tracking-tight">
                CodeLens AI
              </h1>

              <p className="hidden sm:block text-[11px] text-slate-500">
                Intelligent Code Review
              </p>

            </div>

          </div>


          {/* Engine Status */}

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-slate-800 bg-slate-900/70">

            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />

            </span>

            <span className="text-xs text-slate-400">
              Analysis Engine Ready
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;