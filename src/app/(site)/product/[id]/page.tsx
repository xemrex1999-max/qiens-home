import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export const dynamic = 'force-dynamic';

const CATALOG_DICT: Record<string, any> = {
  'evseren-ayca-yatak': {
    name: 'Ayça Yatak Odası Takımı',
    price: 75600,
    category: 'Yatak Odası',
    description: 'Ayça Serisi - 2026 Model Premium Yatak Odası Takımı. Masif iskelet, baza ve komodin tasarımı.',
    images: ['/images/yatak_odasi.png', '/evrensen/Aynalı Yatak Odası/WhatsApp Image 2025-09-01 at 11.43.59 (1).jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Doğal Meşe', 'Ceviz', 'Krem', 'Antrasit']
  },
  'evseren-ayca-yemek': {
    name: 'Ayça Yemek Odası Takımı',
    price: 71400,
    category: 'Yemek Odası',
    description: 'Ayça Serisi - Modern ve estetik açılır yemek masası, sandalyeler ve şık konsol takımı.',
    images: ['/images/yemek_odasi.png', '/evrensen/Aynalı Yemek Odası/WhatsApp Image 2025-09-01 at 11.44.04 (2).jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Ceviz', 'Doğal Meşe', 'Krem']
  },
  'evseren-buglem-yatak': {
    name: 'Buğlem Yatak Odası Takımı',
    price: 78400,
    category: 'Yatak Odası',
    description: 'Buğlem Serisi - Zarafetin ve yüksek konforun buluşma noktası. Özel kapitone başlık ve geniş gardırop.',
    images: ['/images/yatak_odasi.png', '/evrensen/Buğlem Yatak Odası/page1_img17.jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Krem', 'Antrasit', 'Ceviz']
  },
  'evseren-buglem-yemek': {
    name: 'Buğlem Yemek Odası Takımı',
    price: 72800,
    category: 'Yemek Odası',
    description: 'Buğlem Serisi - Şık tasarımıyla salonunuza estetik katan açılır masa ve konsol ünitesi.',
    images: ['/images/yemek_odasi.png', '/evrensen/Buğlem Yemek Odası/page1_img18.jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Krem', 'Ceviz', 'Antrasit']
  },
  'evseren-tokyo-yatak': {
    name: 'Tokyo Yatak Odası Takımı',
    price: 77000,
    category: 'Yatak Odası',
    description: 'Tokyo Serisi - Modern minimalist çizgileri ve fonksiyonel depolama alanlarıyla yeni nesil yatak odası.',
    images: ['/images/yatak_odasi.png'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Mat Siyah', 'Antrasit', 'Doğal Meşe']
  },
  'evseren-tokyo-yemek': {
    name: 'Tokyo Yemek Odası Takımı',
    price: 60900,
    category: 'Yemek Odası',
    description: 'Tokyo Serisi - Sade ve şık tasarımıyla huzurlu yemek alanları için ideal konsept.',
    images: ['/images/yemek_odasi.png'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Doğal Meşe', 'Mat Siyah', 'Ceviz']
  },
  'evseren-inci-yatak': {
    name: 'İnci Yatak Odası Takımı',
    price: 70000,
    category: 'Yatak Odası',
    description: 'İnci Serisi - Klasik ve modern tasarımın kusursuz uyumu.',
    images: ['/images/yatak_odasi.png', '/evrensen/İnci Yatak Odası/page1_img11.jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Krem', 'Beyaz Mermer', 'Altın Detaylı Beyaz']
  },
  'evseren-inci-yemek': {
    name: 'İnci Yemek Odası Takımı',
    price: 58800,
    category: 'Yemek Odası',
    description: 'İnci Serisi - Estetik ve dayanıklılığı bir araya getiren lüks yemek odası takımı.',
    images: ['/images/yemek_odasi.png', '/evrensen/İnci Yemek Odası/page1_img10.jpeg'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    colors: ['Krem', 'Altın Detaylı Beyaz', 'Ceviz']
  }
};

function resolveDefaultModel(item: any): string {
  if (item?.threeDModelUrl && String(item.threeDModelUrl).trim().endsWith('.glb')) {
    return item.threeDModelUrl;
  }
  const text = `${item?.name || ''} ${item?.category || ''}`.toLowerCase();
  if (text.includes('berjer') || text.includes('sandalye') || text.includes('tekli')) {
    return '/models/SheenChair.glb';
  }
  if (text.includes('koltuk') || text.includes('sofa')) {
    return '/models/GlamVelvetSofa.glb';
  }
  return '/models/SheenWoodLeatherSofa.glb';
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product: any = null;
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    try {
      product = await Promise.race([
        prisma.product.findUnique({ where: { id } }),
        new Promise((resolve) => setTimeout(() => resolve(null), 1000))
      ]);
    } catch {}
  }
  const item = product || CATALOG_DICT[id] || CATALOG_DICT['evseren-ayca-yatak'];
  return {
    title: `${item.name} | Qiens Home 3D`,
    description: item.description?.substring(0, 160) || 'Qiens Home 3D Mobilya Koleksiyonu'
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product: any = null;
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    try {
      product = await Promise.race([
        prisma.product.findUnique({
          where: { id },
          include: {
            reviews: {
              include: { user: { select: { name: true } } },
              orderBy: { createdAt: 'desc' }
            }
          }
        }),
        new Promise((resolve) => setTimeout(() => resolve(null), 1200))
      ]);
    } catch (e) {
      console.error("Product fetch error:", e);
    }
  }

  const fallback = CATALOG_DICT[id] || CATALOG_DICT['evseren-ayca-yatak'];
  const reviews = product?.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount 
    : 5;

  const productData = {
    id: product?.id || id,
    name: product?.name || fallback.name,
    category: product?.category || fallback.category,
    description: product?.description || fallback.description,
    price: product?.price || fallback.price,
    images: (product?.images && product.images.length > 0) ? product.images : fallback.images,
    colors: (product?.colors && product.colors.length > 0) ? product.colors : fallback.colors,
    threeDModelUrl: resolveDefaultModel(product || fallback),
    reviews: reviews.map((r: any) => ({
      ...r,
      createdAt: r.createdAt?.toISOString?.() || new Date().toISOString()
    })),
    averageRating,
    reviewCount,
    createdAt: product?.createdAt?.toISOString?.() || new Date().toISOString(),
  };

  // Google Schema.org / JSON-LD (E-ticaret arama optimizasyonu için)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://qienshome.com/product/${product.id}`,
      priceCurrency: 'TRY',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Qiens Home'
      }
    }
  };

  return (
    <>
      {/* Schema.org Script Enjeksiyonu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-48">
          <ProductDetailClient product={productData} />
        </div>
      </div>
    </>
  );
}
