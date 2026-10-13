
import { useState } from "react";
import {
  loadGitHubRepository,
  loadGitHubFile,
} from "../services/githubService";
import { getLanguageFromPath } from "../utils/fileTree";

const SOURCE_EXTENSIONS = /\.(java|js|jsx|ts|tsx|py)$/i;

export default function useGitHubRepository({
  setCode,
  setLanguage,
  setReview,
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [repository, setRepository] = useState(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const [repoLoading, setRepoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [githubMessage, setGithubMessage] = useState("");

  function setError(message) {
    setGithubError(message);
    setGithubMessage("");
  }

  function toggleFolder(path) {
    setExpandedFolders((previous) => {
      const next = new Set(previous);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }

  function expandParentFolders(path) {
    const parts = path.split("/");
    const next = new Set();

    for (let index = 1; index < parts.length; index++) {
      next.add(parts.slice(0, index).join("/"));
    }

    setExpandedFolders(next);
  }

  async function loadRepository(event) {
    event?.preventDefault();

    if (!repoUrl.trim()) {
      setError("Enter a public GitHub repository URL.");
      return;
    }

    setRepoLoading(true);
    setGithubError("");
    setGithubMessage("");
    setRepository(null);
    setSelectedPath("");
    setExpandedFolders(new Set());
    setReview(null);

    try {
      const data = await loadGitHubRepository(repoUrl.trim());

      const sourceFiles = (data.files || []).filter((file) =>
        SOURCE_EXTENSIONS.test(file.path)
      );

      setRepository({
        ...data,
        files: sourceFiles,
      });

      if (sourceFiles.length > 0) {
        const firstFile = sourceFiles[0];

        setSelectedPath(firstFile.path);
        expandParentFolders(firstFile.path);

        setGithubMessage(
          `Loaded ${sourceFiles.length} supported source files. Select a file to import it.`
        );
      } else {
        setGithubMessage(
          "Repository loaded, but no Java, JavaScript, TypeScript, or Python files were found."
        );
      }
    } catch (error) {
      setError(
        error.message || "Could not connect to the GitHub API."
      );
    } finally {
      setRepoLoading(false);
    }
  }

  async function importFile(file) {
    if (!file || !repository) return;

    setFileLoading(true);
    setGithubError("");
    setGithubMessage("");

    try {
      const data = await loadGitHubFile({
        repoUrl: repository.repoUrl || repoUrl.trim(),
        path: file.path,
        branch: repository.branch,
      });

      setCode(data.code ?? "");
      setLanguage(getLanguageFromPath(file.path));
      setSelectedPath(file.path);
      setReview(null);

      setGithubMessage(`Imported ${file.path}`);
    } catch (error) {
      setError(
        error.message || "Unable to import the selected file."
      );
    } finally {
      setFileLoading(false);
    }
  }

  function clearRepository() {
    setRepository(null);
    setSelectedPath("");
    setGithubMessage("");
    setGithubError("");
    setExpandedFolders(new Set());
  }

  function dismissMessage() {
    setGithubError("");
    setGithubMessage("");
  }

  return {
    repoUrl,
    setRepoUrl,
    repository,
    selectedPath,
    expandedFolders,
    repoLoading,
    fileLoading,
    githubError,
    githubMessage,
    loadRepository,
    importFile,
    toggleFolder,
    setSelectedPath,
    clearRepository,
    dismissMessage,
    setError,
  };
}
