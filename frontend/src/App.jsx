import { useState } from "react";
import {
  Code2,
  Play,
  ShieldCheck,
  Bug,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Activity,
  ChevronRight,
  RotateCcw,
  Trash2,
  FileCode2,
} from "lucide-react";

const DEFAULT_CODE = `public class UserService {

    public void processUsers(List<String> users) {

        for (int i = 0; i < users.size(); i++) {

            System.out.println(users.get(i));

        }
    }
}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);

  const [language, setLanguage] = useState("Java");

  const [review, setReview] = useState(null);

  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }

    setLoading(true);
    setReview(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to review code");
      }

      const data = await response.json();

      setReview(data);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the backend. Make sure the CodeLens backend is running on port 8080."
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

  const lineCount = code
    ? code.split("\n").length
    : 0;

  const characterCount = code.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <Code2 size={22} />
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


      {/* =========================
          MAIN
      ========================== */}

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Hero */}

        <section className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">

                <Sparkles size={16} />

                <span>AI-powered developer tooling</span>

              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Review your code with confidence.
              </h2>

              <p className="text-slate-400 max-w-2xl leading-7">
                Analyze your source code for security vulnerabilities,
                bugs, performance problems, and code quality issues.
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <FeatureBadge
                icon={<ShieldCheck size={14} />}
                text="Security"
              />

              <FeatureBadge
                icon={<Bug size={14} />}
                text="Bug Detection"
              />

              <FeatureBadge
                icon={<Zap size={14} />}
                text="Performance"
              />

            </div>

          </div>

        </section>


        {/* =========================
            MAIN WORKSPACE
        ========================== */}

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 items-start">

          {/* =========================
              CODE EDITOR
          ========================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/10">

            {/* Editor Header */}

            <div className="px-5 py-4 border-b border-slate-800">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Title */}

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">

                    <FileCode2
                      size={17}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <p className="font-semibold text-sm">
                      Source Code
                    </p>

                    <p className="text-xs text-slate-500">
                      Paste or edit your code
                    </p>

                  </div>

                </div>


                {/* Language */}

                <div className="relative">

                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value)
                    }
                    className="appearance-none w-full sm:w-36 bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition cursor-pointer"
                  >
                    <option>Java</option>
                    <option>JavaScript</option>
                    <option>Python</option>
                  </select>

                  <Code2
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />

                </div>

              </div>


              {/* Editor Actions */}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/70">

                <div className="flex items-center gap-2">

                  <button
                    onClick={resetCode}
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >

                    <RotateCcw size={13} />

                    Reset Example

                  </button>

                  <button
                    onClick={clearCode}
                    type="button"
                    disabled={!code}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >

                    <Trash2 size={13} />

                    Clear

                  </button>

                </div>


                <span className="text-[10px] text-slate-600 font-mono">
                  {language}
                </span>

              </div>

            </div>


            {/* =========================
                CODE AREA
            ========================== */}

            <div className="p-4">

              <div className="relative flex h-[420px] sm:h-[480px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/20 transition">

                {/* Line Numbers */}

                <div
                  aria-hidden="true"
                  className="w-12 shrink-0 overflow-hidden bg-slate-950 border-r border-slate-800 text-right font-mono text-xs leading-6 text-slate-700 select-none py-4 pr-3"
                >

                  {Array.from(
                    {
                      length: Math.max(lineCount, 1),
                    },
                    (_, index) => (
                      <div key={index}>
                        {index + 1}
                      </div>
                    )
                  )}

                </div>


                {/* Text Area */}

                <textarea
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  spellCheck="false"
                  wrap="off"
                  className="flex-1 min-w-0 h-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-300 outline-none overflow-auto whitespace-pre placeholder:text-slate-700"
                  placeholder="Paste your code here..."
                />

              </div>


              {/* Editor Footer */}

              <div className="flex items-center justify-between mt-3 px-1">

                <div className="flex items-center gap-4 text-[11px] text-slate-600 font-mono">

                  <span>
                    {lineCount} lines
                  </span>

                  <span>
                    {characterCount} characters
                  </span>

                </div>

                <span className="text-[11px] text-slate-600">
                  Plain text editor
                </span>

              </div>

            </div>


            {/* Review Button */}

            <div className="px-4 pb-4">

              <button
                onClick={reviewCode}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all rounded-xl py-3.5 font-semibold shadow-lg shadow-blue-600/10"
              >

                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Analyzing code...
                  </>
                ) : (
                  <>
                    <Play size={18} />

                    Review Code

                    <ChevronRight size={17} />
                  </>
                )}

              </button>

            </div>

          </div>


          {/* =========================
              RESULTS
          ========================== */}

          <div className="space-y-5">

            {!review && !loading && (
              <EmptyState />
            )}

            {loading && (
              <LoadingState />
            )}

            {review && (
              <>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                  <ScoreCard
                    title="Code Health"
                    score={review.score}
                    icon={<CheckCircle2 size={18} />}
                  />

                  <ScoreCard
                    title="Security"
                    score={review.security}
                    icon={<ShieldCheck size={18} />}
                  />

                  <ScoreCard
                    title="Performance"
                    score={review.performance}
                    icon={<Zap size={18} />}
                  />

                  <ScoreCard
                    title="Quality"
                    score={review.quality}
                    icon={<Bug size={18} />}
                  />

                </div>


                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 shrink-0 rounded-lg bg-yellow-500/10 flex items-center justify-center">

                      <Lightbulb
                        size={18}
                        className="text-yellow-400"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold mb-1">
                        Review Summary
                      </h3>

                      <p className="text-sm text-slate-400 leading-6">
                        {review.summary}
                      </p>

                    </div>

                  </div>

                </div>


                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">

                        <AlertTriangle
                          size={18}
                          className="text-orange-400"
                        />

                      </div>

                      <div>

                        <h3 className="font-semibold">
                          Issues Found
                        </h3>

                        <p className="text-xs text-slate-500">
                          Static analysis findings
                        </p>

                      </div>

                    </div>

                    <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-slate-400">

                      {review.issues?.length || 0} Issues

                    </span>

                  </div>


                  {review.issues?.length > 0 ? (

                    <div className="space-y-4">

                      {review.issues.map(
                        (issue, index) => (

                          <IssueCard
                            key={index}
                            issue={issue}
                          />

                        )
                      )}

                    </div>

                  ) : (

                    <NoIssues />

                  )}

                </div>

              </>
            )}

          </div>

        </section>

      </main>


      {/* Footer */}

      <footer className="border-t border-slate-800/80 mt-8">

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">

            <span>
              CodeLens AI
            </span>

            <span>
              Static analysis • Security • Code Quality
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =========================================
   FEATURE BADGE
========================================= */

function FeatureBadge({ icon, text }) {

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/70 text-xs text-slate-400">

      {icon}

      {text}

    </div>
  );
}


/* =========================================
   SCORE CARD
========================================= */

function ScoreCard({
  title,
  score,
  icon,
}) {

  const getScoreColor = () => {

    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 60) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2 text-slate-400">

          {icon}

          <span className="text-xs sm:text-sm">
            {title}
          </span>

        </div>

        <Activity
          size={15}
          className="text-slate-700"
        />

      </div>

      <div
        className={`text-2xl sm:text-3xl font-bold ${getScoreColor()}`}
      >

        {score}

        <span className="text-xs sm:text-sm text-slate-600 ml-1">
          /100
        </span>

      </div>

    </div>
  );
}


/* =========================================
   ISSUE CARD
========================================= */

function IssueCard({ issue }) {

  const severityStyles = {

    CRITICAL:
      "bg-red-500/10 text-red-400 border-red-500/20",

    HIGH:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    LOW:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

  };

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden">

      <div className="px-4 sm:px-5 py-4 border-b border-slate-800 bg-slate-900/60">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2 flex-wrap">

              <h3 className="text-sm sm:text-base text-white font-semibold">
                {issue.title}
              </h3>

              <span
                className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${
                  severityStyles[issue.severity] ||
                  severityStyles.LOW
                }`}
              >
                {issue.severity}
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-2">
              {issue.category}
            </p>

          </div>

          <div className="shrink-0 flex items-center gap-2">

            <span className="text-xs text-slate-500">
              Line
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold">
              {issue.lineNumber}
            </span>

          </div>

        </div>

      </div>


      <div className="p-4 sm:p-5">

        <div className="flex items-center justify-between mb-2">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Exact issue location
          </p>

          {issue.matchedCode && (
            <span className="text-[10px] text-red-400">
              Highlighted match
            </span>
          )}

        </div>


        <div className="rounded-lg overflow-x-auto border border-slate-800 bg-[#080d18]">

          <div className="flex min-w-max font-mono text-sm">

            <div className="select-none px-3 sm:px-4 py-3 text-right bg-slate-900 border-r border-slate-800 text-blue-400 font-semibold">

              {issue.lineNumber}

            </div>

            <div className="px-3 sm:px-4 py-3 whitespace-pre text-slate-300">

              <HighlightedCode
                code={issue.code}
                matchedCode={issue.matchedCode}
              />

            </div>

          </div>

        </div>


        {issue.matchedCode && (

          <div className="mt-4">

            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
              Exact issue detected
            </p>

            <div className="inline-block max-w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 overflow-x-auto">

              <code className="font-mono text-xs sm:text-sm text-red-300 whitespace-pre">
                {issue.matchedCode}
              </code>

            </div>

          </div>

        )}


        <div className="mt-5">

          <div className="flex items-center gap-2 mb-2">

            <AlertCircle
              size={14}
              className="text-orange-400"
            />

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Problem
            </p>

          </div>

          <p className="text-sm text-slate-300 leading-6">
            {issue.description}
          </p>

        </div>


        <div className="mt-5">

          <div className="flex items-center gap-2 mb-2">

            <Lightbulb
              size={14}
              className="text-yellow-400"
            />

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Recommendation
            </p>

          </div>

          <p className="text-sm text-green-400 leading-6">
            {issue.recommendation}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   HIGHLIGHT MATCHED CODE
