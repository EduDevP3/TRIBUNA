'use client';

import { motion } from 'framer-motion';

export default function PromoBanner() {
  return (
    <div className="bg-teal-500 py-2 text-center text-sm font-bold uppercase tracking-widest text-white relative overflow-hidden">
      <div className="flex items-center justify-center gap-2">
        <motion.span
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          🔥
        </motion.span>
        <span>Promoción: 1 por $600 | 2 por $1000 + Envío Gratis</span>
        <motion.span
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          🔥
        </motion.span>
      </div>
    </div>
  );
}
