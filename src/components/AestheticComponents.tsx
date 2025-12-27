import React from 'react';
import { motion } from 'framer-motion';

export const Sparkle: React.FC<{ className?: string }> = ({ className = "" }) => (
    <motion.span
        className={`inline-block text-accent ${className}`}
        animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 45, 0]
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        ✨
    </motion.span>
);

export const Heart: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
    <motion.span
        className={`inline-block text-primary-light ${className}`}
        animate={{
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        style={{ fontSize: size }}
    >
        ❤
    </motion.span>
);

export const BouncyCard: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay
        }}
        className={`kawaii-card ${className}`}
    >
        {children}
    </motion.div>
);

export const Ribbon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-12 h-6 bg-primary rounded-full relative z-10"></div>
        <div className="absolute -left-2 w-8 h-8 bg-primary-dark rounded-full rotate-45 z-0"></div>
        <div className="absolute -right-2 w-8 h-8 bg-primary-dark rounded-full -rotate-45 z-0"></div>
        <div className="absolute w-4 h-4 bg-white rounded-full z-20 shadow-inner"></div>
    </div>
);
