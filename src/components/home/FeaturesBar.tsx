"use client"

import React from 'react'
import { Truck, ShieldCheck, CreditCard, RotateCcw, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <Truck size={32} strokeWidth={1.5} />,
    title: "ÜCRETSİZ NAKLİYE",
    desc: "Türkiye'nin her noktasına güvenli ve sigortalı sevkiyat sağlıyoruz."
  },
  {
    icon: <Wrench size={32} strokeWidth={1.5} />,
    title: "ÜCRETSİZ KURULUM",
    desc: "Uzman montaj ekibimizle profesyonel kurulum hizmeti sunuyoruz."
  },
  {
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    title: "2 YIL GARANTİ",
    desc: "Tüm ürünlerimiz Qiens Home kalite güvencesi altındadır."
  },
  {
    icon: <CreditCard size={32} strokeWidth={1.5} />,
    title: "6 TAKSİT İMKANI",
    desc: "Anlaşmalı bankalar ile vade farksız taksit avantajları."
  },
  {
    icon: <RotateCcw size={32} strokeWidth={1.5} />,
    title: "30 GÜN İADE",
    desc: "Memnuniyetiniz bizim önceliğimizdir, kolay iade süreci."
  }
]

const FeaturesBar = () => {
  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-px bg-transparent md:bg-neutral-100 md:border md:border-neutral-100 md:rounded-[2rem] md:overflow-hidden md:shadow-2xl md:shadow-neutral-100 no-scrollbar snap-x snap-mandatory pb-4">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-6 md:p-12 flex flex-col items-center text-center gap-6 md:gap-10 group hover:bg-neutral-50 transition-all duration-700 h-full relative w-[240px] md:w-auto flex-shrink-0 snap-start rounded-[2rem] md:rounded-none border border-neutral-100 md:border-none shadow-lg md:shadow-none"
            >
              <div className="p-4 md:p-8 rounded-full bg-neutral-50 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-sm">
                {feature.icon}
              </div>
              
              <div className="space-y-2 md:space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">
                  {feature.title}
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium leading-relaxed uppercase tracking-normal max-w-[200px] mx-auto opacity-80">
                  {feature.desc}
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-accent transition-all duration-1000 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesBar;