========================================= */

function HighlightedCode({ code, matchedCode }) {

  if (!code) {
    return null;
  }

  if (!matchedCode) {

    return (
      <span className="text-slate-300">
        {code}
      </span>
    );
  }

  const index = code.indexOf(matchedCode);

  if (index === -1) {

    return (
      <span className="text-slate-300">
        {code}
      </span>
    );
  }

  const before = code.substring(0, index);

  const after = code.substring(
    index + matchedCode.length
  );

  return (
    <>
      <span className="text-slate-300">
        {before}
      </span>

      <span className="relative inline-block">

        <span className="rounded-md bg-red-500/20 px-1.5 py-0.5 text-red-300 ring-1 ring-red-500/50">
          {matchedCode}
        </span>

      </span>

      <span className="text-slate-300">
        {after}
      </span>
    </>
  );
}


/* =========================================
   EMPTY STATE
========================================= */

function EmptyState() {

  return (
    <div className="min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">

      <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/10 p-4 rounded-2xl mb-5 flex items-center justify-center">

        <Code2
          size={28}
          className="text-blue-400"
        />

      </div>

      <h3 className="text-lg font-semibold mb-2">
        Ready to review
      </h3>

      <p className="text-sm text-slate-500 max-w-sm leading-6">
        Paste your source code on the left and click
        Review Code to start the analysis.
      </p>

    </div>
  );
}


/* =========================================
   LOADING STATE
========================================= */

function LoadingState() {

  return (
    <div className="min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">

      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-5" />

      <h3 className="text-lg font-semibold mb-2">
        Analyzing your code...
      </h3>

      <p className="text-sm text-slate-500">
        Checking security, quality, bugs and performance.
      </p>

    </div>
  );
}


/* =========================================
   NO ISSUES
========================================= */

function NoIssues() {

  return (
    <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-6 text-center">

      <CheckCircle2
        size={32}
        className="text-green-400 mx-auto mb-3"
      />

      <h3 className="font-semibold text-green-400 mb-1">
        No issues detected
      </h3>

      <p className="text-sm text-slate-500">
        Your code looks good based on the current
        CodeLens analysis rules.
      </p>

    </div>
  );
}


export default App;