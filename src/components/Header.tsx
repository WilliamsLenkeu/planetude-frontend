export default function Header() {
  return (
    <header className="w-full p-4 bg-gradient-to-r from-primary to-primary-100 text-white shadow-soft">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">PlanÉtude</h1>
        <nav className="space-x-3">
          <a href="/" className="opacity-90 hover:opacity-100">Accueil</a>
          <a href="/dashboard" className="opacity-90 hover:opacity-100">Dashboard</a>
        </nav>
      </div>
    </header>
  )
}
