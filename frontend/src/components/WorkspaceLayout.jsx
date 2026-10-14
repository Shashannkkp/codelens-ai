
export default function WorkspaceLayout({
  children,
}) {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden xl:grid-cols-[220px_minmax(0,1fr)_530px]">
      {children}
    </main>
  );
}
