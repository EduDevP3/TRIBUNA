'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ menu }: { menu: { title: string; path: string }[] }) {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const { SITE_NAME } = { SITE_NAME: "TRIBUNA MX" }; // Fallback since process.env is handled on server usually

  return (
    <footer className="border-t border-gray-700 bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 gap-8 border-b border-gray-700 py-12 transition-colors duration-150 lg:grid-cols-12"
        >
          <div className="col-span-1 lg:col-span-3">
            <a className="flex flex-initial items-center font-bold md:mr-24" href="/">
              <span className="mr-2">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain dark:invert"
                />
              </span>
              <span>{SITE_NAME}</span>
            </a>
          </div>
          {menu.length ? (
            <nav className="col-span-1 lg:col-span-9">
              <ul className="grid md:grid-flow-col md:grid-cols-3 md:grid-rows-4">
                {menu.map((item: { title: string; path: string }, index) => (
                  <motion.li 
                    key={item.title} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="py-3 md:py-0 md:pb-4"
                  >
                    <Link
                      href={item.path}
                      className="text-gray-800 transition duration-150 ease-in-out hover:text-gray-300 dark:text-gray-100"
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          ) : null}
        </motion.div>
        <div className="flex flex-col items-center justify-between space-y-4 pb-10 pt-6 text-sm md:flex-row">
          <p>
            &copy; {copyrightDate} {SITE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
