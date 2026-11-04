"use client"

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/constants/categories'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any // If provided, we are in EDIT mode
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [colors, setColors] = useState<string[]>([])
  const [colorInput, setColorInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    category: 'DEKORASYON', // Default category
    material: '',
    dimensions: '',
    warranty: '',
    isFeatured: false,
    threeDModelUrl: '',
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        oldPrice: product.oldPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || 'DEKORASYON',
        material: product.material || '',
        dimensions: product.dimensions || '',
        warranty: product.warranty || '',
        isFeatured: product.isFeatured || false,
        threeDModelUrl: product.threeDModelUrl || '',
      })
      setImages(product.images || [])
      setTags(product.tags || [])
      setColors(product.colors || [])
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        oldPrice: '',
        stock: '',
        category: 'DEKORASYON',
        material: '',
        dimensions: '',
        warranty: '',
        isFeatured: false,
        threeDModelUrl: '',
      })
      setImages([])
      setTags([])
      setColors([])
    }
  }, [product, isOpen])

  if (!isOpen) return null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Cloudinary setup (requires env variables)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary API ayarları eksik. Lütfen .env dosyanızı kontrol edin.')
      return
    }

    setUploadingImage(true)
    
    const uploadSingleFile = async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        return data.secure_url || null
      } catch (error) {
        console.error('Single file upload error:', error)
        return null
      }
    }

    try {
      const uploadPromises = Array.from(files).map(file => uploadSingleFile(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      
      const validUrls = uploadedUrls.filter((url): url is string => url !== null)
      
      if (validUrls.length > 0) {
        setImages(prev => [...prev, ...validUrls])
        toast.success(`${validUrls.length} görsel başarıyla yüklendi`)
      }

      if (validUrls.length < files.length) {
        toast.error(`${files.length - validUrls.length} görsel yüklenemedi`)
      }
    } catch (error) {
      toast.error('Görsel yükleme işlemi sırasında bir hata oluştu')
    } finally {
      setUploadingImage(false)
      // Reset input value so same files can be selected again if needed
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim()
      if (t && !tags.includes(t)) {
        setTags([...tags, t])
        setTagInput('')
      }
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove))
  }

  const handleAddColor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && colorInput.trim()) {
      e.preventDefault()
      if (!colors.includes(colorInput.trim())) {
        setColors([...colors, colorInput.trim()])
      }
      setColorInput('')
    }
  }

  const removeColor = (indexToRemove: number) => {
    setColors(colors.filter((_, i) => i !== indexToRemove))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = product 
        ? `/api/products/${product.id}` 
        : '/api/products'
      
      const method = product ? 'PATCH' : 'POST'

      const finalSlug = formData.slug || generateSlug(formData.name)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: finalSlug,
          images,
          tags,
          colors,
        }),
      })

      if (!response.ok) throw new Error('İşlem başarısız oldu')

      toast.success(product ? 'Ürün güncellendi' : 'Ürün eklendi')
      onClose()
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative">
        {/* HEADER */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-8 border-b border-neutral-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter text-neutral-900 uppercase">
              {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <p className="text-xs text-neutral-400 font-medium">Lütfen tüm alanları eksiksiz doldurun.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Ürün Adı</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                placeholder="Örn: Ayça Yatak Odası"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Slug (URL)</label>
              <input 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                placeholder="Bos bırakırsanız isimden oluşturulur"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Kategori</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">İndirimsiz Fiyat (Opsiyonel)</label>
                <input 
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Satış Fiyatı (TL)</label>
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Stok Adedi</label>
                <input 
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Ürün Açıklaması</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none resize-none"
              placeholder="Ürünün özelliklerini detaylıca yazın..."
            />
          </div>

          {/* TECHNICAL SPECS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-neutral-50 rounded-[32px] border border-neutral-100">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Malzeme</label>
                <input 
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="MDF / Gürgen..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Ölçüler</label>
                <input 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="G x Y x D"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Garanti</label>
                <input 
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  placeholder="2 Yıl..."
                />
             </div>
          </div>
          
          {/* 3D MODEL SECTION */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">3D Ürün Deneyimi (.GLB)</label>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Etkileşimli Modül Aktif</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-neutral-900 rounded-[32px] border border-white/5 shadow-2xl">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Model Bağlantısı (URL)</p>
                  <input 
                    value={formData.threeDModelUrl}
                    onChange={(e) => setFormData({ ...formData, threeDModelUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:ring-2 focus:ring-[#D4AF37] transition-all outline-none"
                    placeholder="https://.../model.glb"
                  />
                  <p className="text-[9px] text-white/30 italic">Not: Dosyanın doğrudan erişilebilir bir .glb linki olması gerekir.</p>
               </div>
               
               <div className="relative border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-all group cursor-not-allowed">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">.GLB Dosyası Yükle</span>
                  <span className="text-[8px] text-white/20 mt-1 uppercase">Maksimum 20MB</span>
               </div>
            </div>
          </div>

          {/* SEO TAGS */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">SEO Etiketleri (Tags)</label>
              <span className="text-[10px] font-bold text-accent">{tags.length} / 30+ Önerilen</span>
            </div>
            
            <div className="p-6 bg-white border border-neutral-100 rounded-3xl space-y-4 focus-within:ring-2 focus-within:ring-neutral-900 transition-all">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-bold flex items-center gap-2 group">
                    {tag}
                    <button type="button" onClick={() => removeTag(i)} className="opacity-50 hover:opacity-100 hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <input 
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Örn: 'inegöl mobilya', 'yatak odası' yazın ve Virgül veya Enter'a basın..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-300"
              />
            </div>
            <p className="text-[10px] text-neutral-400 ml-1">Google aramalarında (Görsel ve Metin) üst sıralara çıkmak için ürününüzü tanımlayan en az 30 kelime grubu girin.</p>
          </div>

          {/* COLORS */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Renk Seçenekleri (Kumaş/Modül vs.)</label>
              <span className="text-[10px] font-bold text-accent">{colors.length} Renk</span>
            </div>
            
            <div className="p-6 bg-white border border-neutral-100 rounded-3xl space-y-4 focus-within:ring-2 focus-within:ring-neutral-900 transition-all">
              <div className="flex flex-wrap gap-2">
                {colors.map((color, i) => (
                  <span key={i} className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-lg text-xs font-bold flex items-center gap-2 group">
                    {color}
                    <button type="button" onClick={() => removeColor(i)} className="opacity-50 hover:opacity-100"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <input 
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleAddColor}
                placeholder="Örn: 'Krem', 'Koyu Gri' yazıp Enter'a basın..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-300"
              />
            </div>
          </div>

          {/* IMAGES */}
          <div className="space-y-6">
             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Ürün Fotoğrafları (Bilgisayardan Yükle)</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-100 group">
                  <img src={img} className="w-full h-full object-cover" alt={`preview-${i}`} />
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              
              <label className="relative aspect-square rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center text-neutral-400 cursor-pointer overflow-hidden">
                <input 
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <Loader2 size={24} className="animate-spin text-accent" />
                ) : (
                  <>
                    <ImageIcon size={24} strokeWidth={1} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center px-2">Görsel Yükle</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 py-8 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded-md border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <label htmlFor="isFeatured" className="text-sm font-bold text-neutral-900 cursor-pointer">Öne Çıkan Ürün</label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-4 pt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="px-10 py-5 border border-neutral-100 text-neutral-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
            >
              İptal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-neutral-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {product ? 'Güncelle' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
