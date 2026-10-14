
import { Code2 } from "lucide-react";

export default function EditorFileTab({ language }) {
  const languageExtensions = {
    Java: "CodeLens.java",
    JavaScript: "CodeLens.js",
    Python: "CodeLens.py",
  };

  return (
    <div className="shrink-0 h-9 px-4 flex items-center bg-slate-950">
      <div className="h-full flex items-center gap-2 px-2 text-slate-300">
        <Code2 size={13} className="text-slate-500" />

        <span className="text-xs font-mono">
          {languageExtensions[language] || "CodeLens.txt"}
        </span>
      </div>
    </div>
  );
}
