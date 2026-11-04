import Link from "next/link";

export default function YatakOdasiCategoryPage() {
  const products = [
    {
      id: "elite-bedroom",
      name: "Elite Cream",
      detail: "Sessiz Lüks Tasarım",
      price: "48.500 TL",
      href: "/products/elite-bedroom",
      image: "bg-neutral-soft"
    }
    // Add more placeholder products if needed
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans">
      <div className="max-w-7xl mx-auto py-20 px-6">
        <header className="mb-16 space-y-4">
          <span className="text-accent text-[10px] font-black tracking-[.4em] uppercase">Koleksiyon</span>
          <h1 className="text-5xl font-serif text-secondary lowercase italic">Yatak Odası.</h1>
          <p className="max-w-xl text-sm text-secondary/60 leading-relaxed">
            Huzuru tasarlıyoruz. Beyazıt Mobilyam'ın en seçkin yatak odası modelleriyle uykunuzu ve yaşam alanınızı dönüştürün.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <Link key={product.id} href={product.href} className="group cursor-pointer">
              <div className={`aspect-[4/5] ${product.image} rounded-3xl mb-6 overflow-hidden relative border border-border/50`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                {/* 3D Badge */}
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest uppercase text-secondary">
                  3D Deneyim
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-serif text-secondary">{product.name}</h3>
                  <span className="text-sm font-light text-secondary/60">{product.price}</span>
                </div>
                <p className="text-[10px] font-bold tracking-widest text-accent uppercase">{product.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
