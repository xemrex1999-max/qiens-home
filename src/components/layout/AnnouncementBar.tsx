import React from 'react'

const AnnouncementBar = () => {
  return (
    <div className="bg-[#0A0A0A] text-white py-2.5 px-6 md:px-12 fixed top-0 left-0 right-0 z-[60] border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em]">
        <div className="hidden md:flex items-center gap-6">
          <span className="text-accent flex items-center gap-2">
            <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            Türkiye Geneli Ücretsiz Nakliye & Kurulum
          </span>
          <span className="text-neutral-500 font-light">Pzt - Cmt: 09:00 - 18:00</span>
        </div>
        <div className="flex items-center gap-6 mx-auto md:mx-0">
          <a href="tel:905314602597" className="hover:text-accent transition-colors">+90 531 460 25 97</a>
          <a href="/track-order" className="hover:text-accent transition-colors hidden sm:inline text-accent">Sipariş Takibi</a>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar;
