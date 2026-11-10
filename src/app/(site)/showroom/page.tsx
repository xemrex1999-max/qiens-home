import React from 'react';
import prisma from '@/lib/prisma';
import ShowroomClient from './ShowroomClient';
import { Metadata } from 'next';
import os from 'os';

export const metadata: Metadata = {
  title: '3D Sanal Showroom | Qiens Home',
  description: 'Qiens Home ürünlerini 3D etkileşimli stüdyomuzda inceleyin. Kumaş renklerini değiştirin, 3D detayları inceleyin ve odanızda (AR) görün.',
  keywords: ['3d showroom', 'sanal mağaza', 'metaverse mobilya', 'qiens home 3d', 'artırılmış gerçeklik', 'inegöl mobilya'],
  alternates: {
    canonical: 'https://qienshome.com/showroom',
  }
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      const family = iface.family;
      if ((family === 'IPv4' || (typeof family === 'string' && family.includes('4'))) && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export const dynamic = 'force-dynamic';

const FALLBACK_SHOWROOM_PRODUCTS = [
  {
    id: 'evseren-ayca-yatak',
    name: 'Ayça Yatak Odası Takımı',
    slug: 'ayca-yatak-odasi',
    price: 75600,
    category: 'Yatak Odası',
    description: 'Ayça Serisi - 2026 Model Premium Yatak Odası Takımı. Masif iskelet, baza ve şık komodin tasarımı.',
    images: ['/images/yatak_odasi.png', '/evrensen/Aynalı Yatak Odası/WhatsApp Image 2025-09-01 at 11.43.59 (1).jpeg'],
    colors: ['Doğal Meşe', 'Ceviz', 'Krem', 'Antrasit'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-ayca-yemek',
    name: 'Ayça Yemek Odası Takımı',
    slug: 'ayca-yemek-odasi',
    price: 71400,
    category: 'Yemek Odası',
    description: 'Ayça Serisi - Modern ve estetik açılır yemek masası, sandalyeler ve şık konsol takımı.',
    images: ['/images/yemek_odasi.png', '/evrensen/Aynalı Yemek Odası/WhatsApp Image 2025-09-01 at 11.44.04 (2).jpeg'],
    colors: ['Ceviz', 'Doğal Meşe', 'Krem', 'Beyaz Mermer'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-buglem-yatak',
    name: 'Buğlem Yatak Odası Takımı',
    slug: 'buglem-yatak-odasi',
    price: 78400,
    category: 'Yatak Odası',
    description: 'Buğlem Serisi - Zarafetin ve yüksek konforun buluşma noktası. Özel kapitone başlık ve geniş gardırop.',
    images: ['/images/yatak_odasi.png', '/evrensen/Buğlem Yatak Odası/page1_img17.jpeg'],
    colors: ['Krem', 'Antrasit', 'Ceviz', 'Zümrüt Yeşili'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-buglem-yemek',
    name: 'Buğlem Yemek Odası Takımı',
    slug: 'buglem-yemek-odasi',
    price: 72800,
    category: 'Yemek Odası',
    description: 'Buğlem Serisi - Şık tasarımıyla salonunuza estetik katan açılır masa ve konsol ünitesi.',
    images: ['/images/yemek_odasi.png', '/evrensen/Buğlem Yemek Odası/page1_img18.jpeg'],
    colors: ['Krem', 'Ceviz', 'Antrasit'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-tokyo-yatak',
    name: 'Tokyo Yatak Odası Takımı',
    slug: 'tokyo-yatak-odasi',
    price: 77000,
    category: 'Yatak Odası',
    description: 'Tokyo Serisi - Modern minimalist çizgileri ve fonksiyonel depolama alanlarıyla yeni nesil yatak odası.',
    images: ['/images/yatak_odasi.png'],
    colors: ['Mat Siyah', 'Antrasit', 'Doğal Meşe', 'Krem'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-tokyo-yemek',
    name: 'Tokyo Yemek Odası Takımı',
    slug: 'tokyo-yemek-odasi',
    price: 60900,
    category: 'Yemek Odası',
    description: 'Tokyo Serisi - Sade ve şık tasarımıyla huzurlu yemek alanları için ideal konsept.',
    images: ['/images/yemek_odasi.png'],
    colors: ['Doğal Meşe', 'Mat Siyah', 'Ceviz'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-inci-yatak',
    name: 'İnci Yatak Odası Takımı',
    slug: 'inci-yatak-odasi',
    price: 70000,
    category: 'Yatak Odası',
    description: 'İnci Serisi - Klasik ve modern tasarımın kusursuz uyumu.',
    images: ['/images/yatak_odasi.png', '/evrensen/İnci Yatak Odası/page1_img11.jpeg'],
    colors: ['Krem', 'Beyaz Mermer', 'Altın Detaylı Beyaz'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'evseren-inci-yemek',
    name: 'İnci Yemek Odası Takımı',
    slug: 'inci-yemek-odasi',
    price: 58800,
    category: 'Yemek Odası',
    description: 'İnci Serisi - Estetik ve dayanıklılığı bir araya getiren lüks yemek odası takımı.',
    images: ['/images/yemek_odasi.png', '/evrensen/İnci Yemek Odası/page1_img10.jpeg'],
    colors: ['Krem', 'Altın Detaylı Beyaz', 'Ceviz'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  }
];

function resolveDefault3DModel(product: any): string {
  if (product.threeDModelUrl && String(product.threeDModelUrl).trim().endsWith('.glb')) {
    return product.threeDModelUrl;
  }
  const text = `${product.name || ''} ${product.category || ''}`.toLowerCase();
  if (text.includes('berjer') || text.includes('tekli') || text.includes('sandalye')) {
    return '/models/SheenChair.glb';
  }
  if (text.includes('yatak') || text.includes('yemek') || text.includes('masa') || text.includes('ceviz') || text.includes('deri')) {
    return '/models/SheenWoodLeatherSofa.glb';
  }
  return '/models/GlamVelvetSofa.glb';
}

export default async function ShowroomPage() {
  const localIp = getLocalIp();

  // Fetch all products with a strict 1200ms timeout so slow DB never delays or blocks 3D Showroom
  let products: any[] = [];
  try {
    products = await Promise.race([
      prisma.product.findMany({
        orderBy: { category: 'asc' }
      }),
      new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1200))
    ]);
  } catch (error) {
    console.error("Showroom products fetch error:", error);
  }

  const serializedProducts = (products && products.length > 0)
    ? products.map(product => ({
        ...product,
        id: product.id,
        price: product.price,
        images: product.images || [],
        colors: product.colors && product.colors.length > 0 ? product.colors : ["Zümrüt Yeşili", "Safir Mavi", "Krem", "Antrasit"],
        threeDModelUrl: resolveDefault3DModel(product),
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
      }))
    : FALLBACK_SHOWROOM_PRODUCTS;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-12">
      <ShowroomClient initialProducts={serializedProducts} localIp={localIp} />
    </div>
  );
}
