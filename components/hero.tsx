import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-neutral-50 py-12 text-center dark:bg-neutral-900">
      <div className="relative h-32 w-64 md:h-48 md:w-96">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          className="object-contain dark:invert"
          priority
        />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        TRIBUNA MX
      </h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Pasión en cada hilo
      </p>
    </div>
  );
}
