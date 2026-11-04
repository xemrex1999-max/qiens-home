"use client"

import React, { useState } from 'react'
import { 
  Edit3, 
  Trash2, 
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import BannerModal from './BannerModal'

interface BannerTableClientProps {
  initialBanners: any[]
}

const BannerTableClient = ({ initialBanners }: BannerTableClientProps) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<any>(null)

  const handleEdit = (banner: any) => {
    setSelectedBanner(banner)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedBanner(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Bu banner'ı silmek istediğinize emin misiniz?`)) return

    try {
      const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Silme işlemi başarısız')
      
      toast.success('Banner silindi')
      router.refresh()
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const handleToggleActive = async (banner: any) => {
    try {
      const res = await fetch(`/api/hero/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive })
      })
      if (!res.ok) throw new Error('İşlem başarısız')
      
      toast.success(banner.isActive ? 'Banner gizlendi' : 'Banner aktif edildi')
      router.refresh()
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Banner Yönetimi</h1>
          <p className="text-sm text-neutral-400 font-medium">Toplam {initialBanners.length} kapak görseli mevcut.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl"
        >
          <Plus size={18} />
          Yeni Banner Ekle
        </button>
      </div>

      <div className="bg-white border border-neutral-100 rounded-[40px] overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Görsel / Bilgi</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Sıra</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Durum</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
               {initialBanners.map((banner: any) => (
                  <tr key={banner.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                           <div className="relative w-24 h-14 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                              <img 
                                 src={banner.image}
                                 alt={banner.title}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{banner.badge}</p>
                              <p className="text-sm font-bold text-neutral-900">{banner.title}</p>
                              <p className="text-[10px] text-neutral-400 truncate max-w-[200px]">{banner.sub}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <span className="text-sm font-bold text-neutral-900">
                           #{banner.order}
                        </span>
                     </td>
                     <td className="px-10 py-6">
                        <button 
                           onClick={() => handleToggleActive(banner)}
                           className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                              banner.isActive 
                              ? "bg-green-50 text-green-600 hover:bg-green-100" 
                              : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                           }`}
                        >
                           {banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                           {banner.isActive ? "Aktif" : "Gizli"}
                        </button>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleEdit(banner)}
                             className="p-3 bg-white border border-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all"
                            >
                              <Edit3 size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(banner.id)}
                             className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         
         {initialBanners.length === 0 && (
            <div className="py-32 text-center space-y-4">
               <ImageIcon size={48} className="mx-auto text-neutral-200" />
               <p className="text-sm font-bold text-neutral-400">Henüz hiç banner eklenmemiş.</p>
            </div>
         )}
      </div>

      <BannerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={selectedBanner}
      />
    </div>
  )
}

export default BannerTableClient
