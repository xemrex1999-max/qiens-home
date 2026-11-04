"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isLogin) {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })
      if (res?.error) {
        setError('E-posta veya şifre hatalı.')
      } else {
        router.push('/')
      }
    } else {
      // Register logic
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (res.ok) {
          setIsLogin(true)
          setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.')
        } else {
          setError(data.message || 'Bir hata oluştu.')
        }
      } catch (err) {
        setError('Sunucu hatası oluştu.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="max-w-md w-full bg-white p-10 shadow-2xl rounded-3xl relative overflow-hidden">
        {/* DECORATIVE BACKGROUND */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100 rounded-bl-full -z-10 opacity-50" />
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            {isLogin ? 'Qiens Home dünyasına geri dönün.' : 'Aramıza katılmak için formu doldurun.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-4 flex items-center text-neutral-400">
                  <User size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-neutral-400">
              <Mail size={18} strokeWidth={1.5} />
            </div>
            <input
              type="email"
              placeholder="E-posta Adresi"
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-neutral-400">
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              type="password"
              placeholder="Şifre"
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-500 font-medium px-2 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-neutral-100"></div>
            <span className="flex-shrink mx-4 text-xs text-neutral-400 font-medium uppercase tracking-widest">veya bunlarla devam edin</span>
            <div className="flex-grow border-t border-neutral-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                />
                <path
                  fill="#FBBC05"
                  d="M16.039 18.418a7.076 7.076 0 0 1-10.773-8.653L1.24 6.65a11.977 11.977 0 0 0 0 10.702l4.026-3.115a7.077 7.077 0 0 1 10.773 4.181Z"
                />
                <path
                  fill="#4285F4"
                  d="M19.82 12c0-.527-.045-1.045-.132-1.545H12v3.09h4.373a3.736 3.736 0 0 1-1.622 2.454l4.026 3.115C22.127 16.014 24 13.5 24 12c0-.527-.045-1.045-.132-1.545Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.955-1.077 7.94-2.914l-4.026-3.115A7.077 7.077 0 0 1 5.266 14.235L1.24 17.35C3.198 21.302 7.27 24 12 24Z"
                />
              </svg>
              <span className="text-xs font-bold text-neutral-900 group-hover:text-black transition-colors uppercase tracking-widest">Google</span>
            </button>

            <button
              onClick={() => signIn('facebook', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-3 px-4 py-3.5 bg-[#1877F2] rounded-2xl hover:bg-[#166FE5] transition-all group"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-xs font-bold text-white transition-colors uppercase tracking-widest">Facebook</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-neutral-50 pt-8">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Henüz Hesabınız Yok mu?" : "Zaten Hesabınız Var mı?"}
            <span className="block mt-1 text-black font-extrabold">{isLogin ? "KAYIT OLUN" : "GİRİŞ YAPIN"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
