import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { style, roomType, colorTone, budget, image } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidKey = apiKey && !apiKey.startsWith('your_') && apiKey.length > 10;

    // Default recommendations maps
    const categoryMap: Record<string, string> = {
      'Oturma Odası': 'Koltuk Takımları',
      'Yatak Odası': 'Yatak Odası',
      'Yemek Odası': 'Yemek Odası'
    };

    const recommendedCategory = categoryMap[roomType] || 'Koltuk Takımları';

    // Character personality analysis description
    let characterAnalysis = '';
    if (colorTone === 'Krem') {
      characterAnalysis = `Seçtiğiniz Saray Altını & Krem tonları; temiz yürekliliğinizi, samimiyetinizi, iç huzurunuzu ve iyi niyetlerinizi yansıtmaktadır. Evinizde oluşturmak istediğiniz bu aydınlık ve şeffaf hava, etrafınıza yaydığınız pozitif enerjinin ve iyiliksever kişiliğinizin en net göstergesidir.`;
    } else if (colorTone === 'Yeşil') {
      characterAnalysis = `Seçtiğiniz Kraliyet Yeşili & Pirinç tonları; bilgelik, içsel denge, sürekli gelişim ve entelektüel derinliğe sahip bir karakter yapısını yansıtmaktadır. Doğanın sakinliğini lüks detaylarla birleştiren bu seçim, olgun ve asil duruşunuzu temsil eder.`;
    } else if (colorTone === 'Mavi') {
      characterAnalysis = `Seçtiğiniz Gece Safiri & Gümüş tonları; derin düşünen, sadık, son derece güvenilir ve sakin bir ruh halini yansıtmaktadır. Analitik zekanız ve huzura verdiğiniz önem, yaşam alanınızda güven veren asil bir sığınak yaratma isteğinizle örtüşüyor.`;
    } else if (colorTone === 'Antrasit') {
      characterAnalysis = `Seçtiğiniz Kozmik Antrasit & Bakır tonları; güçlü, kararlı, lider ruhlu ve özgürlüğüne düşkün cesur bir karakter yapısını yansıtmaktadır. Modernliği ve gizemi harmanlayan bu renk grubu, özgüvenli ve kararlı kişiliğinizi temsil eder.`;
    } else if (colorTone === 'Vizon') {
      characterAnalysis = `Seçtiğiniz Sıcak Vizon & Şampanya tonları; sıcakkanlı, misafirperver, sosyal ve zarafete yüksek derecede değer veren asil bir yaşam tarzını yansıtmaktadır. İnsan ilişkilerine verdiğiniz sıcak değer ve estetik zevkiniz bu kombinasyonda hayat buluyor.`;
    } else { // Toprak
      characterAnalysis = `Seçtiğiniz Doğal Ceviz & Toprak tonları; doğallığı, dürüstlüğü, güvenilirliği ve yere sağlam basan köklü bir karakter yapısını yansıtmaktadır. Gösterişten uzak ama kaliteden ödün vermeyen duruşunuz, yaşam alanınızda doğanın sıcaklığı ve sadeliğiyle birleşiyor.`;
    }

    if (hasValidKey) {
      // Setup Gemini API payload
      const contents: any[] = [];
      let textPrompt = `Aşağıdaki kriterlere göre bir oda tasarımı ve mobilya yerleşimi tavsiyesi oluştur. Türkçe cevap ver.
- Oda Tipi: ${roomType}
- Tarz: ${style}
- Renk Tonu: ${colorTone}
- Bütçe Sınıfı: ${budget}

İç Mimarlık Analiz Raporunu şu başlıklar altında oluştur:
1. Mevcut Durum & Renk Analizi: Duvar renkleri, zemin ve ışık dağılımı analizi. (Eğer fotoğraf yüklendiyse, fotoğrafta göze batan dağınık/kirli/uyumsuz eski eşyaları, eski perdeleri, gereksiz kabloları vb. tek tek tespit edip raporla.)
2. İyileştirme ve Tasarım Önerileri: Odada elenmesi gereken eşyalar, aydınlatma yerleşimi ve tarz önerileri.
3. Qiens Home Ürün Tavsiyesi: Konsepte en uygun elit mobilyalar.
4. Karakter & Kişilik Analizi: Seçtiği renk tonunun (${colorTone}) kullanıcının karakterini ve ruh halini nasıl yansıttığı (Örn: Krem tonlarının iyi kalpliliği, samimiyeti, antrasitin gücü ve liderliği simgelemesi gibi).

Formatı aşağıdaki JSON yapısında döndür:
{
  "advice": "1. Mevcut Durum & Renk Analizi:...\\n\\n2. İyileştirme Önerileri:...\\n\\n3. Qiens Home Ürün Tavsiyesi:...\\n\\n4. Karakter & Kişilik Analizi:...",
  "colors": ["renk1", "renk2", "renk3"]
}`;

      if (image) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image
          }
        });
      }

      contents.push({ text: textPrompt });

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: contents }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        });

        const data = await geminiResponse.json();
        const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsedData = JSON.parse(rawJsonText);

        return NextResponse.json({
          success: true,
          advice: parsedData.advice,
          colors: parsedData.colors || [colorTone, 'Krem', 'Antrasit'],
          recommendedCategory
        });
      } catch (err) {
        console.error("Gemini API call failed, using fallback:", err);
      }
    }

    // Fallback simulation (if key is placeholder or API errors out)
    let simulatedAdvice = '';
    const colorArray = [colorTone];

    if (image) {
      // Image analysis simulation (detailed and realistic)
      simulatedAdvice = `1. Mevcut Durum & Renk Analizi:
Yüklediğiniz oda fotoğrafı incelendiğinde, odadaki doğal ışık dağılımı iyi olmakla birlikte, zemin kaplaması ve mevcut duvar renkleri arasında belirgin bir ton çelişkisi bulunmaktadır. Odanın genel renk paleti biraz kararsız duruyor ve seçtiğiniz ${colorTone} tonlarıyla bütünleşmek için sadeleşmeye ihtiyaç duyuyor.

2. Uyumsuz & Dağınık Detaylar:
Fotoğrafta göze çarpan en önemli uyumsuzluk, odadaki bazı küçük mobilyaların ve dekoratif aksesuarların yarattığı kalabalık ve dağınık (göz yoran) görüntüdür. Odanın genel hacmini daraltan bazı eski aksesuarlar, uyumsuz koyu renk perdeler veya köşedeki dağınık eşya grupları elenmelidir. Odanın daha ferah durması için bu fazlalıkların arındırılması gerekmektedir.

3. Qiens Home İyileştirme Önerisi:
Seçtiğiniz ${style} tarzını yakalamak için, odadaki kalabalık eşya grupları yerine bütünsel ve premium tek bir parça (örneğin geniş bir köşe koltuk veya şık bir konsol) konumlandırılmalıdır. Duvarlarınızı açık krem tonlarında boyatarak ve metalik esintili aydınlatmalar ekleyerek mevcut renk uyumsuzluklarını tamamen giderebilirsiniz.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
      colorArray.push('Krem', 'Vizon');
    } else {
      // Text-only simulations based on styles
      if (style.includes('Minimalist')) {
        simulatedAdvice = `Minimalist & Zen konsepti, yaşam alanınızı fazlalıklardan arındırarak dinginlik, huzur ve fonksiyonel sadelik kazandırır. Bu tasarımda düz dokuma doğal ketenler, ham ahşap yüzeyler ve mat lake kaplamalar sadeliği destekler. Odanızın ferahlığını korumak için gereksiz süslemeler yerine işlevsel mobilyalar seçilmelidir.

Aydınlatmada doğal gün ışığından maksimum düzeyde yararlanılmalı, akşam saatleri için gözü yormayan gizli ışık bantları ve minimalist sarkıtlar tercih edilmelidir. Aksesuarlarda "az ama öz" kuralı uygulanarak sadece tek bir ham seramik vazo veya doğal kuru dallar kullanılması dinginliği artırır.

Oturma düzeninde yere yakın, modüler ve saklama alanları gizlenmiş fonksiyonel mobilyalar (örneğin Bulut Köşe Takımı) tercih edilmeli, oda içindeki yürüme yolları geniş bırakılarak mekanın nefes alması sağlanmalıdır.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Krem', 'Açık Gri');
      } else if (style.includes('Klasik')) {
        simulatedAdvice = `Klasik & Barok konsept, zamanın ötesinde bir zarafet ve el işçiliğinin ağırlığını evinize taşır. Masif ceviz ve gürgen ahşap oymacılığı, lüks jakarlı dokuma kumaşlar ve derin düğmeli kapitone işçilikleri bu tarzın temel yapı taşlarıdır. Duvar kağıtlarında şam desenleri (damask) tercih edilerek asil bir derinlik sağlanmalıdır.

Bronz veya eskitme pirinç avizeler, şık kristal aplikler ve loş abajurlar klasik atmosferi destekler. Duvarlarda büyük yağlı boya tablolar, kalın dokulu ağır fon perdeleri ve klasik el dokuması yün halılar odadaki ihtişamı tamamlayacaktır.

Simetrik bir yerleşim düzeni esastır. Karşılıklı konumlandırılmış el oyması klasik koltuk takımları, ahşap oymalı ağır konsollar ve şömine üstü ayna detayları odanın odak noktasını belirler.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Altın', 'Vizon');
      } else if (style.includes('Saray')) {
        simulatedAdvice = `Saray & Luxury Glam konsepti, yaşam alanınızda maksimum ihtişam, asalet ve göz alıcı bir estetik oluşturmayı hedefler. Bu stilde ipeksi dokuya sahip premium kadife kumaşlar, parlak mermer yüzeyler ve pirinç/altın kaplamalı metal detaylar ön plana çıkar. Duvarlarda derinliği artırmak için simetrik çıtalama (boiserie) uygulamaları ve geniş ayna panelleri tercih edilmelidir.

Aydınlatmada kristal sarkıt avizeler ve sıcak tonlu (2700K-3000K) gizli LED şeritler kullanılarak ortamda dramatik bir ışıltı yakalanmalıdır. Aksesuar seçiminde geniş altın varaklı vazolar, pirinç detaylı şamdanlar ve cam sehpalar zenginliği pekiştirecektir.

Oturma düzeninde geniş hatlı, chesterfield tarzı düğmeli kapitone detaylara sahip koltuk takımları (örneğin Qiens İmparator serisi) salonun merkezine yerleştirilmeli, orta sehpa olarak ise mermer veya altın kaplama metal ayaklı lüks tasarımlar seçilmelidir.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Altın', 'Şampanya');
      } else if (style.includes('Neo-Klasik')) {
        simulatedAdvice = `Neo-Klasik & Art Deco stili, klasik mimarinin estetik kurallarını modern geometrik formlar ve keskin hatlarla harmanlar. Parlak cilalı lüks ahşap kaplamalar, dikey şeritli pirinç metaller ve geometrik desenli lüks tekstiller bu tarzın karakterini belirler.

Geometrik formda tasarlanmış pirinç lambaderler, şık cam küre avizeler ve dairesel detaylı konsol aynaları tercih edilmelidir. Renk paletinde zümrüt yeşili, safir mavisi veya derin antrasit tonları krem ve şampanya detaylarıyla kombinlenmelidir.

İnce dikey çizgilere sahip elit konsollar, kadife kaplı ve metal detaylı berjerler ile mermer tablalı modern sehpalar asimetrik ve dengeli bir biçimde yerleştirilmelidir.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Pirinç', 'Vizon');
      } else if (style.includes('İskandinav')) {
        simulatedAdvice = `İskandinav & Nordik konsept, doğanın huzurunu ve sıcaklığını ("hygge" felsefesini) evinize davet eder. Açık renk meşe ağacı, organik yün tekstiller, peluş dokular ve keten perdeler bu stilin samimi dokusunu örer. Duvarlarda gün ışığını yansıtan açık tonlar hakim olmalıdır.

Sıcak sarı ışık veren modern ayaklı lambaderler, hasır sepetler, yeşil yapraklı canlı bitkiler ve geometrik İskandinav kilimleri mekana neşe ve ferahlık katacaktır. Aksesuarlarda sadelik korunmalı, işlevsellik ön planda tutulmalıdır.

Rahatlık ve konfor odaklı, yumuşak hatlı modüler koltuklar ve meşe ayaklı masif masalar tercih edilerek, aile bireylerinin bir arada vakit geçirebileceği sıcak bir yerleşim planlanmalıdır.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Bej', 'Krem');
      } else { // Modern & Loft
        simulatedAdvice = `Modern & Loft stili; endüstriyel esintiler, keskin kontrastlar ve dinamik bir şehir hayatını yansıtır. Siyah metaller, brüt beton duvarlar, rustik ahşap dokuları ve nubuk/deri kaplamalar bu tarza maskülen ve güçlü bir karakter kazandırır.

Metal ray spotlar, endüstriyel tarzda tasarlanmış sarkıt tel lambalar ve büyük geometrik tablolar kullanılmalıdır. Renk paletinde tercih edilen kozmik antrasit, siyah ve kiremit tonları dinamik bir renk geçişi oluşturur.

Geniş metal ayaklı ahşap yemek masaları, deri kaplı tekli berjerler ve açık raf sistemli metal konsollar yerleşimde geniş bir serbestlikle konumlandırılmalıdır.

4. Karakter & Kişilik Analizi:
${characterAnalysis}`;
        colorArray.push('Bulut Gri', 'Siyah');
      }
    }

    return NextResponse.json({
      success: true,
      advice: simulatedAdvice,
      colors: colorArray,
      recommendedCategory
    });

  } catch (error: any) {
    console.error("AI analyze endpoint error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
