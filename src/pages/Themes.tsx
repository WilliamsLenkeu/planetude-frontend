import { useTheme } from '../contexts/ThemeContext'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/PageHeader'
import { THEMES } from '../constants/themes'
import { cn } from '../utils/cn'

export default function Themes() {
  const { currentThemeId, applyThemeById } = useTheme()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Thèmes"
        description="Personnalisez l'apparence de l'application"
      />

      <Card>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Thèmes disponibles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => applyThemeById(theme.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                currentThemeId === theme.id
                  ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                  : 'border-transparent hover:border-[var(--color-border)]'
              )}
              style={{
                backgroundColor: theme.colors.background,
              }}
            >
              <span className="text-2xl">{theme.emoji}</span>
              <span
                className="text-sm font-medium"
                style={{ color: theme.colors.text }}
              >
                {theme.name}
              </span>
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
