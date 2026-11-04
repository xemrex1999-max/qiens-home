import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ARClient from './ARClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Ürün Bulunamadı' };

  return {
    title: `${product.name} - AR Görünüm | Beyazıt Mobilyam`,
    description: `${product.name} modelini evinizde canlı olarak görüntüleyin.`
  };
}

export default async function ARPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return notFound();

  const productData = {
    id: product.id,
    name: product.name,
    threeDModelUrl: product.threeDModelUrl,
    image: product.images && product.images[0] ? product.images[0] : ''
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center">
      <ARClient product={productData} />
    </div>
  );
}
