'use client';

import React from 'react';
import WhatsAppIcon from 'components/icons/whatsapp';

const WhatsAppFloating = () => {
    const phoneNumber = "523221045519"; // Número de prueba
    const message = encodeURIComponent("Hola! Tengo una duda sobre los productos de Tribuna.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
            aria-label="Contactar por WhatsApp"
        >
            <WhatsAppIcon className="h-8 w-8" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                1
            </span>
        </a>
    );
};

export default WhatsAppFloating;
