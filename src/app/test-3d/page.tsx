import Product3DView from "@/components/product/Product3DView";

export default function Test3DPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-serif mb-8 text-secondary uppercase tracking-widest">3D Model Test</h1>
        <div className="bg-neutral-soft p-1 rounded-3xl">
          <Product3DView />
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-sm font-black tracking-widest text-accent uppercase mb-4">Özellikler</h2>
            <ul className="space-y-3 text-xs text-secondary/70 leading-relaxed font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Google &lt;model-viewer&gt; 3.4.0 Entegrasyonu
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Otomatik Döndürme (Auto-rotate) aktif
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Kamera kontrolleri ve Zoom aktif
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Artırılmış Gerçeklik (AR) Desteği
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest text-accent uppercase mb-4">Arayüz</h2>
            <ul className="space-y-3 text-xs text-secondary/70 leading-relaxed font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Premium Glassmorphism Fullscreen Butonu
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Özel Yüklenme (Loading) Animasyonu
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Tam Duyarlı (Responsive) Tasarım
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
