
export default function PanelHeader({
  icon: Icon,
  title,
  right,
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
      <div className="flex min-w-0 items-center gap-2">
        {Icon && (
          <Icon
            size={14}
            className="shrink-0 text-emerald-400"
          />
        )}

        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
          {title}
        </span>
      </div>

      {right && (
        <div className="shrink-0">
          {right}
        </div>
      )}
    </div>
  );
}
