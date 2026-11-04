import React from 'react';
import { Metadata } from 'next';
import RoomBuilderClient from '@/components/room-builder/RoomBuilderClient';

export const metadata: Metadata = {
  title: 'Kombin Tasarımcısı | Qiens Home',
  description: 'Odanızı sanal olarak tasarlayın! Qiens Home ürünlerini oda tuvali üzerine sürükleyin, yerleştirin ve beğendiğiniz oda kombinini komple tek tıkla satın alın.',
  keywords: ['oda planlayıcı', 'mobilya yerleştirme', 'kombin tasarlama', 'qiens home oda planlayıcı', 'mix and match'],
};

export default function RoomBuilderPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-36 md:pt-48 pb-24">
        <RoomBuilderClient />
      </div>
    </div>
  );
}
