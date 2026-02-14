import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/products';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link className="h-full w-full" href={`/product/${product.slug}`}>
            <GridTileImage
              alt={product.name}
              labels={{
                isSmall: true,
                title: product.name,
                amount: product.price.toString(),
                currencyCode: 'MXN'
              }}
              src={product.images[0] || ''}
              width={600}
              height={600}
              background={product.bgColor}
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}

