import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Users, Heart, ShieldCheck, Star, History, Target, PenTool as Tool } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen pt-44 pb-24">
      {/* HERO SECTION */}
      <section className="px-6 md:px-12 mb-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Tasarım Mirası</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter leading-[1.1]">
               İnegöl'ün <br/>
               <span className="italic font-light text-neutral-200 pl-8 md:pl-16">Mobilya Mirası.</span>
            </h1>
            <p className="text-base md:text-xl text-neutral-500 font-light max-w-xl leading-relaxed font-sans">
              30 yılı aşkın süredir, Türkiye'nin mobilya başkentinde başlayan yolculuğumuzda, estetik ve konforu bir araya getiren tasarımlar üretiyoruz. Küçük bir atölyede atılan ilk temelden, bugün binlerce eve konuk olan bir markaya dönüşürken değişmeyen tek şeyimiz; kaliteye olan tutkumuz oldu.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-neutral-50 rounded-sm -z-10 group-hover:bg-accent/5 transition-colors duration-700" />
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-[1500ms]">
              <Image 
                src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=1200" 
                alt="Workshop" 
                fill 
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[1500ms]"
                unoptimized={true}
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white p-8 hidden md:block shadow-xl">
               <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-secondary">
                 KURULUŞ 1996 <br/> İNEGÖL / BURSA
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - NUMBERED STANDARDS */}
      <section className="px-6 md:px-12 mb-48">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-neutral-100">
             
             {/* 01. PAST */}
             <div className="group relative p-12 md:p-20 border-b md:border-b-0 md:border-r border-neutral-100 hover:bg-neutral-50 transition-colors duration-700">
                <span className="text-8xl font-serif text-neutral-50 absolute top-10 right-10 group-hover:text-accent/10 transition-colors duration-700">01</span>
                <div className="relative space-y-8">
                   <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                      <History size={20} strokeWidth={1} />
                   </div>
                   <h3 className="text-3xl font-serif italic text-secondary">Geçmişimiz</h3>
                   <p className="text-sm text-neutral-500 leading-relaxed font-light">1990'lı yılların başında İnegöl'ün tozlu atölyelerinde filizlenen Beyazıt Mobilyam, geleneksel marangozluk sanatını modern üretim teknolojileriyle harmanlamıştır.</p>
                </div>
             </div>

             {/* 02. MISSION */}
             <div className="group relative p-12 md:p-20 border-b md:border-b-0 md:border-r border-neutral-100 hover:bg-neutral-50 transition-colors duration-700">
                <span className="text-8xl font-serif text-neutral-50 absolute top-10 right-10 group-hover:text-accent/10 transition-colors duration-700">02</span>
                <div className="relative space-y-8">
                   <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                      <Target size={20} strokeWidth={1} />
                   </div>
                   <h3 className="text-3xl font-serif italic text-secondary">Misyonumuz</h3>
                   <p className="text-sm text-neutral-500 leading-relaxed font-light">Sadece mobilya satmak değil, insanların yaşam alanlarına ruh ve konfor katmak. Herkesin ulaşabileceği kaliteli ve uzun ömürlü tasarımlar üretmek.</p>
                </div>
             </div>

             {/* 03. VISION */}
             <div className="group relative p-12 md:p-20 hover:bg-neutral-50 transition-colors duration-700">
                <span className="text-8xl font-serif text-neutral-50 absolute top-10 right-10 group-hover:text-accent/10 transition-colors duration-700">03</span>
                <div className="relative space-y-8">
                   <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                      <Star size={20} strokeWidth={1} />
                   </div>
                   <h3 className="text-3xl font-serif italic text-secondary">Vizyonumuz</h3>
                   <p className="text-sm text-neutral-500 leading-relaxed font-light">İnegöl'ün mobilya konusundaki ustalığını tüm Türkiye'ye ve dünyaya tanıtarak, tasarımda öncü ve güvenilir bir dünya markası olmak.</p>
                </div>
             </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
