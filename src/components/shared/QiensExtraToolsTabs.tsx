"use client";

import React, { useState } from 'react';
import { Camera, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import AIRoomVisualizer from '@/components/shared/AIRoomVisualizer';
import EuropeExportAndB2B from '@/components/shared/EuropeExportAndB2B';

export default function QiensExtraToolsTabs() {
  const [openTool, setOpenTool] = useState<'none' | 'ai' | 'export'>('none');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div className="rounded-2xl bg-[#111116] border border-white/10 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-amber-400 tracking-wide">Ek Akıllı Araçlar</p>
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-white mt-0.5">
            Odanın Fotoğrafında Gör &amp; Avrupa Kapı Teslim Hesaplayıcı
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setOpenTool(openTool === 'ai' ? 'none' : 'ai')}
            className="px-4 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer"
            style={
              openTool === 'ai'
                ? { backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }
                : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.12)' }
            }
          >
            <Camera size={14} /> Odanın Fotoğrafında Gör {openTool === 'ai' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            onClick={() => setOpenTool(openTool === 'export' ? 'none' : 'export')}
            className="px-4 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer"
            style={
              openTool === 'export'
                ? { backgroundColor: '#d4af37', color: '#000', borderColor: '#d4af37' }
                : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.12)' }
            }
          >
            <Globe size={14} /> Avrupa Teslimat &amp; B2B Bayi {openTool === 'export' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {openTool === 'ai' && <AIRoomVisualizer brandName="Qiens Home" accentHex="#d4af37" isDark={true} />}
      {openTool === 'export' && <EuropeExportAndB2B brandName="Qiens Home" accentHex="#d4af37" isDark={true} />}
    </div>
  );
}
