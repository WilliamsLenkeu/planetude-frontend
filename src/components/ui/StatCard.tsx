import { memo, type ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subValue?: string
  color?: string
  className?: string
}

export const StatCard = memo(({ 
  icon, 
  label, 
  value, 
  subValue, 
  color = 'rgba(var(--color-primary-rgb), 0.1)',
  className = ''
}: StatCardProps) => {
  return (
    <div className={`chic-card p-4 flex flex-col items-center justify-center text-center space-y-2 group transition-all duration-500 hover:-translate-y-1 ${className}`}>
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border-2 shadow-sm"
        style={{ 
          backgroundColor: color,
          borderColor: 'var(--color-border)'
        }}
      >
        <div style={{ color: 'var(--color-primary)' }}>
          {icon}
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30" style={{ color: 'var(--color-text)' }}>{label}</p>
        <p className="text-lg font-black font-display tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>{value}</p>
        {subValue && (
          <p className="text-[8px] font-black uppercase tracking-[0.3em] italic opacity-50" style={{ color: 'var(--color-primary)' }}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  )
})
