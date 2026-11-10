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
    id: 'qiens-imparator-paket',
    name: 'İmparator Lüks Düğün Paketi',
    slug: 'imparator-dugun-paketi',
    price: 145000,
    category: 'Düğün Paketi',
    description: 'Koltuk takımı, yatak odası ve yemek odasını tek konseptte buluşturan Qiens Home imza koleksiyonu.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    colors: ['Zümrüt Yeşili', 'Safir Mavi', 'Krem', 'Antrasit'],
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
    createdAt: null,
  },
  {
    id: 'qiens-glam-velvet',
    name: 'Glam Velvet İnegöl Koltuk Takımı',
    slug: 'glam-velvet-koltuk',
    price: 64900,
    category: 'Koltuk Takımı',
    description: 'İtalyan kadife dokusu ve fırınlanmış gürgen iskeletiyle üst düzey konfor.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    colors: ['Zümrüt Yeşili', 'Safir Mavi', 'Kiremit', 'Bej'],
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
    createdAt: null,
  },
  {
    id: 'qiens-sheen-leather',
    name: 'Sheen Royal Deri & Ahşap Set',
    slug: 'sheen-royal-set',
    price: 78500,
    category: 'Yatak & Oturma Odası',
    description: 'Doğal ceviz ahşap gövde ve birinci sınıf deri döşeme.',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800'],
    colors: ['Ceviz', 'Kaba Taba Deri', 'Antik Kahve', 'Mat Siyah'],
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    createdAt: null,
  },
  {
    id: 'qiens-sheen-berjer',
    name: 'Qiens Özel Tasarım Tekli Berjer',
    slug: 'qiens-tekli-berjer',
    price: 18900,
    category: 'Berjer & Tamamlayıcı',
    description: 'Ergonomik sırt kavisi ve leke tutmayan dokuma kumaşıyla okuma ve dinlenme köşeleri için ideal.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'],
    colors: ['Kiremit', 'Zümrüt Yeşili', 'Krem', 'Antrasit'],
    threeDModelUrl: '/models/SheenChair.glb',
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

  // Fetch all products and ensure each has a valid 3D GLB model URL
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: {
        category: 'asc'
      }
    });
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
