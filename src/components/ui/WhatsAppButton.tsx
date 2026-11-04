"use client"

import React from "react"
import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

const WhatsAppButton = () => {
    // Mobilya sektörü için hızlı destek numarası
    const phoneNumber = "905314602597" 
    const message = encodeURIComponent("Merhaba, Qiens Home web sitenizden ulaşıyorum. Ürünleriniz hakkında bilgi alabilir miyim?")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[999] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300"
        >
            <MessageCircle size={32} />
            
            {/* TOOLTIP / BADGE */}
            <span className="absolute -top-12 right-0 bg-white text-neutral-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-neutral-100 font-sans">
                Hızlı Destek
            </span>
        </motion.a>
    )
}

export default WhatsAppButton
