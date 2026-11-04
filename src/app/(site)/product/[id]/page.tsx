import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (!product) return { title: 'Ürün Bulunamadı' };

  // SEO Etiketleri (Varsayılanlar ile birleştirilmiş)
  const defaultKeywords = ['inegöl mobilya', 'qiens home', 'kaliteli mobilya'];
  const allKeywords = product.tags && product.tags.length > 0 
    ? [...defaultKeywords, ...product.tags] 
    : defaultKeywords;

  return {
    title: `${product.name} | Qiens Home`,
    description: product.description.substring(0, 160),
    keywords: allKeywords.join(', '),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images && product.images[0] ? [product.images[0]] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://qienshome.com/product/${id}`, // Base URL
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!product) return notFound();

  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount 
    : 0;

  const productData = {
    ...product,
    id: product.id,
    price: product.price,
    images: product.images || [],
    reviews: reviews.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    })),
    averageRating,
    reviewCount,
    createdAt: product.createdAt.toISOString(),
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
