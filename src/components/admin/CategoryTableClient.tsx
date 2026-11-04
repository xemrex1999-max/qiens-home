"use client"

import React, { useState } from 'react'
import { 
  Edit3, 
  Trash2, 
  Plus,
  Grid,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CategoryModal from './CategoryModal'

interface CategoryTableClientProps {
  initialCategories: any[]
}

const CategoryTableClient = ({ initialCategories }: CategoryTableClientProps) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} koleksiyon kartını silmek istediğinize emin misiniz?`)) return

    try {
      const res = await fetch(`/api/home-categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Silme işlemi başarısız')
      
      toast.success('Kategori silindi')
      router.refresh()
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const handleToggleActive = async (category: any) => {
    try {
      const res = await fetch(`/api/home-categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !category.isActive })
      })
      if (!res.ok) throw new Error('İşlem başarısız')
      
      toast.success(category.isActive ? 'Kategori gizlendi' : 'Kategori aktif edildi')
      router.refresh()
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Koleksiyon Kartları</h1>
          <p className="text-sm text-neutral-400 font-medium">Ana sayfadaki {initialCategories.length} kategori kartı.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl"
        >
          <Plus size={18} />
          Yeni Kart Ekle
        </button>
      </div>

      <div className="bg-white border border-neutral-100 rounded-[40px] overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Kategori / Görsel</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Slug / Açıklama</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Sıra</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Durum</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
               {initialCategories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                           <div className="relative w-16 h-16 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                              <img 
                                 src={cat.image}
                                 alt={cat.name}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-neutral-900">{cat.name}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <div className="space-y-1">
                           <p className="text-[10px] text-neutral-400 font-bold tracking-widest">URL: {cat.slug}</p>
                           <p className="text-xs text-neutral-500 font-bold">{cat.desc}</p>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <span className="text-sm font-bold text-neutral-900">
                           #{cat.order}
                        </span>
                     </td>
                     <td className="px-10 py-6">
                        <button 
                           onClick={() => handleToggleActive(cat)}
                           className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                              cat.isActive 
                              ? "bg-green-50 text-green-600 hover:bg-green-100" 
                              : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                           }`}
                        >
                           {cat.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                           {cat.isActive ? "Aktif" : "Gizli"}
                        </button>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleEdit(cat)}
                             className="p-3 bg-white border border-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all"
                            >
                              <Edit3 size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(cat.id, cat.name)}
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
         
         {initialCategories.length === 0 && (
            <div className="py-32 text-center space-y-4">
               <Grid size={48} className="mx-auto text-neutral-200" />
               <p className="text-sm font-bold text-neutral-400">Henüz hiç kategori kartı eklenmemiş.</p>
            </div>
         )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  )
}

export default CategoryTableClient
