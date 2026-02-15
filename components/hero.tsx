'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-neutral-50 py-16 text-center dark:bg-neutral-900">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-80 w-80 md:h-56 md:w-[28rem]"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          className="object-contain dark:invert"
          priority
        />
      </motion.div>
    </div>
  );
}
