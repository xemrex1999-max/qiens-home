"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ChevronRight, Truck, CreditCard, ShoppingBag, MapPin, ArrowLeft, ShieldCheck, Lock } from "lucide-react"
import { useCart } from "@/store/useCart"
import { formatPrice, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"

const STEPS = [
  { id: "address", label: "Teslimat", icon: MapPin },
  { id: "payment", label: "Ödeme", icon: CreditCard },
  { id: "confirm", label: "Onay", icon: CheckCircle2 }
]

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const { cart, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [legalAccepted, setLegalAccepted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"havale" | "kart">("kart")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Bursa",
    district: "",
    address: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    installment: 1
  })

  useEffect(() => {
    setMounted(true)
    if (mounted && cart.length === 0) router.push("/products")
  }, [mounted, cart, router])

  if (!mounted || cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-neutral-100 border-t-accent rounded-full animate-spin" />
    </div>
  )

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const getFinalTotal = () => {
    const base = getTotal()
    if (paymentMethod === "havale") return base * 0.95 // %5 Havale indirimi
    return base
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalPrice: getFinalTotal(),
          address: formData,
          paymentMethod
        })
      })

      if (res.ok) {
        toast.success("Siparişiniz başarıyla alındı!")
        clearCart()
        router.push("/profil")
      } else {
        throw new Error("Sipariş oluşturulamadı")
      }
    } catch (error) {
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen pt-32 md:pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* LEFT: FORM STEPS */}
          <div className="flex-1 space-y-16">
            <div className="flex items-center justify-between max-w-md">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-3 relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                    step >= i ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-neutral-100 text-neutral-400"
                  )}>
                    <s.icon size={20} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    step >= i ? "text-neutral-900" : "text-neutral-300"
                  )}>{s.label}</span>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      "absolute top-6 -right-16 w-12 h-[2px] hidden md:block",
                      step > i ? "bg-accent" : "bg-neutral-100"
                    )} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 p-8 md:p-12 rounded-sm border border-neutral-100 relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="border-b border-neutral-200 pb-8">
                      <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Teslimat Bilgileri</h2>
                      <p className="text-xs text-neutral-400 mt-2">Ürünlerinizin güvenle ulaşması için formu eksiksiz doldurun.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <input 
                         type="text" 
                         placeholder="ADINIZ"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none uppercase"
                         value={formData.firstName}
                         onChange={e => setFormData({...formData, firstName: e.target.value})}
                       />
                       <input 
                         type="text" 
                         placeholder="SOYADINIZ"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none uppercase"
                         value={formData.lastName}
                         onChange={e => setFormData({...formData, lastName: e.target.value})}
                       />
                       <input 
                         type="email" 
                         placeholder="E-POSTA"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                       <input 
                         type="text" 
                         placeholder="TELEFON"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none"
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                       />
                       <input 
                         type="text" 
                         placeholder="İlçe"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none"
                         value={formData.district}
                         onChange={e => setFormData({...formData, district: e.target.value})}
                       />
                       <textarea 
                         placeholder="AÇIK ADRES"
                         className="bg-transparent border-b border-neutral-300 py-4 text-sm font-bold placeholder:text-neutral-300 focus:border-accent outline-none md:col-span-2 min-h-[100px]"
                         value={formData.address}
                         onChange={e => setFormData({...formData, address: e.target.value})}
                       />
                    </div>
                    <button onClick={handleNext} className="w-full bg-neutral-900 text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all">
                       Ödeme Adımına Geç <ChevronRight className="inline ml-2" size={16} />
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="border-b border-neutral-200 pb-8">
                      <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Ödeme Yöntemi</h2>
                    </div>

                    <div className="flex gap-4">
                      <button 
                         onClick={() => setPaymentMethod("kart")}
                         className={cn(
                           "flex-1 p-6 border-2 rounded-sm transition-all flex flex-col items-center gap-4",
                           paymentMethod === "kart" ? "border-accent bg-accent/5" : "border-neutral-200 hover:border-neutral-400"
                         )}
                      >
                         <CreditCard size={24} className={paymentMethod === "kart" ? "text-accent" : "text-neutral-400"} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Kredi Kartı</span>
                      </button>
                      <button 
                         onClick={() => setPaymentMethod("havale")}
                         className={cn(
                           "flex-1 p-6 border-2 rounded-sm transition-all flex flex-col items-center gap-4",
                           paymentMethod === "havale" ? "border-accent bg-accent/5" : "border-neutral-200 hover:border-neutral-400"
                         )}
                      >
                         <Truck size={24} className={paymentMethod === "havale" ? "text-accent" : "text-neutral-400"} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Havale / EFT</span>
                         <span className="text-[9px] text-green-600 font-bold uppercase">%5 İndirim</span>
                      </button>
                    </div>

                    {paymentMethod === "havale" ? (
                      <div className="p-8 bg-neutral-100 rounded border border-neutral-200 space-y-4">
                        <div className="flex items-center gap-3 text-accent border-b border-neutral-200 pb-4 mb-4">
                          <CheckCircle2 size={18} />
                          <h4 className="text-[11px] font-black uppercase tracking-widest">Banka Bilgilerimiz</h4>
                        </div>
                        <div className="text-xs space-y-4 text-neutral-600">
                           <div>
                             <p className="font-bold text-neutral-900 mb-1">GARANTİ BBVA - İNEGÖL ŞUBESİ</p>
                             <p className="font-bold text-neutral-900 mb-1">ALICI: BEYAZIT MOBİLYAM SAN. TİC. LTD. ŞTİ.</p>
                             <div className="bg-white p-3 border border-neutral-200 font-mono text-accent text-sm tracking-tighter mt-2 inline-block">
                               TR12 0006 2000 0000 0000 0000 00
                             </div>
                           </div>
                           <p className="text-[10px] italic text-neutral-400 border-t border-neutral-200 pt-4">Lütfen açıklama kısmına Adınız Soyadınızı veya Sipariş Numaranızı eklemeyi unutmayın.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-8 bg-neutral-100 p-8 rounded-sm">
                         <div className="col-span-2 relative">
                            <input 
                              type="text" 
                              placeholder="KART ÜZERİNDEKİ İSİM"
                              className="w-full bg-transparent border-b border-neutral-300 py-3 text-sm font-bold uppercase outline-none focus:border-accent"
                            />
                         </div>
                         <div className="col-span-2">
                            <input 
                              type="text" 
                              placeholder="KART NUMARASI"
                              className="w-full bg-transparent border-b border-neutral-300 py-3 text-sm font-bold outline-none focus:border-accent"
                            />
                         </div>
                         <input 
                           type="text" 
                           placeholder="SKT (AA/YY)"
                           className="bg-transparent border-b border-neutral-300 py-3 text-sm font-bold outline-none focus:border-accent"
                         />
                         <input 
                           type="text" 
                           placeholder="CVV"
                           className="bg-transparent border-b border-neutral-300 py-3 text-sm font-bold outline-none focus:border-accent"
                         />
                      </div>
                    )}

                    <div className="flex flex-col-reverse md:flex-row gap-6 pt-10">
                       <button onClick={handleBack} className="flex items-center justify-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors uppercase font-black text-[10px] tracking-widest">
                          <ArrowLeft size={16} /> Geri Dön
                       </button>
                       <button 
                          onClick={handleNext} 
                          className="flex-1 bg-neutral-900 text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all"
                       >
                          Son Onaya Geç <ChevronRight className="inline ml-2" size={16} />
                       </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="border-b border-neutral-200 pb-8">
                      <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Sipariş Onayı</h2>
                    </div>

                    <div className="space-y-8">
                       <div className="p-8 border border-neutral-200 rounded-sm space-y-6 bg-white/50">
                          <div className="flex items-center gap-3 text-accent border-b border-neutral-100 pb-4">
                            <ShieldCheck size={20} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Yasal Koşullar</h3>
                          </div>
                          <label className="flex items-start gap-4 cursor-pointer group">
                             <input 
                               type="checkbox"
                               className="w-6 h-6 mt-1 border-2 border-neutral-300 rounded-sm text-accent focus:ring-accent accent-accent"
                               checked={legalAccepted}
                               onChange={e => setLegalAccepted(e.target.checked)}
                             />
                             <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors pt-1">
                                <Link href="/mesafeli-satis" className="text-accent hover:underline font-bold">Mesafeli Satış Sözleşmesi</Link> ve <Link href="/aydinlatma-metni" className="text-accent hover:underline font-bold">KVK Aydınlatma Metni</Link>"ni okudum, onaylıyorum.
                             </span>
                          </label>
                       </div>

                       <div className="flex flex-col-reverse md:flex-row gap-6">
                         <button onClick={handleBack} className="flex items-center justify-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors uppercase font-black text-[10px] tracking-widest">
                            <ArrowLeft size={16} /> Geri Dön
                         </button>
                         <button 
                            onClick={handleSubmit} 
                            disabled={loading || !legalAccepted}
                            className="flex-1 bg-accent text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                               "Siparişi Tamamla"
                            )}
                         </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          /* RIGHT: SUMMARY */
          <div className="w-full lg:w-[420px] space-y-10 lg:sticky lg:top-40 h-fit">
            <div className="bg-white p-8 md:p-12 border border-neutral-100 shadow-2xl space-y-10 rounded-sm relative group overflow-hidden">
               <div className="flex items-center gap-4 border-b border-neutral-100 pb-8">
                 <ShoppingBag size={24} className="text-accent" />
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Sipariş Özeti</h2>
                 <span className="ml-auto text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1">{cart.length} ÜRÜN</span>
               </div>

               <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                 {cart.map(item => (
                   <div key={item.id} className="flex gap-6 group">
                     <div className="w-20 h-20 relative rounded-sm overflow-hidden border border-neutral-100 group-hover:border-accent/30 transition-colors flex-shrink-0">
                       <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="flex-1 space-y-2 py-1">
                       <h3 className="text-[10px] font-bold text-neutral-900 uppercase leading-snug line-clamp-2">{item.name}</h3>
                       <div className="flex justify-between items-center pt-2">
                         <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{item.qty} ADET</span>
                         <span className="text-sm font-light tracking-tighter text-neutral-900">{formatPrice(item.price * item.qty)}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="space-y-5 pt-10 border-t border-neutral-100">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                    <span>Ara Toplam</span>
                    <span className="text-sm text-neutral-900 font-light tracking-tighter">{formatPrice(getTotal())}</span>
                  </div>
                  {paymentMethod === "havale" && (
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-green-600">
                      <span>Havale İndirimi (%5)</span>
                      <span className="text-sm font-light tracking-tighter">-{formatPrice(getTotal() * 0.05)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                    <span>Nakliye</span>
                    <span className="text-green-600 font-black">ÜCRETSİZ</span>
                  </div>
                  <div className="flex justify-between items-end pt-8 border-t border-neutral-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Toplam Ödeme</span>
                      <span className="text-[9px] font-light text-neutral-400 uppercase tracking-tighter">KDV Dahil</span>
                    </div>
                    <span className="text-4xl font-light tracking-tighter text-neutral-900">{formatPrice(getFinalTotal())}</span>
                  </div>
               </div>
            </div>

            <div className="bg-neutral-900 p-8 rounded-sm text-white flex items-center justify-between shadow-2xl">
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                   <Lock size={12} className="text-accent" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Güvenli Ödeme</p>
                 </div>
                 <p className="text-[9px] text-neutral-500 font-light uppercase tracking-tighter">ÖİYS - SSL 256 BIT ŞİFRELEME</p>
               </div>
               <div className="text-[14px] font-black italic tracking-tighter opacity-30">BEYAZIT MOBİLYAM</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
