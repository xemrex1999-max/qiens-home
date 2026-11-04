import React from 'react'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ui/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const HomeProductGrid = async () => {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 8
    })
  } catch (error) {
    console.error("HomeProductGrid database error:", error)
  }

  return (
    <section className="py-12 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 mb-10 md:mb-20 border-b border-neutral-100 pb-6 md:pb-12">
          <div className="max-w-xl space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary block">YENİ GELENLER</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 leading-tight uppercase">
              SEZONUN EN <span className="text-accent italic">POPÜLERLERİ</span>
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black bg-accent px-10 py-4 rounded-full hover:bg-secondary hover:text-white transition-all duration-300"
          >
            TÜM TASARIMLARI GÖR
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 md:gap-x-8 gap-y-10 md:gap-y-24 no-scrollbar snap-x snap-mandatory pb-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <div key={product.id} className="w-[220px] sm:w-[280px] lg:w-auto flex-shrink-0 snap-start">
                <ProductCard product={JSON.parse(JSON.stringify(product))} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center space-y-4">
               <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.4em] italic">Sezon koleksiyonu hazırlanıyor...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeProductGrid;
