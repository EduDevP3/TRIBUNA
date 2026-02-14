import { GridTileImage } from 'components/grid/tile';
import { getProducts, Product } from 'lib/products';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  background
}: {
  item: Product;
  size: 'full' | 'half';
  background?: string;
}) {
  return (
    <div
      className={size === 'full' ? 'lg:col-span-4 lg:row-span-2' : 'lg:col-span-2 lg:row-span-1'}
    >
      <Link className="block h-full" href={`/product/${item.slug}`}>
        <GridTileImage
          src={item.images[0] || ''}
          width={size === 'full' ? 1080 : 540}
          height={size === 'full' ? 1080 : 540}
          priority={true}
          background={background}
          alt={item.name}
          labels={{
            title: item.name,
            amount: item.price.toString(),
            currencyCode: 'MXN'
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Fetch specific items for the grid or just the first few
  const products = await getProducts({}); // Get all active products
  
  if (products.length < 3) return null;

  const firstProduct = products[0]!;
  const secondProduct = products[1]!;
  const thirdProduct = products[2]!;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12" data-testid="homepage-products">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white md:text-5xl">
          DESTACADOS DE LA SEMANA
        </h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Selección premium de nuestros jerseys más vendidos
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
        <ThreeItemGridItem size="full" item={firstProduct} background={firstProduct.bgColor || 'white'} />
        <ThreeItemGridItem size="half" item={secondProduct} background={secondProduct.bgColor || 'white'} />
        <ThreeItemGridItem size="half" item={thirdProduct} background={thirdProduct.bgColor || 'white'} />
      </div>
    </section>
  );
}

