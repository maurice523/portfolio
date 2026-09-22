// Temporary placeholder so we can check the scaffold works.
// Routes and real pages come in the next phases.
function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4">
      <p className="text-muted font-mono">~/mauriceneme.com</p>
      <h1 className="mt-2 font-mono text-3xl font-bold md:text-5xl">
        <span className="text-accent">&gt;</span> hello, world
        <span className="text-accent ml-1 animate-pulse motion-reduce:animate-none">▋</span>
      </h1>
      <p className="text-muted mt-4 max-w-prose">
        Scaffold ready: Vite + React + TypeScript + Tailwind v4.
      </p>
    </main>
  )
}

export default App
