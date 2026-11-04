"use client"

import React, { useState } from 'react'
import { 
  Edit3, 
  Trash2, 
  ExternalLink,
  Plus,
  Search,
  Filter,
  Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ProductModal from './ProductModal'

interface ProductTableClientProps {
  initialProducts: any[]
}

const ProductTableClient = ({ initialProducts }: ProductTableClientProps) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} ürününü silmek istediğinize emin misiniz?`)) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Silme işlemi başarısız')
      
      toast.success('Ürün silindi')
      router.refresh()
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Ürün Yönetimi</h1>
          <p className="text-sm text-neutral-400 font-medium">Toplam {initialProducts.length} ürün yayında.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl"
        >
          <Plus size={18} />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
               type="text" 
               placeholder="Ürün adı veya kategori ara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-16 pr-6 py-5 bg-white border border-neutral-100 rounded-3xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
            />
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-4 bg-white border border-neutral-100 rounded-3xl text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-all flex items-center gap-2">
               <Filter size={18} />
               Filtrele
            </button>
         </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white border border-neutral-100 rounded-[40px] overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Ürün</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Kategori</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Fiyat</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Stok</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
               {filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                           <div className="relative w-16 h-16 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                              <Image 
                                 src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
                                 alt={product.name}
                                 fill
                                 className="object-cover"
                              />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-neutral-900">{product.name}</p>
                              <Link href={`/product/${product.id}`} className="text-[10px] text-neutral-400 hover:text-neutral-900 flex items-center gap-1">
                                 Sitede Gör <ExternalLink size={10} />
                              </Link>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <span className="px-4 py-1 bg-neutral-100 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500">
                           {product.category}
                        </span>
                     </td>
                     <td className="px-10 py-6">
                        <div className="space-y-1">
                           {product.oldPrice && (
                             <p className="text-xs font-medium text-neutral-400 line-through">{formatPrice(product.oldPrice)}</p>
                           )}
                           <p className="text-sm font-black text-neutral-900">{formatPrice(product.price)}</p>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <span className={cn(
                           "text-sm font-bold",
                           product.stock > 10 ? "text-neutral-900" : "text-amber-600"
                        )}>
                           {product.stock} Adet
                        </span>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleEdit(product)}
                             className="p-3 bg-white border border-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all"
                            >
                              <Edit3 size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(product.id, product.name)}
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
         
         {filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-4">
               <Package size={48} className="mx-auto text-neutral-200" />
               <p className="text-sm font-bold text-neutral-400">Ürün bulunamadı.</p>
            </div>
         )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

export default ProductTableClient
