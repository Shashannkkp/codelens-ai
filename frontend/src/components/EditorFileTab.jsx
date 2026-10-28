import { Code2 } from "lucide-react";

export default function EditorFileTab({ language }) {
  const languageExtensions = {
    Java: "CodeLens.java",
    JavaScript: "CodeLens.js",
    Python: "CodeLens.py",
  };

  return (
    <div className="shrink-0 flex h-6 items-center border-b border-sky-200 bg-gradient-to-r from-sky-200/80 via-sky-100 to-sky-200/60 px-4">
      <div className="flex h-full items-center gap-2 border-b-2 border-sky-500 px-2 text-slate-800">
        <Code2 size={13} className="text-sky-600" />

        <span className="font-mono text-xs font-medium">
          {languageExtensions[language] || "CodeLens.txt"}
        </span>
      </div>
    </div>
  );
}