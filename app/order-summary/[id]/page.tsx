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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:82/api/v1';
      fetch(`${apiUrl}/orders/${params.id}`)
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
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white uppercase">
          ¡PEDIDO REALIZADO!
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl">
          Gracias por confiar en <span className="font-bold text-black dark:text-white">Tribuna MX</span>. 
          Tu orden ha sido registrada correctamente y estamos listos para prepararla.
        </p>
        <div className="mt-6 inline-flex items-center rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
          ID de Pedido: <span className="ml-2 font-mono font-bold">{order._id}</span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {/* Lado Izquierdo: Resumen */}
        <div className="bg-white dark:bg-neutral-900 shadow-2xl sm:rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6">Resumen de productos</h2>
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.orderItems.map((item: any) => (
                <li key={item._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-bold text-black dark:text-white">
                      <h3>{item.title}</h3>
                      <p className="ml-4 text-teal-600">A COTIZAR</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 lowercase">SKU: {item.sku}</p>
                    <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Talla: <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.size}</span></p>
                    <div className="mt-auto flex items-center justify-between text-sm">
                      <p className="text-neutral-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lado Derecho: Siguientes Pasos */}
        <div className="flex flex-col gap-6">
          <div className="bg-teal-50 dark:bg-teal-900/10 p-8 rounded-3xl border border-teal-100 dark:border-teal-900/30">
            <h3 className="text-2xl font-black text-teal-900 dark:text-teal-400 uppercase tracking-tight">Siguientes Pasos</h3>
            <p className="mt-4 text-teal-800 dark:text-teal-300 leading-relaxed">
              Para finalizar el proceso y confirmar el pago/envío, por favor envíanos un mensaje por WhatsApp con tu ID de pedido.
            </p>
            
            <div className="mt-8 space-y-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:bg-[#22c35e] hover:scale-[1.02] active:scale-95"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar ID por WhatsApp
              </a>
              <p className="text-center text-xs text-teal-600 dark:text-teal-500 font-bold uppercase tracking-widest">
                ¡Respondemos en menos de 10 minutos!
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800">
             <div className="flex justify-between text-base font-medium text-black dark:text-white mb-4">
                <p>Método de Envío</p>
                <p className="font-bold text-teal-600">Standard (A Cotizar)</p>
            </div>
            <div className="flex justify-between items-center text-black dark:text-white pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-lg font-bold">Total estimado</p>
                <p className="text-2xl font-black text-teal-600 italic">A COTIZAR</p> 
            </div>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              * El precio mostrado no incluye costos de envío los cuales se acuerdan por WhatsApp dependiendo de tu zona.
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/" className="text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              &larr; Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
