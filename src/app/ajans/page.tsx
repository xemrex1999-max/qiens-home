import React from 'react';
import { Metadata } from 'next';
import AgencyLandingClient from '@/components/agency/AgencyLandingClient';

export const metadata: Metadata = {
  title: 'EMRE WEB & 3D | Mobilya Web Tasarım & 3D Showroom Ajansı',
  description: 'İnegöl ve Avrupa mobilya markaları için 48 saatte anahtar teslim, 3D Sanal Showroom, Sürükle-Bırak Oda Planlayıcı ve AI Robotlu e-ticaret çözümleri.',
};

export default function AjansPage() {
  return <AgencyLandingClient />;
}
