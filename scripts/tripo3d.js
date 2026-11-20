// Tripo3D Image-to-3D Converter Service
// Dokümantasyon: https://platform.tripo3d.ai/

const fs = require('fs');
const path = require('path');

const TRIPO_API_KEY = process.env.TRIPO_API_KEY || '';

async function convertImageTo3D(imagePath, outputGlbPath) {
  if (!TRIPO_API_KEY) {
    console.log('[Tripo3D] TRIPO_API_KEY tanımlanmadı. Lütfen .env dosyasına ekleyin.');
    return null;
  }

  try {
    console.log(`[Tripo3D] Fotoğraf yükleniyor: ${imagePath}`);
    const fileData = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().replace('.', '');
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

    // 1. Upload image to Tripo
    const uploadRes = await fetch('https://api.tripo3d.ai/v2/openapi/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRIPO_API_KEY}`,
        'Content-Type': mime,
      },
      body: fileData
    });

    const uploadData = await uploadRes.json();
    if (!uploadData?.data?.image_token) {
      throw new Error(`Upload başarısız: ${JSON.stringify(uploadData)}`);
    }

    const imageToken = uploadData.data.image_token;
    console.log(`[Tripo3D] Fotoğraf yüklendi, token: ${imageToken}. 3D model üretimi başlatılıyor...`);

    // 2. Create Task (text_to_model or image_to_model)
    const taskRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRIPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'image_to_model',
        file: {
          type: ext,
          file_token: imageToken
        }
      })
    });

    const taskData = await taskRes.json();
    const taskId = taskData?.data?.task_id;
    if (!taskId) {
      throw new Error(`Task oluşturulamadı: ${JSON.stringify(taskData)}`);
    }

    console.log(`[Tripo3D] Task ID: ${taskId}. Model oluşturuluyor, bekleniyor...`);

    // 3. Poll Task Status
    let glbUrl = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 6000));
      const pollRes = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
        headers: { 'Authorization': `Bearer ${TRIPO_API_KEY}` }
      });
      const pollData = await pollRes.json();
      const status = pollData?.data?.status;
      console.log(`[Tripo3D] Durum: ${status} (%${pollData?.data?.progress || 0})`);

      if (status === 'success') {
        glbUrl = pollData?.data?.output?.model;
        break;
      }
      if (status === 'failed' || status === 'cancelled') {
        throw new Error(`Model üretimi başarısız oldu: ${status}`);
      }
    }

    if (!glbUrl) throw new Error('Zaman aşımı: Model üretilemedi.');

    // 4. Download GLB
    console.log(`[Tripo3D] GLB indiriliyor: ${glbUrl}`);
    const glbRes = await fetch(glbUrl);
    const glbBuffer = Buffer.from(await glbRes.arrayBuffer());
    fs.mkdirSync(path.dirname(outputGlbPath), { recursive: true });
    fs.writeFileSync(outputGlbPath, glbBuffer);
    console.log(`[Tripo3D] Model başarıyla kaydedildi: ${outputGlbPath}`);
    return outputGlbPath;

  } catch (err) {
    console.error(`[Tripo3D Hata]`, err.message);
    return null;
  }
}

module.exports = { convertImageTo3D };
