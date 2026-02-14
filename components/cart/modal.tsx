import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';

import CloseIcon from 'components/icons/close';
import ShoppingBagIcon from 'components/icons/shopping-bag';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import { useRouter } from 'next/navigation';
import { useCartStore } from 'stores/cartStore';
import DeleteItemButton from './delete-item-button';
import EditItemQuantityButton from './edit-item-quantity-button';

export default function CartModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const cartItems = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    setIsCheckingOut(true);

    try {
        const orderPayload = {
            orderItems: cartItems.map(item => ({
                product: item.productId,
                sku: item.name, // Using name as SKU snapshot or actual SKU if available in item. Ideally item should have SKU.
                title: item.name,
                quantity: item.quantity,
                image_url: item.image || '',
                price: item.price,
                size: item.size
            })),
            shippingAddress: {
                address: "Dirección de prueba", // Placeholder or from form if exists
                city: "Ciudad de México",
                postalCode: "00000",
                country: "México",
                state: "CDMX"
            },
            itemsPrice: totalPrice,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: totalPrice,
            // containsQuotationItems: true // Optional based on docs
        };

        // Wake-up endpoint is handled in layout, but we ensure to use the env var here.
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:82/api/v1';
        
        const response = await fetch(`${apiUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
            const data = await response.json();
            clearCart();
            onClose();
            // Redirect to summary/success page with ID
            router.push(`/order-summary/${data._id}`); 
        } else {
            const errorData = await response.json();
            console.error('Order creation failed:', errorData);
            alert(`Error al crear el pedido: ${errorData.message || 'Inténtalo de nuevo'}`);
        }

    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error de conexión al crear el pedido.');
    } finally {
        setIsCheckingOut(false);
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[.5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[.5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 right-0 flex w-full flex-col bg-white p-6 text-black shadow-xl dark:bg-black dark:text-white md:w-3/5 lg:w-2/5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Mi Carrito</p>
              <button
                aria-label="Cerrar carrito"
                onClick={onClose}
                className="text-black transition-colors hover:text-gray-500 dark:text-gray-100"
                data-testid="close-cart"
              >
                <CloseIcon className="h-7" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <ShoppingBagIcon className="h-16" />
                <p className="mt-6 text-center text-2xl font-bold">Tu carrito está vacío.</p>
              </div>
            ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="flex-grow overflow-auto py-4">
                    {cartItems.map((item, i) => {
                      const merchandiseUrl = createUrl(
                        `/product/${item.slug}`,
                        new URLSearchParams({ size: item.size })
                      );

                      return (
                        <li key={`${item.productId}-${item.size}`} className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={onClose}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.name}
                                  src={item.image || ''}
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.name}
                                </span>
                                {item.size !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Talla: {item.size}
                                  </p>
                                ) : null}
                              </div>
                            </Link>

                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item.price * item.quantity}
                                currencyCode="MXN"
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Número de artículos</p>
                      <p className="text-right text-black dark:text-white">{totalItems}</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Subtotal</p>
                      <Price
                        className="text-right text-black dark:text-white"
                        amount={totalPrice}
                        currencyCode="MXN"
                      />
                    </div>
                     {/* No shipping or tax calculation for now as requested */}
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700 font-bold text-black dark:text-white">
                      <p>Total</p>
                      <Price
                        className="text-right"
                        amount={totalPrice}
                        currencyCode="MXN"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCheckingOut ? <LoadingDots className="bg-white" /> : 'Finalizar pedido'}
                  </button>
                </div>
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

