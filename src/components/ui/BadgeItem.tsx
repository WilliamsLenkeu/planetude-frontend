import { motion } from 'framer-motion'
import type { Badge as BadgeType } from '../../types'

interface BadgeItemProps {
  badge: BadgeType
}

export function BadgeItem({ badge }: BadgeItemProps) {
  const isUnlocked = !!badge.awardedAt;
  return (
    <motion.div 
      whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
      className={`kawaii-card p-4 text-center space-y-2 border-2 ${
        isUnlocked 
          ? 'bg-pink-milk border-pink-candy' 
          : 'bg-gray-50 border-gray-200 grayscale opacity-50'
      }`}
    >
      <div className="text-4xl mb-2">{badge.icon}</div>
      <p className="text-sm font-bold text-hello-black">{badge.name}</p>
      <p className="text-[10px] text-hello-black/60 leading-tight">{badge.description}</p>
    </motion.div>
  )
}
