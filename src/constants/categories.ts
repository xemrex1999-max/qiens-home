export const CATEGORIES = [
  { name: "Yatak Odası", slug: "yatak", value: "Yatak Odası" },
  { name: "Yemek Odası", slug: "yemek", value: "Yemek Odası" },
  { name: "Koltuk Takımı", slug: "koltuk", value: "Koltuk Takımları" },
  { name: "Köşe Koltuk Takımı", slug: "kose", value: "Köşe Koltuk Takımı" },
  { name: "TV Ünitesi", slug: "tv", value: "TV Ünitesi" },
  { name: "Düğün Paketleri", slug: "dugun", value: "Düğün Paketleri" },
  { name: "Dekorasyon", slug: "dekorasyon", value: "Dekorasyon" }
];

export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find(c => c.slug === slug);
};

export const getCategoryNameBySlug = (slug: string) => {
  return CATEGORIES.find(c => c.slug === slug)?.name || slug;
};

export const getCategoryValueBySlug = (slug: string) => {
  return CATEGORIES.find(c => c.slug === slug)?.value || slug.toUpperCase();
};
