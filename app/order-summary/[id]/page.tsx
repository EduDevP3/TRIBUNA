'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Price from 'components/price';

export default function OrderSummaryPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:8000/api/v1/orders/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <p className="mb-4">Pedido no encontrado.</p>
        <Link href="/" className="rounded bg-blue-600 px-4 py-2 text-white">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // Construct WhatsApp link
  const waMessage = `Hola, mi pedido es: ${order._id}. Necesito ayuda.`;
  const waLink = `https://wa.me/523221045519?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
          className="mb-6 h-auto w-32 dark:invert"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          ¡GRACIAS POR SU ORDEN!
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          El ID de su pedido es <span className="font-mono font-bold text-black dark:text-white">{order._id}</span>
        </p>
      </div>

      <div className="mt-12 bg-white dark:bg-neutral-900 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Resumen del Pedido</h2>
          
          <div className="mt-8 flow-root">
            <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
              {order.orderItems.map((item: any) => (
                <li key={item._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <h3>{item.title}</h3>
                        <p className="ml-4">A COTIZAR</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Talla: {item.size}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500 dark:text-gray-400">Cant: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Total</p>
                <p>A COTIZAR</p> 
            </div>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Los precios finales serán confirmados por un agente.
            </p>
            <div className="mt-6">
                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                >
                    Contactar por WhatsApp para finalizar
                </a>
            </div>
             <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  o{' '}
                  <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                    Continuar Comprando<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
        </div>
      </div>
    </div>
  );
}
