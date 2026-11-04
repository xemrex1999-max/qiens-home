import HeroSection from "@/components/home/HeroSection";
import FeaturesBar from "@/components/home/FeaturesBar";
import CategoryCards from "@/components/home/CategoryCards";
import HomeProductGrid from "@/components/home/HomeProductGrid";
import Testimonials from "@/components/home/Testimonials";
import VideoCommerce from "@/components/home/VideoCommerce";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <FeaturesBar />
      
      <Suspense fallback={
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-neutral-200 border-t-accent rounded-full animate-spin" />
        </div>
      }>
        <div className="bg-white py-12 md:py-16 relative overflow-hidden">
          {/* DECORATIVE BACKGROUND TEXT */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[140px] font-serif italic text-neutral-50/30 pointer-events-none select-none -z-10 whitespace-nowrap">
            Exclusive Selection
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 flex flex-col items-center text-center space-y-8 relative">
             <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="w-8 h-[1px] bg-accent"></div>
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-accent">Sezonun En Popülerleri</span>
                <div className="w-8 h-[1px] bg-accent"></div>
             </div>
             
             <div className="relative">
                <h2 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase leading-none bg-cover bg-center bg-clip-text text-transparent animate-in zoom-in-95 duration-1000"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')" }}>
                  İkonik <br/> Modeller
                </h2>
                {/* Subtle Glow behind text */}
                <div className="absolute -inset-4 bg-accent/5 blur-3xl -z-10 rounded-full"></div>
             </div>
             
             <p className="max-w-xl text-neutral-400 font-light text-sm md:text-base leading-relaxed font-sans tracking-wide">
                Zamanın ötesinde tasarımlar, ustalığın zirvesindeki işçilikle buluşuyor. Evinizin ruhunu değiştirecek en özel seçkilerimizi keşfedin.
             </p>
          </div>
          
          <div className="max-w-screen-2xl mx-auto px-4 md:px-12">
            <HomeProductGrid />
          </div>
        </div>
      </Suspense>

      <CategoryCards />

      <VideoCommerce />

      <Testimonials />

      {/* ABOUT PREVIEW SECTION - REDESIGNED FOR BEYAZIT MOBILYAM */}
      <section className="py-12 md:py-32 bg-white px-4 md:px-12 relative overflow-hidden">
        {/* Dekoratif Dikey Yazı */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[180px] font-black text-neutral-50/80 uppercase tracking-tighter pointer-events-none select-none hidden lg:block">
          QIENS
        </div>
        
        <div className="max-w-7xl mx-auto relative px-4 sm:px-0">
          <div className="flex flex-col lg:flex-row items-center gap-0">
            
            {/* SOL TARAF: METİN BLOĞU */}
            <div className="w-full lg:w-1/2 lg:pr-20 z-20 order-2 lg:order-1 mt-12 lg:mt-0">
                <div className="space-y-10 p-8 md:p-12 lg:p-0 bg-white/80 backdrop-blur-sm lg:bg-transparent">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[2px] bg-accent"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent">Legacy of Quality</span>
                        </div>
                        <h2 className="text-3xl md:text-7xl lg:text-[100px] font-serif text-secondary leading-none tracking-tight mobile-title-wrap">
                            İşçiliğin <br /> 
                            <span className="text-neutral-200 italic font-light sm:ml-12">Ruhuna Dokunun.</span>
                        </h2>
                    </div>
                
                    <p className="text-base md:text-lg font-light text-neutral-500 leading-relaxed max-w-md font-sans border-l-2 border-accent/20 pl-8">
                        30 yıllık tecrübemizi, modern tasarımın keskin hatlarıyla birleştirdik. Sizin için sadece bir eşya değil, nesilden nesile aktarılacak bir miras tasarlıyoruz. Detaylardaki kusursuzluk, Qiens Home'un imzasıdır.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 pt-6">
                        <Link 
                            href="/hakkimizda" 
                            className="bg-secondary text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                        >
                            Hikayemiz
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-serif italic text-accent">2026</div>
                            <div className="h-10 w-[1px] bg-neutral-200"></div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Yeni Koleksiyon <br/> Özel Tasarım</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ TARAF: GÖRSEL BLOĞU */}
            <div className="w-full lg:w-3/5 relative order-1 lg:order-2">
                <div className="relative aspect-[16/10] lg:aspect-[4/5] rounded-[100px_0_100px_40px] md:rounded-[200px_0_200px_40px] overflow-hidden shadow-[0_80px_100px_-20px_rgba(0,0,0,0.15)] group">
                    <Image 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
                        alt="Luxury Interior"
                        fill
                        className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-secondary/5 group-hover:bg-transparent transition-colors duration-1000" />
                    
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                        <div className="glass p-10 rounded-full shadow-2xl border border-white/50 rotate-12 hover:rotate-0 transition-transform duration-700">
                             <div className="text-center">
                                <span className="block text-4xl font-serif text-secondary">A+</span>
                                <span className="block text-[8px] font-black uppercase tracking-widest text-accent">Kalite Standartı</span>
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER PREVIEW */}
      <section className="py-24 bg-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Fırsatlardan Haberdar Olun</h2>
            <p className="text-neutral-400 font-light tracking-wide text-sm md:text-base">Yeni koleksiyonlar ve özel kampanyalar için e-bültenimize abone olun.</p>
          </div>
          <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-full text-sm outline-none focus:border-accent transition-colors"
            />
            <button className="bg-accent text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
