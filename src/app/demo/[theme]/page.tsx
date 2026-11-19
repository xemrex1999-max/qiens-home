import React from 'react';
import { Metadata } from 'next';
import { DEMO_THEMES, DEMO_THEME_LIST } from '@/data/demoThemes';
import DemoStorefront from '@/components/demo/DemoStorefront';

export function generateStaticParams() {
  return DEMO_THEME_LIST.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme: slug } = await params;
  const config = DEMO_THEMES[slug] || DEMO_THEMES['aura-luxe'];
  return {
    title: `${config.brandName} | ${config.tagline}`,
    description: config.heroSubtitle,
  };
}

export default async function DemoThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: slug } = await params;
  const config = DEMO_THEMES[slug] || DEMO_THEMES['aura-luxe'];
  return <DemoStorefront theme={config} />;
}
