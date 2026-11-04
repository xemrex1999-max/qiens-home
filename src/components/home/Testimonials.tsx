"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquareQuote, MapPin } from 'lucide-react'

const REVIEWS = [
  { id: 1, name: "Emirhan Sarıkaya", location: "İstanbul", comment: "İnegöl'den gelen koltuk takımı salonumuza hava kattı. Bu fiyata bu kalite inanılmaz, teşekkürler!", rating: 5 },
  { id: 2, name: "Selin Demir", location: "Bursa", comment: "Yemek odası takımı çok sağlam ve şık. Teslimat süreci de oldukça profesyonel ilerledi.", rating: 5 },
  { id: 3, name: "Mehmet Çelik", location: "Ankara", comment: "Yatak odası takımı tam istediğim gibi geldi. Montaj ekibi de çok temiz çalıştı.", rating: 5 },
  { id: 4, name: "Ayşe Yılmaz", location: "İzmir", comment: "Koltukların kumaş kalitesi beklediğimden çok daha iyi. Renkler fotoğraftakiyle birebir aynı.", rating: 5 },
  { id: 5, name: "Caner Öz", location: "Antalya", comment: "yemek masası beklediğimizden de büyük ve şık çıktı valla tam salonumuza göre tşkler", rating: 4 },
  { id: 6, name: "Fatma Nur", location: "Trabzon", comment: "Yatak odası takımı çok kaliteli, işçilik gerçekten profesyonel.", rating: 5 },
  { id: 7, name: "Okan Avcı", location: "Eskişehir", comment: "Modern koltuk takımı salonun havasını tamamen değiştirdi.", rating: 5 },
  { id: 8, name: "Gizem Ak", location: "Kayseri", comment: "Düğün paketindeki yemek odası takımı çok zarif, kalitesi muazzam.", rating: 5 },
  { id: 9, name: "Burak Sağlam", location: "Samsun", comment: "yatak bazası cok genis herseyi sigdirdik faturayi da kesmisler tsk", rating: 4 },
  { id: 10, name: "Deniz Kaya", location: "Adana", comment: "Koltukların rahatlığı tartışılmaz. Akşamları TV izlemek artık çok daha keyifli.", rating: 5 },
  { id: 11, name: "Hülya Köse", location: "Zonguldak", comment: "Yemek masası ve sandalyeleri tam istediğim renkte geldi. Teşekkürler.", rating: 5 },
  { id: 12, name: "Serkan Tunç", location: "Konya", comment: "Yatak odası takımı montajı sorunsuz yapıldı. Kalitesi çok iyi.", rating: 5 },
  { id: 13, name: "Merve Aydın", location: "Kocaeli", comment: "koltuk takimi kumas leke tutmuo valla süper bişey çocuklu evler alsın", rating: 4 },
  { id: 14, name: "Tolga Yıldız", location: "Muğla", comment: "Yemek masasının açılabilir olması misafir geldiğinde çok işimize yarıyor.", rating: 5 },
  { id: 15, name: "Sibel Arslan", location: "Gaziantep", comment: "Gardırop içi düzeni çok kullanışlı. Yatak odası harika oldu.", rating: 5 },
  { id: 16, name: "Hakan Yurt", location: "Denizli", comment: "l koltuk takimi salonumuza tam oldu cok modern duruyo beğendik", rating: 4 },
  { id: 17, name: "Ece Güler", location: "Manisa", comment: "Yemek odasının porselen kulpları çok zarif, çok beğendim.", rating: 5 },
  { id: 18, name: "Fatih Erdem", location: "Sakarya", comment: "yatak odasında fırınlanmış gürgen iskelet varmış baya sağlam bişey gercekten", rating: 4 },
  { id: 19, name: "Nilgün Şahin", location: "Tekirdağ", comment: "Koltukların oturum derinliği tam ideal, çok konforlu bir model.", rating: 5 },
  { id: 20, name: "Kaan Tekin", location: "Balıkesir", comment: "Yemek odası sandalyelerinin ergonomisi çok iyi, saatlerce oturulabilir.", rating: 5 },
  { id: 21, name: "Arzu Bulut", location: "Aydın", comment: "yatak başlığı çok şıık odaya başka bi hava geldi resmen tşkler Qiens Home", rating: 4 },
  { id: 22, name: "Semih Işık", location: "Hatay", comment: "İnegöl koltuk takımı farkını hissettiriyor, işçilik muazzam.", rating: 5 },
  { id: 23, name: "Pelin Uzun", location: "Diyarbakır", comment: "Yemek masası yüzeyi çizilmelere karşı çok dayanıklı çıktı.", rating: 5 },
  { id: 24, name: "Yavuz Sultan", location: "Tokat", comment: "Yatak odası sürgülü dolap mekanizması çok sessiz çalışıyor.", rating: 5 },
  { id: 25, name: "Derya Kaya", location: "Çanakkale", comment: "berjer seçimimiz takıma cok yakıstı baya rahat bısı", rating: 4 },
  { id: 26, name: "Mustafa Demiröz", location: "Sivas", comment: "Yemek masasının tasarımı çok özgün, başka yerde görmediğimiz bir model.", rating: 5 },
  { id: 27, name: "Aslı Çınar", location: "Mardin", comment: "Yatak odası takımı kurulumu hızlıca yapıldı, her şey tıkır tıkır işledi.", rating: 5 },
  { id: 28, name: "Levent Bakır", location: "Malatya", comment: "yemek masasi sandalyeler cok guzel durdu salonumuza gzl oldu", rating: 4 },
  { id: 29, name: "Seda Özkan", location: "Mersin", comment: "Koltuk takımı kumaşı terletme yapmıyor, oturumu çok keyifli.", rating: 5 },
  { id: 30, name: "Turgut Alp", location: "Isparta", comment: "Yatak odası gardırop hacmi çok geniş, tüm kıyafetlerimizi sığdırdık.", rating: 5 },
  { id: 31, name: "Zuhal Yerli", location: "Ordu", comment: "chester koltuk takimi asil duruyo rengine bayildik valla", rating: 4 },
  { id: 32, name: "Kemal Sun", location: "Afyon", comment: "Yemek odasındaki aynalı detaylar salonu çok daha geniş gösterdi.", rating: 5 },
  { id: 33, name: "Sevim Ak", location: "Kırıkkale", comment: "yatak konforu süpper sabahları dinç uyanıorm resmen tsk", rating: 4 },
  { id: 34, name: "Rıdvan Dil", location: "Sinop", comment: "Modern koltuk tasarımı evimizin havasını tamamen değiştirdi.", rating: 5 },
  { id: 35, name: "Filiz Can", location: "Bolu", comment: "Yemek masası takımıyla birlikte gelen konsol çok kullanışlı.", rating: 5 },
  { id: 36, name: "Enes Polat", location: "Erzurum", comment: "yatak odasi takimi cok saglam isciligi gercekten kaliteli baya", rating: 4 },
  { id: 37, name: "Banu Mert", location: "Edirne", comment: "Koltuk takımının yumuşaklığı ve konforu beklediğimizden daha iyi.", rating: 5 },
  { id: 38, name: "Kerem Bür", location: "Uşak", comment: "Yemek masası mermer deseni çok şık, temizliği de oldukça pratik.", rating: 5 },
  { id: 39, name: "Lale Devri", location: "Kütahya", comment: "yatak odasi komodinleri cok kibar odaya cok yakıstı", rating: 4 },
  { id: 40, name: "Yusuf Yaz", location: "Giresun", comment: "Koltuk takımının ayakları çok sağlam, tasarımı da çok modern.", rating: 5 },
  { id: 41, name: "Nazan Önci", location: "Yalova", comment: "Yemek odası takımı mobilyası gerçekten kaliteli, boyası kusursuz.", rating: 5 },
  { id: 42, name: "Murat Bost", location: "Bartın", comment: "yatak odasi dolabi isiklandirmasi cok hos bi detay gercekten cok beğendik", rating: 4 },
  { id: 43, name: "Hande Erç", location: "Karabük", comment: "Berjerin oturum rahatlığı mükemmel, okuma köşem için aldım.", rating: 5 },
  { id: 44, name: "Berat Öz", location: "Düzce", comment: "yemek masasi boyutu 6 kisiye tam ideal cok kullanisli duruo tsk", rating: 4 },
  { id: 45, name: "Selin Şek", location: "Osmaniye", comment: "Yatak odasında kullanılan kumaş başlığı çok yumuşak ve şık.", rating: 5 },
  { id: 46, name: "Tufan Gül", location: "Karaman", comment: "Koltuk takımı sandıklı olması ekstra depolama alanı sağladı.", rating: 5 },
  { id: 47, name: "Kübra Tan", location: "Amasya", comment: "yemek odasi aynali konsol salona bambaska hava katti saolun", rating: 4 },
  { id: 48, name: "Emre Bel", location: "Niğde", comment: "Yatak odası takımı kurulumu çok profesyonelce tamamlandı.", rating: 5 },
  { id: 49, name: "Duygu Asl", location: "Nevşehir", comment: "modern koltuklarin oturumu cok konforlu sirt agrisi kalmadi resmen", rating: 4 },
  { id: 50, name: "Ferit Kor", location: "Kırşehir", comment: "Yemek odası takımı için seçtiğimiz gold detaylar çok lüks duruyor.", rating: 5 },
  { id: 51, name: "Gökçe Bah", location: "Bilecik", comment: "Yatak odası takımı malzemesi çok sağlam, yıllarca kullanılabilir.", rating: 5 },
  { id: 52, name: "Hakan Alt", location: "Kastamonu", comment: "koltuk takimi kollarindaki ahşaplar cok sık bısı duruyo tşk gercekten", rating: 4 },
  { id: 53, name: "İrem Der", location: "Çankırı", comment: "Yemek masasının ayak tasarımı çok estetik, çok memnun kaldık.", rating: 5 },
  { id: 54, name: "Jale Nur", location: "Aksaray", comment: "Yatak başlığındaki kapitone işçiliği çok kaliteli duruyor.", rating: 5 },
  { id: 55, name: "Koray Av", location: "Kırklareli", comment: "koltuk takimi kumasi cok zengin ve saglam duruo begendik", rating: 4 },
  { id: 56, name: "Mina Baş", location: "Bayburt", comment: "Yemek odası takımı montaj ekibi çok hızlı ve titiz çalıştı.", rating: 5 },
  { id: 57, name: "Nuri Bil", location: "Gümüşhane", comment: "yatak odasindaki rayli sistem cok sessiz calisio kaliteli baya", rating: 4 },
  { id: 58, name: "Orhan Pam", location: "Rize", comment: "Koltuk takımı renk seçimi odaya çok canlılık kattı.", rating: 5 },
  { id: 59, name: "Ömer Sey", location: "Artvin", comment: "yemek masasi sandalyeler hasarsız geldi vaktinde tşkler kargo ekibine", rating: 4 },
  { id: 60, name: "Pınar Deniz", location: "Ardahan", comment: "Yatak odası takımı beyaz rengi odayı ferahlattı, çok beğendik.", rating: 5 },
  { id: 61, name: "Rasim Öz", location: "Iğdır", comment: "köşe koltuk tam sigdi odaya kullanımı baya rahat tsk", rating: 4 },
  { id: 62, name: "Suna Kan", location: "Kars", comment: "Yemek odası mobilyası çok ağır ve kaliteli, dokusu çok hoş.", rating: 5 },
  { id: 63, name: "Şener Şen", location: "Erzincan", comment: "yatak konforu sayesinde uykularim cok kaliteli artik tşkler gercekten", rating: 4 },
  { id: 64, name: "Talat Buly", location: "Ağrı", comment: "Koltuk takımı sırt minderleri çok dolgun, çökme yapmıyor.", rating: 5 },
  { id: 65, name: "Ufuk Öz", location: "Muş", comment: "yemek odasi konsolu frenli sistemli cok guvenli tsklar", rating: 4 },
  { id: 66, name: "Vildan At", location: "Bingöl", comment: "Yatak odası aynalı dolap odayı çok daha geniş gösterdi.", rating: 5 },
  { id: 67, name: "Yaman Ak", location: "Bitlis", comment: "inegöl koltuk takimi direkt sanayiden cok uyguna geldi saolun", rating: 4 },
  { id: 68, name: "Zeki Dem", location: "Siirt", comment: "Yemek masasının ahşap dokusu çok doğal ve güzel.", rating: 5 },
  { id: 69, name: "Alara Koç", location: "Şırnak", comment: "yatak odasi takimiyla gelen puf cok tatli duruo sevdim", rating: 5 },
  { id: 70, name: "Barış Man", location: "Hakkari", comment: "Koltuk takımının kumaş rengi katalogdakinden daha güzelmiş.", rating: 5 },
  { id: 71, name: "Ceyda Düv", location: "Mardin", comment: "yemek sandalyeleri hafif ama baya saglam kaliteli bisi tsk", rating: 4 },
  { id: 72, name: "Doğa Rut", location: "Batman", comment: "Yatak odasında kullanılan bazanın amortisörleri çok güçlü.", rating: 5 },
  { id: 73, name: "Ezel Bay", location: "Şanlıurfa", comment: "koltuk takimi oturumu cok genis ferah duruyo salon tsk Qiens Home", rating: 4 },
  { id: 74, name: "Funda Ar", location: "Adıyaman", comment: "Yemek odası aynası çok kaliteli, görüntüyü hiç bozmuyor.", rating: 5 },
  { id: 75, name: "Gülşen Ay", location: "Kahramanmaraş", comment: "yatak basligi isiklandirmasi cok modern bi hava katti odaya tsk", rating: 4 },
  { id: 76, name: "Haluk Bil", location: "Kilis", comment: "Koltukların minder kılıfları yıkanabiliyor olması harika.", rating: 5 },
  { id: 77, name: "Itır Esen", location: "Elazığ", comment: "yemek masasi bacaklari paslanmaz çelik parlio resmen süper bısı", rating: 4 },
  { id: 78, name: "İlker Kal", location: "Tunceli", comment: "Yatak odası takımı karyolası çok dayanıklı, hiç gıcırdamıyor.", rating: 5 },
  { id: 79, name: "Jülide Ate", location: "Bingöl", comment: "kose koltuk kumasi kediye dayanikli cikti valla cok gzl tsk", rating: 4 },
  { id: 80, name: "Kenan İm", location: "Elazığ", comment: "Yemek odası takımı mobilyasındaki işçilik çok hassas.", rating: 5 },
  { id: 81, name: "Leyla Tan", location: "Sivas", comment: "yatak odasinda karyola alti temizliği cok kolay oluo tsklar Qiens Home", rating: 4 },
  { id: 82, name: "Mete Han", location: "Yozgat", comment: "Koltuk takımı minderleri zamanla formunu hiç kaybetmedi.", rating: 5 },
  { id: 83, name: "Nurten Ak", location: "Kırşehir", comment: "yemek masasi rengi sandalyelerle müthis uyumlu duruo tsk", rating: 5 },
  { id: 84, name: "Oktay Kay", location: "Nevşehir", comment: "Yatak odası dolabı iç rafları çok fonksiyonel dizayn edilmiş.", rating: 5 },
  { id: 85, name: "Özge Güre", location: "Çorum", comment: "modern koltuklarin kolcakları cok genis kullanisli bisi sevdim", rating: 4 },
  { id: 86, name: "Polat Ale", location: "Kırıkkale", comment: "Yemek masası takımıyla salonumuz dekorasyon dergisi gibi oldu.", rating: 5 },
  { id: 87, name: "Rana Akd", location: "Çankırı", comment: "yatak odasi komodinleri frenli sistemli cok guvenli tsklar", rating: 4 },
  { id: 91, name: "Vahide Per", location: "Kayseri", comment: "koltuk takimi iskeleti cok saglam oturunca anlasilio tsk", rating: 4 },
  { id: 93, name: "Zuhal Top", location: "Adana", comment: "yatak basligi rengi yatak ortusuyle cok sik durdu tsker", rating: 4 },
  { id: 100, name: "Gökhan Özo", location: "Bursa", comment: "İnegöl'den aldığımız koltuk takımı yıllar geçse de eskimez.", rating: 4 }

]

