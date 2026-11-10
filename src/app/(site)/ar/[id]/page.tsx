import React from 'react';
import prisma from '@/lib/prisma';
import ARClient from './ARClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const FALLBACK_AR_MAP: Record<string, { name: string; threeDModelUrl: string; image: string }> = {
  'qiens-imparator-paket': {
    name: 'İmparator Lüks Düğün Paketi',
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  },
  'qiens-glam-velvet': {
    name: 'Glam Velvet İnegöl Koltuk Takımı',
    threeDModelUrl: '/models/GlamVelvetSofa.glb',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  },
  'qiens-sheen-leather': {
    name: 'Sheen Royal Deri & Ahşap Set',
    threeDModelUrl: '/models/SheenWoodLeatherSofa.glb',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
  },
  'qiens-sheen-berjer': {
    name: 'Qiens Özel Tasarım Tekli Berjer',
    threeDModelUrl: '/models/SheenChair.glb',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
  },
};

function resolveARModel(product: any): string {
  if (product?.threeDModelUrl && String(product.threeDModelUrl).trim().endsWith('.glb')) {
    return product.threeDModelUrl;
  }
  const text = `${product?.name || ''} ${product?.category || ''}`.toLowerCase();
  if (text.includes('berjer') || text.includes('tekli')) return '/models/SheenChair.glb';
  if (text.includes('yatak') || text.includes('yemek') || text.includes('ceviz') || text.includes('deri')) {
    return '/models/SheenWoodLeatherSofa.glb';
  }
  return '/models/GlamVelvetSofa.glb';
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `3D & AR Görünüm | Qiens Home`,
    description: `Qiens Home modelini (${id}) evinizde 3 boyutlu olarak görüntüleyin.`
  };
}

export default async function ARPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;

  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    try {
      product = await Promise.race([
        prisma.product.findUnique({ where: { id } }),
        new Promise((resolve) => setTimeout(() => resolve(null), 1200)),
      ]);
    } catch {}
  }

  const fb = FALLBACK_AR_MAP[id] || FALLBACK_AR_MAP['qiens-imparator-paket'];
  const productData = {
    id: product?.id || id,
    name: product?.name || fb.name,
    threeDModelUrl: product ? resolveARModel(product) : fb.threeDModelUrl,
    image: (product?.images && product.images[0]) ? product.images[0] : fb.image,
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center">
      <ARClient product={productData} />
    </div>
  );
}
