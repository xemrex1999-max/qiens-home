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

export default async function ShowroomPage() {
  const localIp = getLocalIp();

  // Fetch all products that have a 3D model configured
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        threeDModelUrl: {
          not: null
        }
      },
      orderBy: {
        category: 'asc'
      }
    });
  } catch (error) {
    console.error("Showroom products fetch error:", error);
  }

  // Convert mongoose object IDs and dates to plain serializable formats
  const serializedProducts = products.map(product => ({
    ...product,
    id: product.id,
    price: product.price,
    images: product.images || [],
    colors: product.colors || ["Varsayılan"],
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
  }));

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-12">
      <ShowroomClient initialProducts={serializedProducts} localIp={localIp} />
    </div>
  );
}
