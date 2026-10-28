import { useState } from "react";

import {
  ShieldCheck,
  Bug,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Activity,
  Code2,
  FileWarning,
  SearchCheck,
  Copy,
  Check,
} from "lucide-react";

function ReviewResults({ review, loading }) {
  const issues = Array.isArray(review?.issues)
    ? review.issues
    : [];

  const criticalCount = issues.filter(
    (issue) => issue.severity === "CRITICAL"
  ).length;

  const highCount = issues.filter(
    (issue) => issue.severity === "HIGH"
  ).length;

  const mediumCount = issues.filter(
    (issue) => issue.severity === "MEDIUM"
  ).length;

  const lowCount = issues.filter(
    (issue) => issue.severity === "LOW"
  ).length;

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border border-sky-200/80 bg-sky-100 shadow-xl shadow-sky-200/40 backdrop-blur-xl">
      {/* Header */}
      <div className="shrink-0 border-b border-sky-200 bg-sky-200/80 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 bg-sky-100/80 shadow-sm">
              <SearchCheck
                size={18}
                className="text-sky-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Review Results
              </h3>

              <p className="text-xs text-slate-600">
                Code analysis and recommendations
              </p>
            </div>
          </div>

          {review && !loading && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Activity
                size={17}
                className="text-emerald-600 animate-pulse"
              />
              Analysis complete
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Results Area */}
      <div
        className="
          flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden p-3 sm:p-4
          [scrollbar-width:thin]
          [scrollbar-color:transparent_transparent]
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-transparent
          hover:[&::-webkit-scrollbar-thumb]:bg-sky-400/50
          [&::-webkit-scrollbar-thumb]:rounded-full
        "
      >
        {/* Empty State */}
        {!review && !loading && <EmptyState />}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Results */}
        {review && !loading && (
          <div className="w-full space-y-4">
            {/* Score Overview */}
            <ScoreOverview
              review={review}
              issueCount={issues.length}
            />

            {/* Severity Overview */}
            <SeverityOverview
              critical={criticalCount}
              high={highCount}
              medium={mediumCount}
              low={lowCount}
            />

            {/* Summary */}
            <div className="rounded-xl border border-sky-200/70 bg-white/45 p-4 shadow-md shadow-sky-200/20 backdrop-blur-xl transition-all duration-300 hover:bg-white/60">
              <div className="flex items-center gap-2 mb-3">
                <FileWarning
                  size={16}
                  className="text-sky-600"
                />

                <h4 className="text-sm font-semibold text-slate-500">
                  Analysis Summary
                </h4>
              </div>

              <p className="text-sm text-slate-600 leading-6">
                {review.summary ||
                  `Found ${issues.length} potential issue(s). Review the findings below.`}
              </p>
            </div>

            {/* Issues */}
            {issues.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate">
                      Detected Issues
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      Review each finding and apply the recommendations.
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                    {issues.length}{" "}
                    {issues.length === 1 ? "issue" : "issues"}
                  </span>
                </div>

                <div className="space-y-3">
                  {issues.map((issue, index) => (
                    <IssueCard
                      key={`${issue.title}-${issue.lineNumber}-${index}`}
                      issue={issue}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <SuccessState />
            )}

            {/* Improved Code */}
            <ImprovedCodePanel code={review.improvedCode} />

            {/* Suggestions */}
            {Array.isArray(review.suggestions) &&
              review.suggestions.length > 0 && (
                <SuggestionsPanel
                  suggestions={review.suggestions}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------
   Score Overview
-------------------------------- */

function ScoreOverview({ review, issueCount }) {
  const score = Math.max(
    0,
    Math.min(100, Number(review.score ?? 0))
  );

  const scoreLabel =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 50
      ? "Needs Attention"
      : "Critical";

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Overall Score */}
      <div className="rounded-xl border border-sky-200/80 bg-gradient-to-br from-white/90 via-sky-50/80 to-sky-100/70 p-5 shadow-md shadow-sky-200/30 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Code Health
            </p>

            <h4 className="text-sm font-semibold text-slate-400 mt-1">
              Overall Score
            </h4>
          </div>

          <ShieldCheck
            size={18}
            className="text-blue-400"
          />
        </div>

        <div className="flex items-center gap-5">
          <ScoreRing score={score} />

          <div>
            <p className="text-xl font-bold text-slate-500">
              {scoreLabel}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {issueCount === 0
                ? "No issues detected"
                : `${issueCount} potential issue${issueCount === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 gap-3">
        <MiniScore
          icon={<ShieldCheck size={15} />}
          label="Security"
          value={review.security}
        />

        <MiniScore
          icon={<Zap size={15} />}
          label="Performance"
          value={review.performance}
        />

        <MiniScore
          icon={<Bug size={15} />}
          label="Quality"
          value={review.quality}
        />

        <MiniScore
          icon={<Activity size={15} />}
          label="Total Issues"
          value={issueCount}
          isIssueCount
        />
      </div>
    </div>
  );
}

/* --------------------------------
   Score Ring
-------------------------------- */

function ScoreRing({ score }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100));
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-[76px] h-[76px] shrink-0">
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        className="-rotate-90"
      >
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-sky-200"
        />

        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-500 transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-400">
          {score}
        </span>
      </div>
    </div>
  );
}

/* --------------------------------
   Mini Score
-------------------------------- */

function MiniScore({
  icon,
  label,
  value,
  isIssueCount = false,
}) {
  return (
    <div className="rounded-xl border border-sky-200/80 bg-white/60 p-3 shadow-sm shadow-sky-100/60 transition hover:bg-white/80">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {icon}

        <span className="text-[11px]">
          {label}
        </span>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-lg font-bold text-slate-400">
          {value ?? 0}
        </span>

        {!isIssueCount && (
          <span className="text-[10px] text-slate-600 mb-1">
            /100
          </span>
        )}
      </div>
    </div>
  );
}

/* --------------------------------
   Severity Overview
-------------------------------- */

function SeverityOverview({
  critical,
  high,
  medium,
  low,
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <SeverityBox
        label="Critical"
        value={critical}
        type="critical"
      />

      <SeverityBox
        label="High"
        value={high}
        type="high"
      />

      <SeverityBox
        label="Medium"
        value={medium}
        type="medium"
      />

      <SeverityBox
        label="Low"
        value={low}
        type="low"
      />
    </div>
  );
}

/* --------------------------------
   Severity Box
-------------------------------- */

function SeverityBox({ label, value, type }) {
  const styles = {
  critical:
    "text-red-700 bg-red-100/80 border-red-200",
  high:
    "text-orange-700 bg-orange-100/80 border-orange-200",
  medium:
    "text-amber-700 bg-amber-100/80 border-amber-200",
  low:
    "text-sky-700 bg-green-200/80 border-sky-200",
  };

  return (
    <div
      className={`rounded-lg border p-2.5 text-center ${styles[type]}`}
    >
      <p className="text-lg font-bold">
        {value}
      </p>

      <p className="text-[10px] opacity-70 mt-0.5">
        {label}
      </p>
    </div>
  );
}

/* --------------------------------
   Issue Card
-------------------------------- */

function IssueCard({ issue, index }) {
  const severity = String(
    issue.severity || "LOW"
  ).toUpperCase();

  const severityConfig = {
    CRITICAL: {
      icon: <AlertCircle size={16} />,
      badge:
        "bg-red-500/10 text-red-400 border-red-500/20",
      accent: "border-l-red-500",
      label: "Critical",
    },

    HIGH: {
      icon: <AlertTriangle size={16} />,
      badge:
        "bg-orange-500/10 text-orange-400 border-orange-500/20",
      accent: "border-l-orange-500",
      label: "High",
    },

    MEDIUM: {
      icon: <AlertTriangle size={16} />,
      badge:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      accent: "border-l-yellow-500",
      label: "Medium",
    },

    LOW: {
      icon: <Lightbulb size={16} />,
      badge:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
      accent: "border-l-blue-500",
      label: "Low",
    },
  };

  const config =
    severityConfig[severity] || severityConfig.LOW;

  const affectedCode =
    issue.code || issue.matchedCode;

  return (
    <div
      className={`
        group w-full overflow-hidden rounded-xl
        border border-sky-200 border-l-2 ${config.accent}
        bg-white/60
        transition-all duration-200
        hover:bg-white/90 hover:shadow-md hover:shadow-sky-100/70
        backdrop-blur-xl
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 text-slate-400">
              {config.icon}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-semibold text-slate-500">
                  {issue.title || "Code Issue"}
                </h5>

                <span
                  className={`
                    px-2 py-0.5 rounded-full border
                    text-[10px] font-semibold uppercase
                    ${config.badge}
                  `}
                >
                  {config.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {issue.category && (
                  <span className="text-[11px] text-slate-500">
                    {issue.category}
                  </span>
                )}

                {issue.lineNumber > 0 && (
                  <>
                    <span className="text-slate-700">•</span>

                    <span className="text-[11px] text-slate-500">
                      Line {issue.lineNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <span className="text-[10px] text-slate-700 font-mono">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Description */}
        {issue.description && (
          <p className="text-xs text-slate-400 leading-5 mt-4">
            {issue.description}
          </p>
        )}

        {/* Detected Code */}
        {affectedCode && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Code2
                size={13}
                className="text-slate-500"
              />

              <span className="text-[10px] uppercase tracking-wider text-slate-600">
                Detected code
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-sky-200 bg-sky-100/70 px-3 py-2.5">
              <code className="whitespace-pre font-mono text-xs text-slate-800">
                {affectedCode}
              </code>
            </div>
          </div>
        )}

        {/* Recommendation */}
        {issue.recommendation && (
          <div className="mt-4 rounded-lg border border-sky-200 bg-sky-100/60 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb
                size={13}
                className="text-blue-400"
              />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                Recommendation
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-5">
              {issue.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------
   Improved Code Panel
-------------------------------- */

function ImprovedCodePanel({ code }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const improvedCode =
    typeof code === "string" ? code : "";

  async function handleCopy() {
    if (!improvedCode.trim()) {
      setCopyError("No improved code is available.");
      return;
    }

    try {
      await navigator.clipboard.writeText(improvedCode);
      setCopied(true);
      setCopyError("");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
      setCopyError(
        "Copy failed. Select the code and copy it manually."
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sky-200/80 bg-white/60 shadow-md shadow-sky-200/30 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200 bg-sky-100/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Code2
              size={18}
              className="text-green-400"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate">
              Improved Code
            </h4>

            <p className="text-xs text-slate-500 mt-1">
              CodeLens suggested corrected version
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!improvedCode.trim()}
          className="flex items-center gap-2 rounded-lg border border-sky-200 bg-white/70 px-3 py-2 text-xs text-slate-700 transition-colors hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <Check
                size={14}
                className="text-green-400"
              />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy Code
            </>
          )}
        </button>
      </div>

      {improvedCode.trim() ? (
        <pre className="max-h-[420px] overflow-auto whitespace-pre bg-white/40 p-4 font-mono text-xs leading-6 text-slate-800">
          <code>{improvedCode}</code>
        </pre>
      ) : (
        <div className="p-4">
          <p className="text-sm text-slate-500">
            Gemini did not return improved code for this review.
          </p>
        </div>
      )}

      {copyError && (
        <p className="px-4 pb-4 text-xs text-red-400">
          {copyError}
        </p>
      )}
    </div>
  );
}

/* --------------------------------
   Suggestions Panel
-------------------------------- */

function SuggestionsPanel({ suggestions }) {
  return (
    <div className="rounded-xl border border-sky-200/80 bg-white/60 p-4 shadow-sm shadow-sky-100/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb
          size={16}
          className="text-blue-400"
        />

        <h4 className="text-sm font-semibold text-slate">
          Additional Suggestions
        </h4>
      </div>

      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={`${index}-${suggestion}`}
            className="flex items-start gap-2 text-xs text-slate-400 leading-5"
          >
            <CheckCircle2
              size={14}
              className="text-blue-400 mt-0.5 shrink-0"
            />

            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------
   Empty State
-------------------------------- */

function EmptyState() {
  return (
    <div className="h-full min-h-[420px] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-100/80 border border-sky-200 flex items-center justify-center mb-5">
          <Code2
            size={28}
            className="text-sky-600"
          />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Ready to review
        </h3>

        <p className="text-sm text-slate-600 leading-6">
          Add your code in the editor and click
          <span className="text-slate-700">
            {" "}Review Code{" "}
          </span>
          to start the analysis.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------
   Loading State
-------------------------------- */

function LoadingState() {
  return (
    <div className="h-full min-h-[420px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto w-14 h-14 mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-sky-200" />

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Activity
              size={20}
              className="text-sky-600"
            />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-800">
          Analyzing your code...
        </h3>

        <p className="text-xs text-slate-600 mt-2">
          Checking security, bugs, performance and quality.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------
   Success State
-------------------------------- */

function SuccessState() {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-100/80">
          <CheckCircle2
            size={18}
            className="text-green-400"
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-green-400">
            No issues detected
          </h4>

          <p className="text-xs text-slate-500 leading-5 mt-1">
            No actionable issues were returned by the current review.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReviewResults;