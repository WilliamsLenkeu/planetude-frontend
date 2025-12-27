import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from './AestheticComponents';

const affirmations = [
    "Tu es capable de grandes choses ! ✨",
    "Chaque petit pas compte énormément. 🌸",
    "Respire, tu gères déjà très bien. 🕊",
    "Aujourd'hui est une belle journée pour apprendre. 🎀",
    "Fais de ton mieux, c'est tout ce qui compte. 💖",
    "Ta concentration est ton super-pouvoir ! 🧚‍♀️",
    "Reste douce avec toi-même. 🌟"
];

const AffirmationWidget: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % affirmations.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-16 flex items-center justify-center overflow-hidden bg-white/40 backdrop-blur-sm rounded-full px-6 border-2 border-primary-light/30 mb-8 max-w-sm mx-auto shadow-inner">
            <Heart className="mr-3" />
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm font-medium italic text-primary-dark text-center"
                >
                    {affirmations[index]}
                </motion.p>
            </AnimatePresence>
            <Heart className="ml-3" />
        </div>
    );
};

export default AffirmationWidget;
