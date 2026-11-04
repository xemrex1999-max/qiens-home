"use client"

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface BannerModalProps {
  isOpen: boolean
  onClose: () => void
  banner: any
}

const BannerModal = ({ isOpen, onClose, banner }: BannerModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    sub: '',
    image: '',
    link: '/products',
    linkText: 'Koleksiyonu Keşfet',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (banner) {
      setFormData({
        badge: banner.badge || '',
        title: banner.title || '',
        sub: banner.sub || '',
        image: banner.image || '',
        link: banner.link || '/products',
        linkText: banner.linkText || 'Koleksiyonu Keşfet',
        order: banner.order || 0,
        isActive: banner.isActive !== undefined ? banner.isActive : true
      })
    } else {
      setFormData({
        badge: '',
        title: '',
        sub: '',
        image: '',
        link: '/products',
        linkText: 'Koleksiyonu Keşfet',
        order: 0,
        isActive: true
      })
    }
  }, [banner, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = banner ? `/api/hero/${banner.id}` : '/api/hero'
      const method = banner ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('İşlem başarısız')

      toast.success(banner ? 'Banner güncellendi' : 'Banner eklendi')
      router.refresh()
      onClose()
    } catch (error) {
      toast.error('Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter text-neutral-900 uppercase">
                {banner ? 'Banner Düzenle' : 'Yeni Banner Ekle'}
              </h2>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Ana sayfa kapak görseli yönetimi</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-neutral-900 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Görsel URL</label>
                <input 
                  type="text" 
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Üst Başlık (Badge)</label>
                <input 
                  type="text" 
                  required
                  placeholder="YENİ KOLEKSİYON 2026"
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Ana Başlık</label>
                <input 
                  type="text" 
                  required
                  placeholder="Modern Yaşamın Yeni Estetiği"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Alt Açıklama</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Banner altında görünecek açıklama metni..."
                  value={formData.sub}
                  onChange={(e) => setFormData({...formData, sub: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Buton Yazısı</label>
                <input 
                  type="text" 
                  required
                  placeholder="Koleksiyonu Keşfet"
                  value={formData.linkText}
                  onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Buton Linki</label>
                <input 
                  type="text" 
                  required
                  placeholder="/products"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Sıralama</label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Görünür</span>
              </div>
            </div>

            {/* PREVIEW */}
            {formData.image && (
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-4">Önizleme</label>
                  <div className="relative w-full aspect-[21/9] bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-100">
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
               </div>
            )}
          </form>

          {/* FOOTER */}
          <div className="p-8 border-t border-neutral-100 bg-neutral-50/50 flex gap-4">
             <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-neutral-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-neutral-500 hover:bg-white transition-all"
             >
                İptal
             </button>
             <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[3] py-4 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
             >
                {loading ? (
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                   <Save size={18} />
                )}
                {banner ? 'Güncelle' : 'Kaydet'}
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BannerModal
