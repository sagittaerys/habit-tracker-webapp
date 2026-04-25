'use client'


import { BsCheckCircleFill } from 'react-icons/bs'
import { motion } from 'motion/react'

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a]"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.6 }}
          className="w-16 h-16 flex items-center justify-center"
        >
          <BsCheckCircleFill
            size={56}
            style={{ color: 'var(--accent)' }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Habit Tracker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  )
}