import React from 'react';
import { Metadata } from 'next';
import AIDesignerClient from '@/components/ai-designer/AIDesignerClient';

export const metadata: Metadata = {
  title: 'AI İç Mimar & Stil Asistanı | Qiens Home',
  description: 'Yapay zeka destekli oda planlayıcı ve stil asistanı. Odanızın fotoğrafını yükleyin veya stil testimizi çözün, eviniz için en uygun Qiens Home mobilyalarını saniyeler içinde önerelim.',
  keywords: ['ai iç mimar', 'yapay zeka mobilya', 'oda planlayıcı', 'qiens home ai', 'stil asistanı'],
};

export default function AIDesignerPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-36 md:pt-48 pb-24">
        <AIDesignerClient />
      </div>
    </div>
  );
}
