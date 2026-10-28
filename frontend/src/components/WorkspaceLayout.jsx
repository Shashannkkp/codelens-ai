
export default function WorkspaceLayout({ children }) {
  return (
    <main
      className="
        grid min-h-0 min-w-0 flex-1
        grid-cols-1 gap-0 overflow-hidden
        xl:grid-cols-[220px_minmax(0,1fr)_minmax(380px,510px)]
        2xl:grid-cols-[240px_minmax(0,1fr)_540px]
      "
    >
      {children}
    </main>
  );
}