const Testimonials = () => {
  // Veriyi döngü için çoğaltıyoruz
  const repeatedReviews = [...REVIEWS, ...REVIEWS]

  return (
    <section className="py-12 md:py-32 bg-white overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12 md:mb-24">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="max-w-2xl space-y-8">
             <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Société de Design</span>
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-8xl font-serif text-secondary tracking-tighter leading-[0.9]">
               Müşterilerimizin <br/> 
               <span className="italic font-light text-neutral-300">Hikayeleri.</span>
             </h2>
          </div>
          <div className="text-right hidden lg:block">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest max-w-[200px]">
              Gerçek evlerden, gerçek deneyimler. Sizin memnuniyetiniz bizim sanatımız.
            </p>
          </div>
        </div>
      </div>

      {/* INFINITE SCROLL CONTAINER */}
      <div className="relative flex group">
         <motion.div 
            className="flex gap-12 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
               duration: 350,
               repeat: Infinity,
               ease: "linear"
            }}
         >
            {repeatedReviews.map((rev, idx) => (
              <div 
                key={`${rev.id}-${idx}`}
                className="w-[300px] flex-shrink-0 bg-secondary p-10 rounded-[80px_10px_80px_40px] border border-white/5 flex flex-col justify-between group/card hover:bg-black transition-all duration-1000 min-h-[320px] shadow-2xl"
              >
                 <div className="relative space-y-6">
                    <span className="text-[50px] font-serif text-accent/20 absolute -top-6 -left-2 pointer-events-none group-hover/card:text-accent/30 transition-colors duration-1000">
                      “
                    </span>
                    
                    <div className="flex text-accent gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                        ))}
                    </div>

                    <p className="text-sm md:text-base text-white/90 group-hover/card:text-white leading-relaxed font-serif italic relative z-10 transition-colors duration-1000">
                      {rev.comment}
                    </p>
                 </div>

                 <div className="pt-8 border-t border-white/10 flex items-center justify-between transition-colors duration-1000">
                    <div>
                      <h4 className="font-black text-accent text-[9px] uppercase tracking-[0.2em] transition-colors duration-1000">{rev.name}</h4>
                      <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1 block transition-colors duration-1000 italic">{rev.location}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center bg-white/5">
                       <MapPin size={10} className="text-accent" />
                    </div>
                 </div>
              </div>
            ))}
         </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
