import React from 'react';
import prisma from '@/lib/prisma';
import ProductListClient from '@/components/product/ProductListClient';
import { getCategoryNameBySlug, getCategoryValueBySlug } from '@/constants/categories';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; search?: string }>;
}) {
  const { cat, search } = await searchParams;
  let products: any[] = [];
  
  try {
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (cat && cat !== "all") {
      whereClause.category = getCategoryValueBySlug(cat);
    }

    products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("ProductsPage database error:", error);
  }

  const title = search 
    ? `Arama: ${search}` 
    : (cat && cat !== "all" ? getCategoryNameBySlug(cat) : "TÜM KOLEKSİYON");

  return (
    <div className="bg-white min-h-screen pt-44 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-20 flex flex-col lg:flex-row items-end justify-between gap-12 border-b border-neutral-100 pb-12">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">TASARIM SANATI</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter leading-[1.1]">
              {title.split(' ')[0]} <br/>
              <span className="italic font-light text-neutral-300 pl-8 md:pl-16">
                {title.split(' ').slice(1).join(' ') || "KOLEKSİYONU"}
              </span>
            </h1>
          </div>
          
          <div className="lg:text-right space-y-6 max-w-sm">
             <div className="inline-block px-4 py-2 border border-accent/20 rounded-full">
                <span className="text-[8px] font-black uppercase tracking-widest text-accent">SINIRLI SAYIDA 2026</span>
             </div>
             <p className="text-sm text-neutral-400 font-light leading-relaxed">
               {search 
                 ? `${search} için en seçkin sonuçlar kürate edildi.` 
                 : "İnegöl'ün köklü zanaat kültürünü, modern yaşam dünyasının rafine estetiğiyle buluşturan özel seçkimiz."}
             </p>
          </div>
        </div>

        <ProductListClient 
          initialProducts={JSON.parse(JSON.stringify(products))} 
          initialCategory={cat || "all"}
        />
      </div>
    </div>
  );
}
