
import { useState } from "react";


import AppFooter from "./components/AppFooter";
import WorkspaceToolbar from "./components/WorkspaceToolbar";
import AppHeader from "./components/AppHeader";
import GitHubExplorer from "./components/GitHubExplorer";
import CodeEditor from "./components/CodeEditor";
import ReviewResults from "./components/ReviewResults";
import ReviewResultsHeader from "./components/ReviewResultsHeader";
import WorkspaceLayout from "./components/WorkspaceLayout";


import useGitHubRepository from "./hooks/useGitHubRepository";
import useCodeReview from "./hooks/useCodeReview";
import useCodeEditor from "./hooks/useCodeEditor";

const DEFAULT_CODE = `public class UserService {

    public User findUser(int id) {
        String password = "admin123";

        for (int i = 0; i < 100; i++) {
            System.out.println("Searching user...");
        }

        return null;
    }

    public void processUser() {
        // TODO: Add input validation
        int value = 42;
    }
}`;

function PanelHeader({ icon: Icon, title, right }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={14} className="text-emerald-400" />
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("Java");
  const [review, setReview] = useState(null);

  // Step 1: Initialize GitHub functionality first.
  const github = useGitHubRepository({
    setCode,
    setLanguage,
    setReview,
  });

  // Step 2: Initialize code review after github exists.
  const { loading, reviewCode } = useCodeReview({
    code,
    language,
    setReview,
    dismissMessage: github.dismissMessage,
    setError: github.setError,
  });

  const { clearCode, resetCode } = useCodeEditor({
  defaultCode: DEFAULT_CODE,
  setCode,
  setLanguage,
  setReview,
  dismissMessage: github.dismissMessage,
});


  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#111315] text-slate-200">
      {/* Application header */}
      <AppHeader />

      {/* Workspace toolbar */}

<WorkspaceToolbar
  repository={github.repository}
  selectedPath={github.selectedPath}
  onReset={resetCode}
/>

      {/* Three-panel workspace */}
      <WorkspaceLayout>
        {/* GitHub Explorer */}
        <GitHubExplorer
          repoUrl={github.repoUrl}
          setRepoUrl={github.setRepoUrl}
          repository={github.repository}
          repoLoading={github.repoLoading}
          loadRepository={github.loadRepository}
          expandedFolders={github.expandedFolders}
          toggleFolder={github.toggleFolder}
          selectedPath={github.selectedPath}
          onSelectFile={(file) => {
            github.setSelectedPath(file.path);
            github.dismissMessage();
          }}
          importFile={github.importFile}
          fileLoading={github.fileLoading}
          onClearRepository={github.clearRepository}
          githubError={github.githubError}
          githubMessage={github.githubMessage}
          dismissMessage={github.dismissMessage}
        />

        {/* Code editor */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-white/[0.08] xl:border-b-0 xl:border-r">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              loading={loading}
              reviewCode={reviewCode}
              clearCode={clearCode}
              resetCode={resetCode}
            />
          </div>
        </section>

        {/* Review results */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[#141618]">
          <ReviewResultsHeader />

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-color:#3f4844_transparent] [scrollbar-width:thin] sm:p-4">
            <ReviewResults review={review} loading={loading} />
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-white/[0.08] px-3 py-2">
            <span className="text-[10px] text-slate-600">
              CodeLens Analysis Engine
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              15 rules enabled
            </span>
          </div>
        </section>
      </WorkspaceLayout>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
