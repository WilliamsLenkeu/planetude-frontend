import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subValue?: string
  color?: string
  className?: string
}

export function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  color = 'bg-pink-milk',
  className = ''
}: StatCardProps) {
  return (
    <div className={`notebook-page p-6 text-center space-y-2 border-l-4 border-pink-candy ${className}`}>
      <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-white/50`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-black text-hello-black font-display">{value}</p>
      {subValue && (
        <p className="text-[10px] text-pink-deep/40 font-black uppercase tracking-widest italic">
          {subValue}
        </p>
      )}
    </div>
  )
}
