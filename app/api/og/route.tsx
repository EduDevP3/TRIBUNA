import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Usamos 'edge' porque sin las fuentes pesadas cargadas manualmente, 
// la función será ultra ligera y rápida.
export const runtime = 'edge';

export async function GET(req: NextRequest): Promise<Response | ImageResponse> {
  try {
    const { searchParams } = new URL(req.url);

    // Obtenemos el título de la URL o del nombre del sitio en variables de entorno
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : process.env.SITE_NAME || 'Tribuna';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}
        >
          {/* Logo SVG */}
          <svg viewBox="0 0 32 32" width="140">
            <rect width="100%" height="100%" rx="16" fill="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="black"
              d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
            />
          </svg>

          {/* Título - Vercel usará Inter Bold por defecto si pones fontWeight: 700 */}
          <div
            style={{
              marginTop: 48,
              fontSize: 64,
              color: 'white',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // No incluimos el array de fonts para que use la del sistema de Vercel (ligera)
      }
    );
  } catch (e: any) {
    console.log(`Error generating OG image: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}