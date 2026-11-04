import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Globe, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-32 pb-16 px-6 md:px-12 text-neutral-500 font-light relative overflow-hidden">
      {/* Decorative Branding Background */}
      <div className="absolute top-0 right-0 text-[300px] font-serif italic text-white/[0.02] pointer-events-none select-none translate-x-1/2 -translate-y-1/2">
        Qiens
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-32 relative z-10">
        {/* LOGO & BRAND HERITAGE */}
        <div className="lg:col-span-4 space-y-16">
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95 group">
              <div className="text-3xl font-serif text-white uppercase tracking-tighter">
                QİENS <span className="text-accent italic font-light lowercase">home</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-neutral-400 font-sans border-l border-white/10 pl-6">
              Modern yaşam alanlarınıza şıklık ve konfor katıyoruz. 30 yıllık tecrübemizle evinizi baştan yaratıyoruz. Detaylardaki kusursuzluk, bizim imzamızdır.
            </p>
          </div>

          <div className="flex gap-4">
            {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all duration-700">
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* NAVIGATION GRID */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-12">
          <div className="space-y-10">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Kategoriler</h4>
            <ul className="space-y-6 text-[10px] uppercase tracking-[0.2em]">
              <li><Link href="/products?cat=dugun" className="hover:text-accent transition-colors block">Düğün Paketleri</Link></li>
              <li><Link href="/products?cat=yatak" className="hover:text-accent transition-colors block">Yatak Odaları</Link></li>
              <li><Link href="/products?cat=yemek" className="hover:text-accent transition-colors block">Yemek Odaları</Link></li>
              <li><Link href="/products?cat=koltuk" className="hover:text-accent transition-colors block">Koltuk Takımları</Link></li>
              <li><Link href="/products?cat=kose" className="hover:text-accent transition-colors block">Köşe Takımları</Link></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Kurumsal</h4>
            <ul className="space-y-6 text-[10px] uppercase tracking-[0.2em]">
              <li><Link href="/hakkimizda" className="hover:text-accent transition-colors block">Hikayemiz</Link></li>
              <li><Link href="/iletisim" className="hover:text-accent transition-colors block">İletişim</Link></li>
              <li><Link href="/mesafeli-satis" className="hover:text-accent transition-colors block">Sözleşmeler</Link></li>
              <li><Link href="/teslimat-iade" className="hover:text-accent transition-colors block">Lojistik</Link></li>
              <li><Link href="/track-order" className="text-accent hover:brightness-110 transition-colors block">Sipariş Takibi</Link></li>
            </ul>
          </div>
        </div>

        {/* CONTACT & SECURITY */}
        <div className="lg:col-span-4 space-y-16">
          <div className="space-y-10">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Mağazamız</h4>
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <MapPin size={16} strokeWidth={1.5} />
                </div>
                <p className="text-xs leading-loose text-neutral-400 group-hover:text-white transition-colors">MAHMUDİYE MH. 14 MOB. NİL SK. NO:33<br />İNEGÖL / BURSA</p>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Phone size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <a href="tel:+905314602597" className="text-neutral-400 group-hover:text-white transition-colors text-xs tracking-widest">+90 531 460 25 97</a>
                  <a href="tel:+905077567887" className="text-neutral-400 group-hover:text-white transition-colors text-xs tracking-widest">+90 507 756 78 87</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* ETBIS & SECURITY */}
          <div className="flex items-center gap-8 border-t border-white/5 pt-12">
            <div className="p-4 bg-white rounded-xl shadow-xl">
               <img src="https://www.eticaret.gov.tr/Content/img/etbis_logo.png" alt="ETBIS" className="h-8 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            </div>
            <div className="space-y-1">
               <p className="text-white text-[9px] font-black uppercase tracking-widest">ETBİS SİSTEMİNE KAYITLIDIR</p>
               <p className="text-neutral-600 text-[8px] uppercase tracking-tighter">İnegöl'den Güvenli Sevkiyat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-white/5 mt-32 pt-12 flex flex-col md:flex-row items-center justify-between gap-12 text-[8px] font-black tracking-[0.5em] text-neutral-600">
        <div className="flex flex-col items-center md:items-start gap-4">
          <p>© 2026 QİENS HOME. YAŞAM İÇİN TASARLANDI.</p>
        </div>
        <div className="flex gap-10 items-center grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={30} height={15} className="brightness-200" />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={30} height={15} className="brightness-200" />
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-white text-[7px] tracking-[0.3em]">İNEGÖL'DE ÜRETİLDİ</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
