const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'elite-bedroom';
  
  const existing = await prisma.product.findUnique({
    where: { slug }
  });

  const data = {
    name: 'Elite Cream Yatak Odası Takımı',
    slug: 'elite-bedroom',
    description: 'Görseldeki tasarımı birebir yansıtan Elite Cream serisi, "Quiet Luxury" akımının en seçkin örneğidir. İthal krem buklet kumaş kaplı kavisli yatak başlığı, minimal dairesel metal kulplar ve sensörlü LED aydınlatmalı aynası ile yatak odanızı bir sanat galerisine dönüştürür.',
    price: 48500,
    stock: 10,
    category: 'YATAK_ODASI',
    images: ['/images/elite-bedroom-user.jpg'],
    threeDModelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb',
    dimensions: 'Özel İnegöl Ölçüleri',
    material: 'Premium Krem Buklet, MDF, Lake',
    warranty: '2 YIL Beyazıt Mobilyam Güvencesi',
    isFeatured: true,
    tags: ['elite', 'cream', 'yatak odası', 'luxury']
  };

  if (existing) {
    await prisma.product.update({
      where: { slug },
      data
    });
    console.log('Updated existing elite-bedroom product.');
  } else {
    await prisma.product.create({
      data
    });
    console.log('Created new elite-bedroom product.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
