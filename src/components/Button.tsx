import type { ReactNode } from 'react'

export default function Button({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded-sm bg-primary text-white hover:opacity-95">
      {children}
    </button>
  )
}
