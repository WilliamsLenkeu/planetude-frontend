import { Star } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-bounce">
        <div className="w-16 h-16 bg-pink-candy rounded-full border-4 border-white shadow-kawaii flex items-center justify-center">
          <Star className="text-white" size={32} />
        </div>
      </div>
    </div>
  )
}
