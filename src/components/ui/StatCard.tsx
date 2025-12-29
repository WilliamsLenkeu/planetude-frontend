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
    <div className={`kawaii-card bg-white text-center space-y-2 border-2 border-pink-milk ${className}`}>
      <div className={`${color} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4`}>
        {icon}
      </div>
      <p className="text-[10px] md:text-sm font-bold text-hello-black/40 uppercase tracking-wider">{label}</p>
      <p className="text-xl md:text-3xl font-black text-hello-black">{value}</p>
      {subValue && <p className="text-[10px] md:text-xs text-pink-candy font-bold">{subValue}</p>}
    </div>
  )
}
