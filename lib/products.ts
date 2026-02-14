import productsData from '../data/products.json';
import { Product } from './types';

export type { Product };


const mapToProduct = (p: any): Product => {
  // Try to find local match for bgColor fallback
  const localMatch = productsData.find(local => local.sku === p.sku || local.handle === p.handle);

  return {
    ...p,
    name: p.title,
    slug: p.handle,
    images: [p.image_url],
    isActive: p.stock ?? true,
    currency: p.currency || 'MXN',
    bgColor: p.bgColor || localMatch?.bgColor
  };
};

import { cookies } from 'next/headers';

export async function getProducts({ query, reverse, sortKey }: { query?: string; reverse?: boolean; sortKey?: string } = {}): Promise<Product[]> {
  const cookieStore = cookies();
  const isBackendReady = cookieStore.get('backend_ready');
  let products: Product[] = [];

  if (isBackendReady) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:82/api/v1';
      const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' }); // Always fetch fresh data if backend is ready
      if (res.ok) {
        const data = await res.json();
        // The API likely returns { products: [...] } or just [...]
        // Adjust based on your API response structure. Assuming array for now based on standard REST practices, 
        // or let's wrap it in try/catch if structure differs.
        const items = Array.isArray(data) ? data : (data.products || []);
        products = items.map(mapToProduct).filter((p: Product) => p.isActive);
      } else {
        console.warn('Backend ready but fetch failed, falling back to local');
        products = productsData.map(mapToProduct).filter((p) => p.isActive);
      }
    } catch (e) {
      console.error('Error fetching from backend:', e);
      products = productsData.map(mapToProduct).filter((p) => p.isActive);
    }
  } else {
    products = productsData.map(mapToProduct).filter((p) => p.isActive);
  }

  if (query) {
    products = products.filter((p) => p.name.toLowerCase().includes(query!.toLowerCase()));
  }

  if (sortKey === 'PRICE') {
    products.sort((a, b) => (reverse ? b.price - a.price : a.price - b.price));
  } else if (sortKey === 'CREATED_AT') {
    products.sort((a, b) => (reverse ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }

  return products;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const cookieStore = cookies();
  const isBackendReady = cookieStore.get('backend_ready');

  if (isBackendReady) {
    try {
      // Ideally fetch specific product by handle from API if endpoint exists, e.g. /products/:handle or filter list
      // Since the standard endpoint is likely /products or /products/:id, let's fetch all for safety or implement filtered fetch if supported.
      // For now, fetching all and filtering locally is safer given unknown API capabilities for 'handle'.
      const products = await getProducts();
      return products.find((p) => p.slug === handle);
    } catch (e) {
      return productsData.map(mapToProduct).find((p) => p.slug === handle && p.isActive);
    }
  }
  return productsData.map(mapToProduct).find((p) => p.slug === handle && p.isActive);
}

export async function getCollectionProducts({ collection, reverse, sortKey }: { collection: string; reverse?: boolean; sortKey?: string }): Promise<Product[]> {
  let products = productsData.map(mapToProduct).filter((p) => p.isActive && p.category === collection);

  if (sortKey === 'PRICE') {
    products.sort((a, b) => (reverse ? b.price - a.price : a.price - b.price));
  } else if (sortKey === 'CREATED_AT') {
    products.sort((a, b) => (reverse ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }

  return products;
}


export async function getCollection(handle: string): Promise<{ handle: string; title: string; path: string; seo?: { title: string; description: string }; description?: string; updatedAt: string } | undefined> {
  const collections = await getCollections();
  return collections.find(c => c.handle === handle || c.path === `/search/${handle}`);
}

export async function getCollections(): Promise<{ handle: string; title: string; path: string; updatedAt: string }[]> {
  const categories = Array.from(new Set(productsData.map(p => p.category)));
  return categories.map(c => ({
    handle: c,
    title: c.charAt(0).toUpperCase() + c.slice(1),
    path: `/search/${c}`,
    updatedAt: new Date().toISOString()
  }));
}

import menuData from '../data/menu.json';

export async function getMenu(handle: string): Promise<{ title: string; path: string }[]> {
  if (handle === 'next-js-frontend-header-menu') {
    return menuData;
  }
  // You could add a footer menu logic here if needed, reading from a different file or key
  if (handle === 'next-js-frontend-footer-menu') {
    return menuData;
  }
  return [];
}

export async function getPage(handle: string) {
  return {
    id: '1',
    title: 'Mock Page',
    handle: handle,
    body: 'This is a mock page content.',
    bodySummary: 'Mock page summary.',
    seo: {
      title: 'Mock Page',
      description: 'Mock page description'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getPages() {
  return [
    {
      id: '1',
      title: 'About Us',
      handle: 'about',
      slug: 'about',
      path: '/about',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Terms & Conditions',
      handle: 'terms-conditions',
      slug: 'terms-conditions',
      path: '/terms-conditions',
      updatedAt: new Date().toISOString()
    }
  ];
}

