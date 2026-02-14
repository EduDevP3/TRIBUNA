import { getProducts } from 'lib/products';
import Image from 'next/image';
import Link from 'next/link';

export async function Carousel() {
  // Just show all products in the carousel for now, or filter by a 'Featured' logic if we added that field
  const products = await getProducts({}); 

  if (!products?.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-black dark:bg-white">
      <div className="flex animate-carousel">
        {[...products, ...products].map((product, i) => (
          <Link
            key={`${product.slug}${i}`}
            href={`/product/${product.slug}`}
            className="relative h-[30vh] w-1/2 flex-none md:w-1/3"
          >
            {product.images[0] ? (
              <Image
                alt={product.name}
                className="h-full object-contain"
                fill
                sizes="33vw"
                src={product.images[0]}
              />
            ) : null}

          </Link>
        ))}
      </div>
    </div>
  );
}

