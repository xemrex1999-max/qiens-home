"use client"

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: any
}

const CategoryModal = ({ isOpen, onClose, category }: CategoryModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    desc: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        image: category.image || '',
        desc: category.desc || '',
        order: category.order || 0,
        isActive: category.isActive !== undefined ? category.isActive : true
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        image: '',
        desc: '',
        order: 0,
        isActive: true
      })
    }
  }, [category, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = category ? `/api/home-categories/${category.id}` : '/api/home-categories'
      const method = category ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('İşlem başarısız')

      toast.success(category ? 'Kategori güncellendi' : 'Kategori eklendi')
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
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tighter text-neutral-900 uppercase">
              {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Kartı'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-4">Kategori Adı</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  placeholder="Örn: Yatak Odası"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-4">Slug (URL)</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  placeholder="Örn: yatak-odasi"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-4">Görsel URL</label>
                <input 
                  type="text" 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 transition-all transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-4">Kısa Açıklama</label>
                <input 
                  type="text" 
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  placeholder="Örn: Modern ve Şık Tasarımlar"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-4">Sıralama</label>
                  <input 
                    type="number" 
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  />
                </div>
                <div className="flex items-end pb-2">
                   <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       formData.isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"
                    }`}
                   >
                     {formData.isActive ? "Aktif" : "Gizli"}
                   </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 transition-all"
              >
                İptal
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                {category ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CategoryModal
