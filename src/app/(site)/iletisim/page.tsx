import React from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen pt-44 pb-24 font-light">
      {/* HERO SECTION */}
      <section className="px-6 md:px-12 mb-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end border-b border-neutral-100 pb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Tasarım Diyaloğu</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter leading-[1.1]">
               Bize <br/>
               <span className="italic font-light text-neutral-300 pl-8 md:pl-16">Ulaşın.</span>
            </h1>
          </div>
          
          <div className="lg:text-right space-y-6 max-w-sm">
             <p className="text-sm text-neutral-400 font-light leading-relaxed">
               Projeleriniz, talepleriniz veya sorularınız için profesyonel ekibimiz size eşlik etmeye hazır. Bize dilediğiniz kanaldan ulaşabilirsiniz.
             </p>
          </div>
        </div>
      </section>

      {/* CONTACT INFO & FORM */}
      <section className="px-6 md:px-12 mb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* INFO COLUMN - MINIMALIST CARDS */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100 overflow-hidden">
              
              <div className="bg-white p-12 space-y-6 group hover:bg-neutral-50 transition-colors duration-500">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">01. Telefon</span>
                <div className="space-y-2">
                  <p className="text-lg text-secondary font-serif italic">+90 531 460 25 97</p>
                  <p className="text-neutral-400 text-xs">Müşteri Destek Hattı</p>
                </div>
              </div>

              <div className="bg-white p-12 space-y-6 group hover:bg-neutral-50 transition-colors duration-500">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">02. E-posta</span>
                <div className="space-y-2">
                  <p className="text-lg text-secondary font-serif italic">info@qienshome.com</p>
                  <p className="text-neutral-400 text-xs">Genel Sorular</p>
                </div>
              </div>

              <div className="bg-white p-12 space-y-6 group hover:bg-neutral-50 transition-colors duration-500">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">03. Atölye</span>
                <div className="space-y-2 leading-relaxed">
                  <p className="text-lg text-secondary font-serif italic">İnegöl / BURSA</p>
                  <p className="text-neutral-400 text-xs">Mahmudiye Mh. 14 Mob. Nil Sk. No:33</p>
                </div>
              </div>

              <div className="bg-white p-12 space-y-6 group hover:bg-neutral-50 transition-colors duration-500">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">04. Çalışma Saatleri</span>
                <div className="space-y-2">
                  <p className="text-lg text-secondary font-serif italic">09:00 - 18:00</p>
                  <p className="text-neutral-400 text-xs">Pazartesi - Cumartesi</p>
                </div>
              </div>

            </div>

            <div className="relative aspect-video grayscale hover:grayscale-0 transition-all duration-[1500ms] shadow-2xl">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.1345078976838!2d29.527497975809286!3d40.072411671497015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cbc94134b45d8b%3A0xd12165ded5c0aba!2sevseren%20MOB%C4%B0LYA!5e0!3m2!1str!2str!4v1712360000000!5m2!1str!2str" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy" 
                 className="absolute inset-0"
               />
            </div>
          </div>

          {/* FORM COLUMN - CLEAN LUXE */}
          <div className="bg-secondary p-12 lg:p-24 text-white relative overflow-hidden">
            <span className="absolute top-0 right-0 text-[20vw] font-serif text-white/[0.02] pointer-events-none select-none -translate-y-1/2 translate-x-1/4">
              Form
            </span>
            
            <div className="relative z-10 space-y-16">
              <div className="space-y-4">
                 <h2 className="text-4xl font-serif italic">İletişim Formu</h2>
                 <p className="text-white/40 text-sm max-w-xs">Tüm başvurular 24 saat içerisinde yanıtlanmaktadır.</p>
              </div>

              <form className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-accent">Ad Soyad</label>
                    <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-base focus:border-accent outline-none transition-colors placeholder:text-white/10" placeholder="İsim Soyisim" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-accent">Telefon</label>
                    <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-base focus:border-accent outline-none transition-colors placeholder:text-white/10" placeholder="+90" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-accent">E-posta</label>
                  <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 text-base focus:border-accent outline-none transition-colors placeholder:text-white/10" placeholder="E-posta adresi" />
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-accent">Mesaj</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-4 text-base focus:border-accent outline-none transition-colors resize-none placeholder:text-white/10" placeholder="Size nasıl yardımcı olabiliriz?" />
                </div>

                <button className="px-16 py-6 bg-white text-secondary font-black text-[10px] tracking-[0.4em] uppercase hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-6 group">
                  GÖNDER <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* WHATSAPP CTA - FLOATING LUXE */}
      <section className="px-6 md:px-12 mb-24">
        <div className="max-w-[1400px] mx-auto bg-neutral-50 p-12 md:p-24 border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-12 group hover:bg-white hover:shadow-2xl transition-all duration-700">
          <div className="space-y-6 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#25D366]">Doğrudan Destek</span>
            <h2 className="text-4xl md:text-6xl font-serif text-secondary tracking-tighter">Anında Destek Hattı</h2>
            <p className="text-neutral-400 font-light max-w-md">Uzman danışmanlarımızla WhatsApp üzerinden hemen görüşmeye başlayın.</p>
          </div>
          <a 
            href="https://wa.me/905314602597" 
            target="_blank"
            className="px-16 py-6 bg-secondary text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-[#25D366] transition-all shadow-xl"
          >
            WhatsApp Danışmanı
          </a>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
