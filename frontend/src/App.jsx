
import { useState } from "react";
import {
  Github,
  FolderGit2,
  FileCode2,
  Download,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Bug,
  Zap,
} from "lucide-react";

import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import ReviewResults from "./components/ReviewResults";

const DEFAULT_CODE = `public class UserService {

    public void processUsers(List<String> users) {

        for (int i = 0; i < users.size(); i++) {

            System.out.println(users.get(i));

        }
    }
}`;

const API_URL = "http://localhost:8080";

function getLanguageFromPath(path) {
  const extension = path.split(".").pop().toLowerCase();

  if (extension === "java") return "Java";
  if (["js", "jsx", "ts", "tsx"].includes(extension)) {
    return "JavaScript";
  }
  if (extension === "py") return "Python";

  return null;
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("Java");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  // GitHub import state
  const [repoUrl, setRepoUrl] = useState("");
  const [repository, setRepository] = useState(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [repoLoading, setRepoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [githubMessage, setGithubMessage] = useState("");

  const loadRepository = async () => {
    if (!repoUrl.trim()) {
      setGithubError("Enter a public GitHub repository URL.");
      setGithubMessage("");
      return;
    }

    setRepoLoading(true);
    setGithubError("");
    setGithubMessage("");
    setRepository(null);
    setSelectedPath("");

    try {
      const response = await fetch(`${API_URL}/api/github/repository`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load repository.");
      }

      // Only show languages supported by the current editor.
      const supportedFiles = (data.files || []).filter((file) =>
        getLanguageFromPath(file.path)
      );

      const repo = {
        ...data,
        files: supportedFiles,
      };

      setRepository(repo);

      if (supportedFiles.length > 0) {
        setSelectedPath(supportedFiles[0].path);
        setGithubMessage(
          `Loaded ${repo.repository}. Select a file to import.`
        );
      } else {
        setGithubMessage(
          "Repository loaded, but no Java, JavaScript, TypeScript, or Python files were found."
        );
      }
    } catch (error) {
      console.error("GitHub repository error:", error);
      setGithubError(error.message || "Could not connect to GitHub.");
    } finally {
      setRepoLoading(false);
    }
  };

  const importFile = async () => {
    if (!repository || !selectedPath) {
      setGithubError("Load a repository and select a source file first.");
      return;
    }

    setFileLoading(true);
    setGithubError("");
    setGithubMessage("");

    try {
      const response = await fetch(`${API_URL}/api/github/file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          path: selectedPath,
          branch: repository.branch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to import this file.");
      }

      const detectedLanguage = getLanguageFromPath(data.path);

      if (!detectedLanguage) {
        throw new Error("This file's language is not supported by the editor.");
      }

      setCode(data.code);
      setLanguage(detectedLanguage);
      setReview(null);
      setGithubMessage(`Imported ${data.path} into the code editor.`);
    } catch (error) {
      console.error("GitHub file import error:", error);
      setGithubError(error.message || "Could not import the selected file.");
    } finally {
      setFileLoading(false);
    }
  };

  const reviewCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }

    setLoading(true);
    setReview(null);

    try {
      const response = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to review code.");
      }

      setReview(data);
    } catch (error) {
      console.error("Code review error:", error);
      alert(
        error.message ||
          "Unable to connect to the backend. Make sure CodeLens AI is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setReview(null);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setLanguage("Java");
    setReview(null);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-white">
      <Navbar />

      <main className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 py-3 sm:px-6">
          {/* Page heading */}
          <section className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Sparkles size={15} />
                Code Review Workspace
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Review source code locally or import it from a public GitHub repository.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FeatureBadge icon={<ShieldCheck size={14} />} text="Security" />
              <FeatureBadge icon={<Bug size={14} />} text="Bug Detection" />
              <FeatureBadge icon={<Zap size={14} />} text="Performance" />
            </div>
          </section>

          {/* GitHub import panel */}
          <section className="mb-3 shrink-0 rounded-lg border border-slate-800 bg-slate-900 p-3">
            <div className="mb-3 flex items-center gap-2">
              <Github size={18} className="text-slate-200" />
              <h2 className="text-sm font-semibold text-slate-100">
                Import from GitHub
              </h2>
              <span className="rounded border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
                PUBLIC REPOS
              </span>
            </div>

            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                loadRepository();
              }}
            >
              <input
                type="url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/owner/repository"
                aria-label="GitHub repository URL"
                className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-slate-500"
              />

              <button
                type="submit"
                disabled={repoLoading}
                className="flex items-center justify-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {repoLoading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <FolderGit2 size={16} />
                )}
                {repoLoading ? "Loading..." : "Load Repository"}
              </button>
            </form>

            {repository && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-slate-400">
                  <FolderGit2 size={15} className="shrink-0" />
                  <span className="truncate text-slate-200">
                    {repository.repository}
                  </span>
                  <span className="shrink-0 rounded border border-slate-700 px-2 py-1">
                    {repository.branch}
                  </span>
                  <span className="shrink-0">
                    {repository.files.length} files
                  </span>
                </div>

                {repository.files.length > 0 && (
                  <div className="flex min-w-0 gap-2">
                    <select
                      value={selectedPath}
                      onChange={(event) => setSelectedPath(event.target.value)}
                      aria-label="Select repository file"
                      className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-slate-500 sm:max-w-[360px]"
                    >
                      {repository.files.map((file) => (
                        <option key={file.path} value={file.path}>
                          {file.path}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={importFile}
                      disabled={fileLoading || !selectedPath}
                      className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {fileLoading ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} />
                      )}
                      {fileLoading ? "Importing..." : "Import File"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {githubError && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 text-xs text-red-400"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{githubError}</span>
              </div>
            )}

            {githubMessage && !githubError && (
              <p
                role="status"
                className="mt-2 flex items-center gap-2 text-xs text-emerald-400"
              >
                <FileCode2 size={14} />
                {githubMessage}
              </p>
            )}
          </section>

          {/* Existing editor and review results */}
          <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden xl:grid-cols-2">
            <div className="h-full min-h-0 overflow-hidden">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                clearCode={clearCode}
                resetCode={resetCode}
                reviewCode={reviewCode}
                loading={loading}
              />
            </div>

            <div className="h-full min-h-0 overflow-hidden">
              <ReviewResults review={review} loading={loading} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function FeatureBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
      {icon}
      {text}
    </div>
  );
}

export default App;
