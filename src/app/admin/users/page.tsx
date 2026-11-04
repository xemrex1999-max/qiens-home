import React from 'react'
import { 
  Users, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  Mail, 
  Calendar,
  MoreVertical
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 uppercase">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-neutral-400 font-medium">Sistemde kayıtlı toplam {users.length} kullanıcı var.</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input 
          type="text" 
          placeholder="İsim veya e-posta ara..." 
          className="w-full pl-16 pr-6 py-5 bg-white border border-neutral-100 rounded-3xl text-sm focus:ring-2 focus:ring-neutral-900 transition-all outline-none"
        />
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-neutral-100 rounded-[40px] overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Kullanıcı</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Yetki</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Kayıt Tarihi</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
               {users.map((user: User) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400">
                              <UserIcon size={20} strokeWidth={1.5} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                                 <Mail size={10} /> {user.email}
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                           {user.role === 'admin' ? (
                             <>
                               <ShieldCheck size={14} className="text-accent" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Yönetici</span>
                             </>
                           ) : (
                             <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Müşteri</span>
                           )}
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                           <Calendar size={12} />
                           {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <button className="p-3 hover:bg-neutral-50 rounded-xl text-neutral-400 transition-all">
                           <MoreVertical size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {users.length === 0 && (
            <div className="py-32 text-center space-y-4">
               <Users size={48} className="mx-auto text-neutral-200" />
               <p className="text-sm font-bold text-neutral-400">Henüz kullanıcı kaydı yok.</p>
            </div>
         )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
