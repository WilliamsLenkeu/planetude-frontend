export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
          PlanEtude
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          Organisez vos études avec style
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="button-primary"
          >
            Connexion
          </a>
          <a
            href="/auth/register"
            className="button-secondary"
          >
            Inscription
          </a>
        </div>
      </div>
    </div>
  )
}
