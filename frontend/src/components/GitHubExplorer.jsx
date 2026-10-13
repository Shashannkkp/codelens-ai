
import { useMemo } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { buildFileTree } from "../utils/fileTree";

function FileTreeNode({
  node,
  depth = 0,
  expandedFolders,
  toggleFolder,
  selectedPath,
  onSelectFile,
}) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;

  if (node.isFile) {
    return (
      <button
        type="button"
        onClick={() => onSelectFile(node)}
        title={node.path}
        className={`flex w-full min-w-0 items-center gap-2 rounded-md py-1.5 pr-2 text-left text-xs transition ${
          isSelected
            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/25"
            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
        }`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <FileCode2
          size={14}
          className={`shrink-0 ${
            isSelected ? "text-emerald-400" : "text-slate-500"
          }`}
        />

        <span className="min-w-0 truncate">{node.name}</span>

        {isSelected && (
          <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
        )}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleFolder(node.path)}
        title={node.path}
        className="flex w-full min-w-0 items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {isExpanded ? (
          <ChevronDown size={13} className="shrink-0 text-slate-500" />
        ) : (
          <ChevronRight size={13} className="shrink-0 text-slate-500" />
        )}

        {isExpanded ? (
          <FolderOpen size={14} className="shrink-0 text-emerald-400" />
        ) : (
          <Folder size={14} className="shrink-0 text-emerald-500/70" />
        )}

        <span className="min-w-0 truncate">{node.name}</span>
      </button>

      {isExpanded &&
        node.children.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        ))}
    </div>
  );
}

export default function GitHubExplorer({
  repoUrl,
  setRepoUrl,
  repository,
  repoLoading,
  loadRepository,
  expandedFolders,
  toggleFolder,
  selectedPath,
  onSelectFile,
  importFile,
  fileLoading,
  onClearRepository,
  githubError,
  githubMessage,
  dismissMessage,
}) {
  const fileTree = useMemo(
    () => buildFileTree(repository?.files ?? []),
    [repository]
  );

  const selectedFile = useMemo(
    () => repository?.files?.find((file) => file.path === selectedPath),
    [repository, selectedPath]
  );

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-b border-white/[0.08] bg-[#17191c] xl:border-b-0 xl:border-r">
      {/* Explorer header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderOpen size={14} className="text-emerald-400" />
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
            Explorer
          </span>
        </div>

        <button
          type="button"
          title="Clear repository"
          onClick={onClearRepository}
          className="rounded p-1 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          <X size={13} />
        </button>
      </div>

      {/* Repository URL form */}
      <div className="shrink-0 space-y-2.5 border-b border-white/[0.07] p-3">
        <label
          htmlFor="github-url"
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
        >
          GitHub repository
        </label>

        <form onSubmit={loadRepository} className="space-y-2">
          <input
            id="github-url"
            type="url"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full rounded-md border border-white/10 bg-[#101214] px-2.5 py-2 text-xs text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
          />

          <button
            type="submit"
            disabled={repoLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-[#05291d] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {repoLoading ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Upload size={13} />
            )}

            {repoLoading ? "Loading repository..." : "Load repository"}
          </button>
        </form>
      </div>

      {/* File tree */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-9 shrink-0 items-center justify-between px-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Files
          </span>

          {repository && (
            <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] tabular-nums text-slate-500">
              {repository.files.length}
            </span>
          )}
        </div>

        {!repository ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02]">
              <Folder size={19} className="text-slate-500" />
            </div>

            <p className="text-xs font-medium text-slate-300">
              No repository loaded
            </p>

            <p className="mt-1.5 max-w-44 text-[11px] leading-5 text-slate-500">
              Enter a public GitHub URL to browse source files.
            </p>
          </div>
        ) : repository.files.length === 0 ? (
          <div className="px-3 py-4 text-xs leading-5 text-slate-500">
            No supported source files found in this repository.
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2 [scrollbar-color:#3f4844_transparent] [scrollbar-width:thin]">
            <div className="mb-1 truncate px-2 py-1 text-[11px] font-semibold text-slate-300">
              {repository.repository || "Repository"}
            </div>

            {fileTree.map((node) => (
              <FileTreeNode
                key={node.path}
                node={node}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected file and import button */}
      {selectedFile && (
        <div className="shrink-0 border-t border-white/[0.08] p-3">
          <div className="mb-2 truncate text-[10px] text-slate-500">
            Selected:{" "}
            <span className="text-slate-300">{selectedFile.name}</span>
          </div>

          <button
            type="button"
            onClick={() => importFile(selectedFile)}
            disabled={fileLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15 disabled:opacity-50"
          >
            {fileLoading ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <FileCode2 size={13} />
            )}

            {fileLoading ? "Importing..." : "Import file to editor"}
          </button>
        </div>
      )}

      {/* Keep repository messages visible in the Explorer */}
      {(githubError || githubMessage) && (
        <div className="shrink-0 border-t border-white/[0.08] p-3">
          <div className="flex items-start gap-2 rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-2">
            {githubError ? (
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-rose-400"
              />
            ) : (
              <Check
                size={14}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
            )}

            <p
              className={`min-w-0 flex-1 break-words text-[11px] leading-5 ${
                githubError ? "text-rose-300" : "text-slate-400"
              }`}
            >
              {githubError || githubMessage}
            </p>

            <button
              type="button"
              onClick={dismissMessage}
              title="Dismiss message"
              className="shrink-0 text-slate-600 hover:text-slate-300"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
