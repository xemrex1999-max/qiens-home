// Evseren & Qiens Home Yatak ve Yemek Odası Fotoğraflarını 3D GLB'ye Çevirme Motoru
const path = require('path');
const fs = require('fs');
const { convertImageTo3D } = require('./tripo3d');

const ROOT = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT, 'public', 'models');

const PHOTO_MAP = [
  {
    name: 'ayca-yatak',
    photo: path.join(ROOT, 'public', 'evrensen', 'Aynalı Yatak Odası', 'WhatsApp Image 2025-09-01 at 11.43.59 (1).jpeg'),
    out: path.join(MODELS_DIR, 'ayca-yatak.glb')
  },
  {
    name: 'ayca-yemek',
    photo: path.join(ROOT, 'public', 'evrensen', 'Aynalı Yemek Odası', 'WhatsApp Image 2025-09-01 at 11.44.04 (2).jpeg'),
    out: path.join(MODELS_DIR, 'ayca-yemek.glb')
  },
  {
    name: 'buglem-yatak',
    photo: path.join(ROOT, 'public', 'evrensen', 'Buğlem Yatak Odası', 'page1_img17.jpeg'),
    out: path.join(MODELS_DIR, 'buglem-yatak.glb')
  },
  {
    name: 'buglem-yemek',
    photo: path.join(ROOT, 'public', 'evrensen', 'Buğlem Yemek Odası', 'page1_img18.jpeg'),
    out: path.join(MODELS_DIR, 'buglem-yemek.glb')
  },
  {
    name: 'inci-yatak',
    photo: path.join(ROOT, 'public', 'evrensen', 'İnci Yatak Odası', 'page1_img11.jpeg'),
    out: path.join(MODELS_DIR, 'inci-yatak.glb')
  },
  {
    name: 'inci-yemek',
    photo: path.join(ROOT, 'public', 'evrensen', 'İnci Yemek Odası', 'page1_img10.jpeg'),
    out: path.join(MODELS_DIR, 'inci-yemek.glb')
  }
];

async function run() {
  console.log('--- 3D DÖNÜŞTÜRME İŞLEMİ BAŞLATILDI ---');
  for (const item of PHOTO_MAP) {
    if (!fs.existsSync(item.photo)) {
      console.log(`Fotoğraf bulunamadı: ${item.photo}`);
      continue;
    }
    console.log(`\nİşleniyor: ${item.name}`);
    await convertImageTo3D(item.photo, item.out);
  }
}

run();
