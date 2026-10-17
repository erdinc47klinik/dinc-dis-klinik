/* =========================================================
   NUR DİŞ & DENTAL KLİNİK — kapsamlı offline PWA
   Vanilla JS + localStorage. Gerçek çok-kullanıcı senkronu,
   gerçek ödeme, gerçek Google girişi ve gerçek SMS/e-posta
   bildirimleri için bir sunucu (ör. Firebase) gerekir — bu
   dosyada bu noktalar açıkça yorum satırıyla işaretlendi.
========================================================= */

/* ---------------- VERİ ---------------- */

const SERVICES = [
  { id:"muayene", name:"Diş Muayenesi & Kontrol", price:"Ücretsiz", desc:"Genel ağız sağlığı kontrolü ve yönlendirme.", img:"icon-muayene.png", tone:"teal",
    info:"İlk muayenede ağız içi kontrol edilir, gerekiyorsa röntgen çekilir ve size özel tedavi planı çıkarılır.", before:null, after:null, video:null },
  { id:"temizlik", name:"Diş Temizliği (Detertraj)", price:"900 ₺", desc:"Diş taşı ve leke temizliği, parlatma.", img:"icon-temizlik.png", tone:"teal",
    info:"Ultrasonik cihazla diş taşları temizlenir, ardından parlatma işlemi yapılır. Ortalama 20-30 dakika sürer, ağrısızdır.", before:null, after:null, video:null },
  { id:"dolgu", name:"Dolgu", price:"700–1.500 ₺", desc:"Estetik kompozit dolgu uygulamaları.", img:"icon-dolgu.png", tone:"teal",
    info:"Çürük temizlenir, diş rengiyle uyumlu kompozit malzeme ile doldurulur. Tek seansta tamamlanır.", before:null, after:null, video:null },
  { id:"kanal", name:"Kanal Tedavisi", price:"2.500–4.000 ₺", desc:"Ağrısız kanal tedavisi, tek/çok seans.", img:"icon-kanal.png", tone:"teal",
    info:"Lokal anestezi ile ağrısız şekilde uygulanır. Diş içindeki iltihaplı doku temizlenir, kanallar doldurulur.", before:null, after:null, video:"placeholder" },
  { id:"cekim", name:"Diş Çekimi", price:"800–2.000 ₺", desc:"Basit ve cerrahi çekim işlemleri.", img:"icon-cekim.png", tone:"teal",
    info:"Lokal anestezi altında yapılır. Gömülü/yirmilik diş gibi zor vakalarda cerrahi yöntem uygulanabilir.", before:null, after:null, video:null },
  { id:"beyazlatma", name:"Diş Beyazlatma", price:"3.000 ₺", desc:"Ofis tipi profesyonel beyazlatma.", img:"icon-beyazlatma.png", tone:"teal",
    info:"Diş minesine zarar vermeyen özel jel ve ışık sistemi ile 1 seansta belirgin fark elde edilir.", before:null, after:null, video:null },
  { id:"implant", name:"İmplant", price:"12.000–18.000 ₺", desc:"Tek dişten tam çeneye implant çözümleri.", img:"icon-implant.png", tone:"teal",
    info:"Eksik diş kökünün yerine titanyum vida yerleştirilir, üzerine kalıcı diş yapılır. Süreç ortalama 3-6 ay sürer, ara dönemde geçici diş kullanılır.", before:null, after:null, video:"placeholder" },
  { id:"zirkonyum", name:"Zirkonyum Kaplama", price:"4.500–7.000 ₺ / diş", desc:"Doğal görünümlü, dayanıklı diş kaplaması.", img:"icon-zirkonyum.png", tone:"blue",
    info:"Diş az miktarda küçültülür, ölçü alınır, zirkonyum kaplama üretilip yapıştırılır. Işığı doğal diş gibi yansıtır.", before:null, after:null, video:"placeholder" },
  { id:"ortodonti", name:"Ortodonti (Tel Tedavisi)", price:"Muayene sonrası", desc:"Şeffaf plak ve metal braket seçenekleri.", img:"icon-ortodonti.png", tone:"blue",
    info:"Diş sıralaması ve kapanış bozukluklarını düzeltmek için tel veya şeffaf plak kullanılır. Süreç 6 ay - 2 yıl arasında değişir.", before:null, after:null, video:"placeholder" },
  { id:"seffafplak", name:"Şeffaf Plak", price:"Muayene sonrası", desc:"Görünmez, çıkarılabilir diş düzeltme plakları.", img:"icon-seffafplak.png", tone:"blue",
    info:"Şeffaf, çıkarılabilir plaklar ile fark edilmeden diş düzeltme yapılır. Günde 20-22 saat takılması önerilir.", before:null, after:null, video:null },
  { id:"kopru", name:"Köprü", price:"4.000–9.000 ₺ / diş", desc:"Eksik dişler için sabit köprü protezi.", img:"icon-kopru.png", tone:"blue",
    info:"Eksik dişin iki yanındaki dişler destek alınarak köprü protezi yapılır, sabittir ve çıkarılmaz.", before:null, after:null, video:null },
];

const DOCTORS = [
  { id:"ramazan", name:"Erdinç KÖLÜK", title:"Diş Hekimi — Klinik Sorumlusu", photo:"doctor-photo.jpg",
    school:"Çukurova Üniversitesi Diş Hekimliği Fakültesi mezunu.",
    experience:"5 yıllık klinik deneyim.",
    focus:"İlgi alanları: kanal tedavisi, estetik diş hekimliği (zirkonyum/şeffaf plak) ve implantoloji.",
    bio:"Mesleğe başladığı ilk günden bu yana hastalarının sadece dişlerini değil, kendilerini de rahat hissettikleri bir ortam yaratmayı önceliği haline getirdi. Kanal tedavisi ve implantoloji alanında kendini sürekli güncel tutuyor, her vakayı kendi vakasıymış gibi titizlikle planlıyor. \"Bir hastanın yıllardır sakladığı gülüşünü yeniden özgürce göstermesini izlemek\" diyor, mesleğinin en çok sevdiği anı için — bu yüzden estetik diş hekimliğine ayrı bir tutkuyla yaklaşıyor. Kliniğinde hijyen ve hasta konforunu en az tedavi başarısı kadar önemsiyor." },
];

const DEVICES = [
  { id:"cbct", name:"CBCT (Konik Işınlı Bilgisayarlı Tomografi)", img:"icon-cbct.png",
    desc:"Çene ve diş yapısını 3 boyutlu olarak, milimetrik hassasiyetle görüntüler. Özellikle implant planlamasında sinir kanalı, kemik yoğunluğu ve yapının tam konumunu görmemizi sağlar — bu da işlemi çok daha öngörülebilir ve güvenli hale getirir." },
  { id:"scanner", name:"Ağız İçi 3D Tarayıcı (İntraoral Scanner)", img:"icon-scanner.png",
    desc:"Klasik ölçü kaşığı ve ölçü maddesi yerine ağız içini birkaç dakikada dijital olarak tarar. Kusma hissi ya da rahatsızlık olmadan, çok daha konforlu ve hassas bir ölçü alma deneyimi sunar." },
  { id:"printer3d", name:"3D Yazıcı", img:"icon-printer3d.png",
    desc:"Şeffaf plak, cerrahi rehber ve geçici protez modellerini dijital tasarımdan doğrudan üretir. Bu sayede üretim süresi kısalır ve hassasiyet artar." },
  { id:"panoramic", name:"Dijital Panoramik Röntgen", img:"icon-panoramic.png",
    desc:"Tüm ağız yapısını, çeneleri ve diş köklerini tek karede, klasik filme göre çok daha düşük radyasyon dozuyla görüntüler. Sonuç saniyeler içinde ekranda incelenebilir." },
  { id:"scaler", name:"Diş Taşı Temizleme Ünitesi (Ultrasonik Scaler)", img:"icon-scaler.png",
    desc:"Diş taşı ve renklenmeleri diş minesine zarar vermeden, ultrasonik titreşimle nazikçe temizler." },
  { id:"ledwhite", name:"LED Beyazlatma Sistemi", img:"icon-ledwhite.png",
    desc:"Özel jel ile birlikte kullanılan LED ışık sistemi, tek seansta belirgin ve güvenli bir beyazlatma sonucu sağlar." },
];

/* SMILE_STYLES kaldırıldı - Dişini Tasarla yeni kod bekleniyor */

const PRODUCT_CATEGORIES = [
  { id:"cocuk", name:"Çocuk Ürünleri", items:[
    { id:"c1", name:"Çocuk Diş Fırçası (Yumuşak, Karakterli)", price:80 },
    { id:"c2", name:"Çocuk Diş Macunu (Florürsüz, Meyveli)", price:70 },
  ]},
  { id:"yetiskin", name:"Yetişkin Ürünleri", items:[
    { id:"y1", name:"Diş Fırçası (Orta Sertlik)", price:60 },
    { id:"y2", name:"Diş Macunu (Florürlü)", price:90 },
    { id:"y3", name:"Diş Macunu (Hassas Dişler İçin)", price:110 },
    { id:"y4", name:"Ağız Gargarası (Alkolsüz)", price:120 },
    { id:"y5", name:"Diş İpi", price:40 },
    { id:"y6", name:"Ağız Duşu (Irrigatör)", price:650 },
    { id:"y7", name:"Ev Tipi Beyazlatma Kiti", price:950 },
    { id:"y8", name:"Ortodontik Fırça (Tel Tedavisi İçin)", price:75 },
  ]},
];

const ARTICLES = [
  { group:"Bebekler", title:"İlk diş ne zaman çıkar?", body:"İlk süt dişi genellikle 6 ay civarında çıkar, ancak 3-14 ay arasında çıkması normal kabul edilir. Genellikle önce alt ön kesici dişler görünür. 18 ayda hiç diş çıkmadıysa çocuk diş hekimine danışılması önerilir." },
  { group:"Bebekler", title:"Diş çıkarma belirtileri nelerdir?", body:"Huzursuzluk, diş eti hassasiyeti, salya artışı ve hafif sıcaklık artışı diş çıkarmayla ilişkilendirilebilir. Ancak yüksek ateş, kızarıklık, ishal gibi belirtiler diş çıkarmayla açıklanamaz ve çocuk doktoruna danışılmalıdır." },
  { group:"Bebekler", title:"Diş çıkarma sırasında rahatlatma", body:"Temiz, soğutulmuş (dondurulmamış) bir diş kaşıyıcı, temiz bir parmakla nazik masaj ya da soğuk bir kaşık diş etindeki rahatsızlığı hafifletebilir. Sıvı içerikli ya da kolay kırılabilen plastik kaşıyıcılardan kaçınılmalıdır." },
  { group:"Bebekler", title:"Biberon çürüğü nedir?", body:"Bebeğin gece boyu şekerli sıvı (meyve suyu, şekerli süt) ile emzirilmesi ya da biberonla uyutulması, özellikle üst ön dişlerde hızlı ve yaygın çürümeye yol açabilir. Gece biberonuna sadece su konması önerilir." },
  { group:"Bebekler", title:"Bebeğin ağız bakımına ne zaman başlanmalı?", body:"İlk diş çıkmadan önce bile, her beslenme sonrası diş etleri temiz ve nemli bir gazlı bezle nazikçe silinebilir. İlk diş çıkar çıkmaz, macun kullanmadan parmak fırça ile fırçalamaya başlanabilir." },
  { group:"Bebekler", title:"İlk diş hekimi ziyareti ne zaman olmalı?", body:"Dünya Sağlık Örgütü ve birçok pedodonti uzmanı, ilk diş hekimi ziyaretinin ilk diş çıktıktan sonra, en geç 1 yaşına kadar yapılmasını önerir. Bu ziyaret erken teşhis ve ebeveynlere beslenme/bakım rehberliği açısından önemlidir." },
  { group:"Çocuklar", title:"Süt dişleri neden önemli?", body:"Süt dişleri yalnızca çiğneme için değil, çene ve yüz gelişimi, konuşma becerisi ve kalıcı dişlerin doğru yerden çıkması için de kritik rol oynar. Erken kaybedilen bir süt dişi, kalıcı dişte sıralanma bozukluğuna yol açabilir." },
  { group:"Çocuklar", title:"Çocuklarda fırçalama eğitimi", body:"5-6 yaşına kadar fırçalamayı bir yetişkin yapmalı ya da yakından kontrol etmelidir. 3 yaşına kadar bezelye tanesi büyüklüğünde florürsüz, sonrasında florürlü diş macunu kullanımı önerilir." },
  { group:"Çocuklar", title:"Süt dişleri ne zaman dökülmeye başlar?", body:"Süt dişleri genellikle 5,5-6 yaş civarında dökülmeye başlar ve bu süreç yaklaşık 11-12 yaşına kadar sürer. Toplam 20 süt dişinin yerini kalıcı dişler alır." },
  { group:"Çocuklar", title:"Fissür örtücü (çukur dolgu) nedir?", body:"Azı dişlerinin çiğneme yüzeyindeki derin çukur ve oyuklara uygulanan koruyucu bir tabakadır. Diş dokusu kesilmeden, ağrısız şekilde yapılır ve çürük oluşumunu önemli ölçüde azaltır." },
  { group:"Çocuklar", title:"Çocuğumun diş hekimi korkusu var, ne yapmalıyım?", body:"Ziyaret öncesi sakinleştirici, basit bir dille anlatım yapılması, 'iğne' gibi korkutucu kelimelerden kaçınılması ve geçmişteki kötü deneyimlerin çocuğun yanında konuşulmaması önerilir. Çocuğa özel (pedodonti) yaklaşım süreci çok kolaylaştırır." },
  { group:"Çocuklar", title:"Diş çürüğü bulaşıcı mıdır?", body:"Çürüğe neden olan bakteriler, özellikle bakım veren kişilerin (anne, yakın çevre) tükürüğü yoluyla bebeğe geçebilir. Kaşığı ortak kullanmamak, emziği ağza alıp temizlememek gibi basit önlemler bulaşmayı azaltır." },
  { group:"Yetişkinler", title:"Diş eti iltihabı (gingivitis) nedir?", body:"Diş eti hastalığının ilk ve geri döndürülebilir evresidir. Diş etlerinde kızarıklık, şişlik ve fırçalarken kanama görülür. Düzenli fırçalama, diş ipi ve profesyonel temizlikle tamamen iyileşebilir." },
  { group:"Yetişkinler", title:"Periodontitis (ileri diş eti hastalığı) nedir?", body:"Tedavi edilmeyen gingivitis, dişleri destekleyen kemik ve dokularda geri dönüşü zor hasara yol açan periodontitise ilerleyebilir. Erişkinlerde diş kaybının en sık nedenlerinden biridir; erken teşhis çok önemlidir." },
  { group:"Yetişkinler", title:"Diş eti çekilmesini önlemek", body:"Düzenli 6 aylık kontroller, doğru teknikle ve çok sert olmayan kıllı fırça kullanımı, düzenli profesyonel diş taşı temizliği diş eti çekilmesi riskini azaltır." },
  { group:"Yetişkinler", title:"Diş beyazlatma güvenli mi?", body:"Diş hekimi kontrolünde yapılan profesyonel beyazlatma, mineye kalıcı hasar vermeden güvenli şekilde uygulanır. Hamilelikte, emzirme döneminde ve aşırı hassasiyet durumunda ertelenmesi önerilir." },
  { group:"Yetişkinler", title:"Sigara ağız sağlığını nasıl etkiler?", body:"Sigara ve tütün ürünleri periodontal hastalık riskini belirgin şekilde artırır, iyileşmeyi yavaşlatır ve implant başarısızlığı riskini yükseltir. Bırakmak diş eti sağlığı için en etkili adımlardan biridir." },
  { group:"Yetişkinler", title:"Diş eti sağlığı ile genel sağlık ilişkisi", body:"Bilimsel çalışmalar, ağızdaki kronik iltihabın vücudun başka bölgelerini de etkileyebileceğini, örneğin periodontal hastalığın kalp-damar sağlığı riskiyle ilişkili olabileceğini göstermektedir. Bu da düzenli diş eti bakımını genel sağlık için önemli kılar." },
  { group:"Yetişkinler", title:"Elektrikli fırça mı, manuel fırça mı?", body:"Çalışmalar, elektrikli diş fırçalarının plak temizliğinde manuel fırçalara göre klinik olarak daha etkili olabildiğini gösteriyor. Ancak doğru teknikle kullanılan manuel fırça da yeterli temizliği sağlayabilir." },
  { group:"Yetişkinler", title:"Beslenme ve diş eti sağlığı", body:"Şeker ve rafine karbonhidratı sınırlamak, kalsiyum ve magnezyum açısından zengin besinler (süt ürünleri, badem, yeşil yapraklılar) ve omega-3 tüketmek diş eti iltihabına karşı koruyucu olabilir." },
];

const MYTHS = [
  { wrong:"Diş eti kanaması normaldir, önemli değildir.", right:"Kanama genellikle diş eti iltihabının belirtisidir; kontrole gidilmelidir." },
  { wrong:"Sadece şeker dişe zarar verir.", right:"Asitli içecekler ve meyve suları da diş minesini aşındırır." },
  { wrong:"Diş ağrısı geçtiyse sorun kalmamıştır.", right:"Ağrının kesilmesi bazen sinirin hasar gördüğü anlamına gelir, tedavi şarttır." },
  { wrong:"Süt dişleri önemli değildir, nasılsa dökülecek.", right:"Süt dişleri çene gelişimi ve kalıcı dişlerin konumu için kritik rol oynar." },
  { wrong:"Sert fırçalamak dişleri daha iyi temizler.", right:"Sert fırçalama diş eti çekilmesine ve mine aşınmasına yol açar." },
  { wrong:"Diş beyazlatma dişlere zarar verir.", right:"Hekim kontrolünde yapılan profesyonel beyazlatma mineye kalıcı zarar vermez." },
  { wrong:"Diş eti kanaması olduğunda fırçalamayı bırakmalıyım.", right:"Aksine, nazik ama düzenli fırçalamaya devam etmek iyileşmeyi hızlandırır." },
  { wrong:"Diş ipi sadece büyük parçalar sıkıştığında gerekir.", right:"Diş ipi, fırçanın ulaşamadığı diş aralarındaki günlük plağı temizlemek için her gün kullanılmalıdır." },
  { wrong:"Ağız kokusu her zaman ağız temizliğiyle ilgilidir.", right:"Bazen mide, sinüs ya da sistemik nedenlerden de kaynaklanabilir; geçmiyorsa muayene gerekir." },
  { wrong:"Süt dişi çürüğü kalıcı dişi etkilemez.", right:"Tedavi edilmeyen süt dişi çürüğü altındaki kalıcı diş tomurcuğuna da zarar verebilir." },
];

/* ---------------- ŞİFALI BİTKİLER (yalnızca bilgi amaçlıdır) ----------------
   Bu bölüm tıbbi tavsiye yerine geçmez; tedavi öneren bir kaynak DEĞİLDİR.
   Sorumluluk kullanıcıya aittir, ciddi/uzun süren şikayetlerde mutlaka
   diş hekimine başvurulmalıdır. */
const HERBS = [
  { name:"Karanfil (Karanfil Yağı)", helps:"Geçici diş ağrısı, ağız kokusu", how:"Bir-iki damla karanfil yağı temiz bir pamuğa damlatılıp ağrıyan bölgeye nazikçe dokundurulabilir.", amount:"Günde birkaç kez, az miktarda", caution:"Yutulmamalı, dişetine doğrudan ve fazla miktarda uygulanmamalıdır — tahriş yapabilir." },
  { name:"Adaçayı", helps:"Ağız içi iltihap, boğaz ve diş eti rahatsızlığı", how:"Kaynar suda demlenip ılınmış adaçayı ile gargara yapılabilir.", amount:"Günde 2-3 kez gargara", caution:"Hamilelikte ve uzun süreli yüksek dozda kullanımdan kaçınılmalıdır." },
  { name:"Tuzlu Su", helps:"Diş çekimi sonrası, hafif diş eti iltihabı", how:"Ilık suya bir tatlı kaşığı tuz karıştırılıp nazikçe gargara yapılır.", amount:"Günde 2-3 kez", caution:"Yutulmamalı, çekim sonrası ilk 24 saatte hekim talimatına uyulmalıdır." },
  { name:"Nane", helps:"Ağız kokusu, ferahlık hissi", how:"Taze nane çiğnenebilir ya da nane çayı gargara olarak kullanılabilir.", amount:"Günde birkaç kez", caution:"Ciddi bir yan etkisi bilinmemektedir, ancak reflü hastalarında mide yakınmasını artırabilir." },
  { name:"Papatya", helps:"Ağız içi tahriş, hafif iltihap, rahatlama", how:"Papatya çayı demlenip ılıtıldıktan sonra gargara yapılabilir ya da içilebilir.", amount:"Günde 2-3 kez", caution:"Papatyaya karşı alerjisi olanlar kullanmamalıdır." },
];

const TIME_SLOTS = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];

const NAV_TABS = [
  { id:"home", label:"Ana Sayfa", icon:"home", img:"tab-home.png" },
  { id:"services", label:"Hizmetler", icon:"sparkle", img:"tab-services.png" },
  { id:"booking", label:"Randevu", icon:"calendar", img:"tab-booking.png" },
  { id:"chatbot", label:"DİJİ DENT", icon:"chat", img:"tab-chatbot.png" },
  { id:"more", label:"Diğer", icon:"dots", img:"tab-more.png" },
];

const MORE_ITEMS = [
  { id:"account", label:"Hesabım", img:"icon-account.png" },
  { id:"doctors", label:"Doktorlarımız", img:"icon-doctors.png" },
  { id:"devices", label:"Cihazlarımız", img:"icon-devices.png" },
  { id:"smile", label:"Gülüşünü Tasarla", img:"icon-smile.png" },
  { id:"dentist-game", label:"Dentist Oyunu", img:"dentist-game-logo.png" },

  { id:"reviews", label:"Yorumlar", img:"icon-reviews.png" },
  { id:"store", label:"Mağaza", img:"icon-store.png" },
  { id:"address", label:"Adresimiz", img:"icon-address.png" },
  { id:"contact", label:"İletişim", img:"icon-contact.png" },
  { id:"info", label:"Diş Sağlığı Bilgileri", img:"icon-info.png" },
  { id:"admin-login", label:"Yönetici Girişi", img:"icon-admin.png" },
  { id:"settings", label:"Ayarlar", img:"icon-settings.png" },
];

/* Basit chatbot bilgi tabanı (kural bazlı, gerçek LLM değil — bkz. yorum en altta) */
/* ---------------- ÖZEL ÇİZİLMİŞ İKON KÜTÜPHANESİ ----------------
   Hepsi orijinal, elle çizilmiş SVG path'leri — hiçbir dış ikon
   setinden veya görselden kopyalanmadı, telif riski yoktur. */
const ICONS = {
  home: '<path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />',
  sparkle: '<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />',
  calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 10h16M8 3.5v3M16 3.5v3"/>',
  chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z"/>',
  dots: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.2-6 7-6s7 2.4 7 6"/>',
  monitor: '<rect x="3.5" y="5" width="17" height="12" rx="1.6"/><path d="M9 20h6M12 17v3"/>',
  smile: '<circle cx="12" cy="12" r="8"/><path d="M8.5 13.5c1 1.6 2.2 2.4 3.5 2.4s2.5-.8 3.5-2.4"/><circle cx="9" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r=".9" fill="currentColor" stroke="none"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
  box: '<path d="M12 3.5 20 8v8l-8 4.5L4 16V8z"/><path d="M4 8l8 4.5L20 8M12 12.5V21"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.8"/><path d="M4 6.5l8 6.5 8-6.5"/>',
  book: '<path d="M4 5.5c2.4-1 5-1 7 .3v13c-2-1.3-4.6-1.3-7-.3z"/><path d="M20 5.5c-2.4-1-5-1-7 .3v13c2-1.3 4.6-1.3 7-.3z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  login: '<path d="M11 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H11"/><path d="M14 8l4 4-4 4M18 12H9"/>',
  stethoscope: '<path d="M7 4v5a4 4 0 0 0 8 0V4"/><path d="M11 13v2a5 5 0 0 0 10 0v-1.5"/><circle cx="21" cy="12.3" r="1.4"/><circle cx="7" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/>',
  tooth: '<path d="M12 4c-2.4 0-4 1.3-5.4.4-1.4-1-3 .3-2.7 2.4.3 2 .9 3 1.3 5 .4 2 1 4 2.3 4 1.4 0 1.4-2.6 2.6-2.6s1.2 2.6 2.6 2.6c1.3 0 1.9-2 2.3-4 .4-2 1-3 1.3-5 .3-2.1-1.3-3.4-2.7-2.4C16 5.3 14.4 4 12 4z"/>',
  spiral: '<path d="M12 20a3 3 0 1 1 0-6 5 5 0 1 1 0-10 7 7 0 1 1 0 14"/>',
  extract: '<path d="M9 3v9c0 2.8 1.3 5 3 5s3-2.2 3-5V3"/><path d="M7 21l2.5-4M17 21l-2.5-4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M4.5 12h-3M22.5 12h-3M6 6l-2-2M20 6l-2-2M6 18l-2 2M20 18l2 2"/>',
  implant: '<path d="M8 3h8l-1 6H9z"/><path d="M9.5 9v3.5a2.5 2.5 0 0 0 5 0V9"/><path d="M11.2 12.5l-.6 7.5M12.8 12.5l.6 7.5"/>',
  gem: '<path d="M5 9l3.5-5.5h7L19 9l-7 11.5z"/><path d="M5 9h14M8.5 3.5L9.5 9l2.5 11.5M15.5 3.5L14.5 9 12 20.5"/>',
  brace: '<path d="M4 12h2l1.5-3L9 15l1.5-6L12 12h2l1.5-3L17 15l1.5-6h1.5"/>',
  tray: '<path d="M4.5 9.5c0-2.5 3.4-4.5 7.5-4.5s7.5 2 7.5 4.5-3.4 4.5-7.5 4.5-7.5-2-7.5-4.5z"/><path d="M6 12v2.5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5V12"/>',
  link: '<circle cx="7" cy="12" r="3.2"/><circle cx="17" cy="12" r="3.2"/><path d="M10 12h4"/>',
  scan3d: '<circle cx="12" cy="12" r="7.5"/><path d="M4.5 12a7.5 3 0 0 0 15 0 7.5 3 0 0 0-15 0z"/><path d="M12 4.5v15"/>',
  printer: '<rect x="5" y="9" width="14" height="7" rx="1.4"/><path d="M7.5 9V4.5h9V9M7.5 16v3.5h9V16"/>',
  wand: '<path d="M5 19l9-9"/><path d="M15.5 3.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><circle cx="6" cy="18" r="1.3"/>',
  jaw: '<path d="M4 9c0 6 3.6 10 8 10s8-4 8-10"/><path d="M8 9v3M11 9v4M14 9v4M17 9v3"/>',
};
function icon(name, size=20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
}

const CHATBOT_KB = [
  { keys:["ağrı","acıyor","acı","sızlıyor"], reply:"Diş ağrısı genelde çürük, iltihap ya da kırık dişten kaynaklanır. Ağrı kesici geçici rahatlatabilir ama kaynağı ortadan kaldırmaz — en kısa sürede muayene randevusu almanı öneririm, kliniğimizde aynı gün bakılabiliyoruz.", goto:"booking" },
  { keys:["sgk","sosyal güvenlik","anlaşmalı mı","devlet"], reply:"Şu an için SGK anlaşmamız bulunmuyor. Ama muayene ücretsiz, tedavi fiyatlarımız da makul seviyede tutuyoruz." },
  { keys:["fiyat","ücret","ne kadar","kaç para","pahalı","ucuz"], reply:"Muayene tamamen ücretsizdir! Diğer tedavilerin fiyatı ağzının durumuna göre değişir, net rakamı muayeneden sonra hekimimiz söyler. İstersen hemen ücretsiz muayene randevusu oluşturayım mı?", goto:"booking" },
  { keys:["implant"], reply:"İmplant, eksik diş kökü yerine yerleştirilen titanyum bir vida ve üzerine yapılan kalıcı diştir. Süreç genelde 3-6 ay sürer ama ara dönemde geçici diş kullanılır, günlük hayatını etkilemez. Dr. Erdinç KÖLÜK implant konusunda deneyimli, muayeneye gelip planını çıkarabiliriz.", goto:"services", expand:"implant" },
  { keys:["kanal","kanal tedavisi"], reply:"Kanal tedavisi lokal anestezi ile tamamen ağrısız yapılır — çoğu hasta işlem sırasında hiçbir şey hissetmez. Diş içindeki iltihaplı doku temizlenip kanallar doldurulur. Merak etme, korkulacak bir şey yok.", goto:"services", expand:"kanal" },
  { keys:["beyazlatma","sarı diş","sararma"], reply:"Profesyonel diş beyazlatma diş hekimi kontrolünde tamamen güvenlidir, mineye zarar vermez. Tek seansta belirgin fark görülür. Hamilelikte önerilmez, aşırı hassasiyette hekim değerlendirmesi gerekir.", goto:"services", expand:"beyazlatma" },
  { keys:["dolgu"], reply:"Dolgu, çürük temizlendikten sonra diş rengiyle uyumlu kompozit malzeme ile boşluğun doldurulmasıdır. Tek seansta, ağrısız şekilde tamamlanır.", goto:"services", expand:"dolgu" },
  { keys:["çekim","diş çekimi"], reply:"Diş çekimi lokal anestezi altında ağrısız şekilde yapılır. Gömülü ya da yirmilik diş gibi zor vakalarda cerrahi yöntem uygulanabilir.", goto:"services", expand:"cekim" },
  { keys:["köprü","kopru"], reply:"Köprü, eksik dişin iki yanındaki dişler destek alınarak yapılan sabit bir protezdir, çıkarılmaz.", goto:"services", expand:"kopru" },
  { keys:["randevu","muayene ol","görüşmek istiyorum"], reply:"Hemen Randevu sekmesine yönlendiriyorum, 60 saniyede ücretsiz muayene randevunu oluşturabilirsin.", goto:"booking" },
  { keys:["çocuk","bebek","çocuğum"], reply:"Çocuklarda ilk diş hekimi ziyareti genelde ilk dişin çıkmasıyla ya da 1 yaş civarında önerilir. Kliniğimizde çocuklara özel, ürkütmeyen bir yaklaşımımız var. Bilgi sekmesinde çocuk diş sağlığı hakkında yazılarımız da var.", goto:"info" },
  { keys:["korku","korkuyorum","panik","kaygı"], reply:"Diş hekimi korkusu çok yaygın, yalnız değilsin. Kliniğimizde adım adım anlatarak, acele etmeden ilerliyoruz. İstersen önce sadece tanışma/muayene için gel, hiçbir işlem baskısı olmadan." },
  { keys:["adres","nerede","konum"], reply:"Kliniğimiz Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21'de. Adresimiz sekmesinden QR kodla harita konumuna direkt ulaşabilirsin.", goto:"address" },
  { keys:["telefon","iletişim","numara"], reply:"Bize 0536 597 35 95 numarasından ulaşabilirsin, ya da İletişim sekmesinden mesaj bırakabilirsin.", goto:"contact" },
  { keys:["zirkonyum"], reply:"Zirkonyum kaplama doğal diş görünümüne çok yakın, dayanıklı ve estetik bir çözümdür. Detaylı bilgi için randevu alabilirsin.", goto:"services", expand:"zirkonyum" },
  { keys:["şeffaf plak","plak","invisalign"], reply:"Şeffaf plaklar görünmez şekilde diş düzeltir, günde 20-22 saat takılması gerekir. Tel tedavisine göre daha konforlu bir alternatiftir.", goto:"services", expand:"seffafplak" },
  { keys:["ortodonti","diş teli","tel tedavisi"], reply:"Ortodonti, diş sıralaması ve kapanış bozukluklarını düzeltir; tel ya da şeffaf plak ile uygulanabilir. Hem çocuk hem yetişkinlerde uygulanabilir, yaş sınırı yoktur.", goto:"services", expand:"ortodonti" },
  { keys:["merhaba","selam","iyi günler","günaydın","hey","selamun"], reply:"Merhaba! Dinç Diş Kliniği DİJİ DENT'yum. Diş ağrısı, tedaviler, randevu ya da merak ettiğin herhangi bir konuda sorabilirsin." },
  { keys:["nasılsın","naber","ne haber","iyi misin"], reply:"Ben bir yazılımım, o yüzden günüm falan yok ama hazır ve nazırım 😊 Sen nasılsın, dişlerinle ilgili bir şey mi merak ediyorsun?" },
  { keys:["iyiyim","ben de iyi","güzel","süper","harika"], reply:"Duymak güzel! Diş sağlığınla ilgili merak ettiğin bir şey varsa ya da randevu almak istersen buradayım." },
  { keys:["adın ne","ismin ne","adin"], reply:"Ben DİJİ DENT, Dinç Diş Kliniği'in yapay zeka asistanıyım 😊 Bana diş sağlığın hakkında her şeyi sorabilirsin." },
  { keys:["kaç yaşındasın","yaşın kaç"], reply:"Ben DİJİ DENT, bir yapay zeka asistanıyım, yaşım yok 😄 Ama sana yardımcı olmak için buradayım." },
  { keys:["görüşürüz","hoşça kal","bay bay","kapat"], reply:"Görüşmek üzere! İhtiyacın olursa yine buradayım. İyi günler 👋" },
  { keys:["evet"], reply:"Harika, o zaman seni Randevu sekmesine yönlendiriyorum.", goto:"booking" },
  { keys:["hayır","yok"], reply:"Tamam, sorun değil. Başka merak ettiğin bir şey olursa buradayım." },
  { keys:["şaka","komik","güldürüyorsun"], reply:"😄 Diş hekimliğinde gülmek serbest, hatta önerilir! Başka bir konuda yardımcı olabilir miyim?" },
  { keys:["teşekkür","sağol","eyvallah"], reply:"Rica ederim! Başka bir sorun olursa buradayım. İyi günler dilerim 😊" },
  { keys:["hassasiyet","hassas diş","soğuk sıcak"], reply:"Sıcak-soğuğa hassasiyet genelde mine aşınması, diş eti çekilmesi ya da çürükten kaynaklanır. Hassasiyet macunları geçici rahatlatır ama nedeni bulup tedavi etmek kalıcı çözümdür — bir muayene ile netleştirebiliriz.", goto:"booking" },
  { keys:["diş eti","kanama","kanıyor"], reply:"Diş eti kanaması genelde diş eti iltihabının (gingivit) ilk belirtisidir. Erken fark edilirse detertraj (diş taşı temizliği) ile kolayca düzelir, ihmal edilirse periodontitise ilerleyebilir." },
  { keys:["hamile","hamilelik","gebelik"], reply:"Hamilelikte diş eti daha hassas olabilir, rutin kontrol ve diş temizliği güvenlidir. Röntgen ve bazı tedaviler genelde 2. trimestıra ertelenir, hekimin doktorunla koordineli çalışır." },
  { keys:["şeker hastası","diyabet"], reply:"Diyabet diş eti hastalıklarına yatkınlığı artırır, bu yüzden diyabet hastalarında düzenli diş kontrolü daha da önemlidir. Muayenede şeker durumunu hekimimizle paylaşman yeterli." },
  { keys:["sigara","tütün"], reply:"Sigara diş eti hastalığı, leke, kötü koku ve implant başarısızlığı riskini artırır. Bırakmak zor olsa da diş sağlığın için en büyük iyiliklerden biri olur." },
  { keys:["ağız kokusu","nefes kokusu","kötü koku"], reply:"Ağız kokusunun en sık nedeni diş taşı, çürük ya da dil üzerindeki bakteri birikimidir. Bazen mide/sinüs kaynaklı da olabilir. Detertraj ve düzenli diş ipi kullanımı çoğu vakada işe yarar." },
  { keys:["20 yaş","yirmilik","gömülü diş"], reply:"Yirmilik dişler bazen düzgün çıkamayıp gömülü kalabilir ve ağrı/şişlik yapabilir. Röntgenle durumuna bakıp basit ya da cerrahi çekim gerekip gerekmediğine karar veririz." },
  { keys:["diş gıcırdatma","bruksizm","gece diş sıkma"], reply:"Uykuda diş gıcırdatma (bruksizm) dişlerde aşınma ve çene ağrısına yol açabilir. Gece plağı (night guard) dişlerini korumada oldukça etkilidir, muayenede ölçü alabiliriz." },
  { keys:["çene ağrısı","tme","çenem"], reply:"Çene ekleminde ağrı/tıkırtı (TME rahatsızlığı) stres, diş sıkma ya da kapanış bozukluğundan kaynaklanabilir. Muayenede değerlendirip uygun yönlendirmeyi yaparız." },
  { keys:["aft","yara","mouth ulser"], reply:"Ağız içi aftlar genelde 1-2 haftada kendiliğinden iyileşir. Sık tekrarlıyorsa ya da 2 haftadan uzun sürüyorsa mutlaka kontrol ettirmelisin." },
  { keys:["diş ipi","flos","nasıl kullan"], reply:"Diş ipini dişler arasına nazikçe kaydırıp her dişin yan yüzeyini C harfi şeklinde sararak temizle. Günde en az 1 kez, tercihen gece fırçalamadan önce kullanmalısın." },
  { keys:["elektrikli fırça","manuel fırça"], reply:"Elektrikli fırçalar genelde daha tutarlı ve etkili temizlik sağlar, özellikle diş eti hastalığı olanlarda faydalıdır. Ama doğru teknikle kullanılan manuel fırça da yeterli olabilir." },
  { keys:["kaplama","veneer","kron farkı","laminate"], reply:"Veneer (laminate) dişin sadece ön yüzeyine ince bir kaplama yapar, estetik odaklıdır. Kron (kaplama) ise dişi tüm çevresiyle sarar, daha çok kırık/çürük büyük dişlerde kullanılır." },
  { keys:["kırıldı","düştü","kaza","acil"], reply:"Diş kırılması ya da düşmesi acil bir durumdur! Düşen dişi (kökünden tutmadan) süt ya da tükürükte saklayıp en kısa sürede kliniğe gel — ilk 30-60 dakika çok kritik. Hemen İletişim sekmesinden bize ulaş.", goto:"contact" },
  { keys:["sedasyon","uyutarak","narkoz"], reply:"Aşırı korku ya da uzun işlemlerde sedasyon (bilinç açık ama rahatlamış hal) seçeneğimiz mevcut. Detaylarını muayenede konuşabiliriz." },
  { keys:["taksit","kredi kartı","ödeme planı"], reply:"Tedavi tutarına göre taksit seçeneklerimiz olabilir, detayları resepsiyonumuzdan ya da muayene sırasında öğrenebilirsin." },
  { keys:["çalışma saat","kaçta açık","ne zaman açık"], reply:"Hafta içi 09:00–18:00, Cumartesi 10:00–14:00 arası hizmet veriyoruz. Pazar günleri kapalıyız." },
  { keys:["doktor","hekim","ramazan dağ","kim bakıyor"], reply:"Kliniğimizin sorumlu hekimi Erdinç KÖLÜK, 10 yıllık deneyime sahip implant ve çene cerrahisi uzmanı.", goto:"doctors" },
  { keys:["diyet","beslenme","şekerli"], reply:"Asitli ve şekerli yiyecek/içecekler diş minesini aşındırır. Ana öğünlerle sınırlı tüketim, sonrasında su ile ağzı çalkalamak dişlerini korur." },
  { keys:["röntgen","radyasyon","zararlı mı"], reply:"Dijital diş röntgenleri çok düşük dozda radyasyon içerir, günlük hayattaki doğal radyasyona kıyasla oldukça güvenlidir. Gerekli olmadıkça sık çekilmez." },
  { keys:["ikinci görüş","başka doktor","emin değilim"], reply:"Elbette, kararını rahat verebilmen için ikinci bir görüş almak tamamen normal. Muayenemiz zaten ücretsiz, önce bir gel görüşelim." },
  { keys:["diş çekimi sonrası","çekim sonrası ne yapmalı"], reply:"Çekim sonrası ilk 24 saat sıcak/sert yiyecekten kaçın, çekim bölgesine dilinle/fırçayla dokunma, hafif tuzlu suyla nazikçe çalkala ve doktorun verdiği ilaçları düzenli kullan." },
  { keys:["implant sonrası","implant bakım"], reply:"İmplant sonrası ilk günlerde yumuşak gıdalarla beslenmen, sigaradan uzak durman ve düzenli ağız bakımı yapman iyileşmeyi hızlandırır. Kontrol randevularını aksatmaman önemli." },
  { keys:["sarımsı diş eti","diş eti çekilmesi"], reply:"Diş eti çekilmesi sert fırçalama, diş taşı ya da diş gıcırdatmadan kaynaklanabilir. İlerlemesini durdurmak için erken muayene önemli." },
  { keys:["ne zaman gelmeliyim","6 ayda bir","kontrole ne zaman"], reply:"Sorun olmasa bile 6 ayda bir rutin kontrol öneriyoruz — birçok problem erken evrede hiç belirti vermez." },
  { keys:["ürün","macun","fırça satıyor musunuz"], reply:"Evet, Mağaza sekmesinden çocuk ve yetişkin diş fırçası, macun, gargara, diş ipi ve beyazlatma kiti gibi ürünleri inceleyip sipariş verebilirsin.", goto:"store" },
  { keys:["diş tasarımı","gülüş tasarımı"], reply:"Gülüş tasarımı hakkında detaylı bilgi için kliniğimizi ziyaret edebilirsin. Muayene ücretsizdir!", goto:"services" },
  { keys:["yorum","değerlendirme"], reply:"Yorumlar sekmesinde diğer hastalarımızın deneyimlerini okuyabilir, Google ile giriş yapıp kendi yorumunu da bırakabilirsin.", goto:"reviews" },
  { keys:["kim", "sen kimsin", "asistan mısın"], reply:"Ben DİJİ DENT, Dinç Diş Kliniği'in yapay zeka asistanıyım — diş sağlığı sorularını yanıtlar, kliniğimiz hakkında bilgi veririm ve istersen randevunu da hemen oluşturabilirim." },
  { keys:["dental turizm","yurt dışı","yabancı hasta"], reply:"Yurt dışından gelen hastalarımız da oluyor. Tedavi planını ve süreci muayeneden sonra netleştirip sana özel bir program çıkarabiliriz." },
  { keys:["engelli","özel gereksinim"], reply:"Engelli bireyler ve özel gereksinimli hastalarımız için sabırlı ve esnek bir yaklaşımımız var, ihtiyacına göre randevu süresini ayarlayabiliriz." },
  { keys:["protez bakım","takma diş bakımı"], reply:"Protezler her gün fırçalanmalı, gece ağızda unutulmadan çıkarılıp temiz suda bekletilmeli. Uyumsuzluk hissedilirse kontrol ettirilmesi önerilir." },
  { keys:["apse","şişlik","kist"], reply:"Diş kökünde apse ya da kist, tedavi edilmeyen bir çürük veya enfeksiyonun ilerlemesiyle oluşabilir. Şişlik, zonklama ağrısı varsa beklemeden gelmelisin.", goto:"booking" },
  { keys:["süt dişi implant","süt dişine implant"], reply:"Süt dişlerine implant yapılmaz — çene gelişimi tamamlanmadan implant uygulanamaz. Süt dişi erken kaybedilirse boşluk koruyucu gibi farklı çözümler kullanılır." },
  { keys:["ağız kuruluğu","tükürük azlığı"], reply:"Ağız kuruluğu bazı ilaçların yan etkisi olabilir ve çürük riskini artırır. Bol su tüketimi ve şekersiz sakız çiğnemek tükürük akışını destekleyebilir." },
  { keys:["diş renklenmesi","kahve","çay lekesi"], reply:"Çay, kahve ve sigara diş yüzeyinde zamanla renklenmeye yol açar. Düzenli diş taşı temizliği ve gerekirse profesyonel beyazlatma bu görünümü düzeltir." },
  { keys:["gargara","ağız koruyucu spor"], reply:"Spor yaparken diş travmasına karşı ağız koruyucu (mouthguard) kullanılması önerilir, özellikle temaslı sporlarda diş kırılmalarını önemli ölçüde azaltır." },
];
/* Cloudflare Worker'ı kurduktan sonra aldığın adresi (örn.
   https://dincdis-ai.SENIN-ADIN.workers.dev) aşağıya yapıştır. Boş kaldığı
   sürece asistan otomatik olarak yerel bilgi tabanını kullanır. */
const AI_ENDPOINT_URL = "https://dincdis-worker.erdinc47klinik.workers.dev";
const AI_ENDPOINT_READY = !!AI_ENDPOINT_URL;

const CHATBOT_FALLBACK = "Bu soruyu tam karşılayamadım ama elimden geleni yapayım: diş ağrısı, tedaviler (kanal, implant, beyazlatma, zirkonyum, şeffaf plak vb.), randevu, fiyatlandırma mantığı, çalışma saatlerimiz veya genel ağız bakımı hakkında sorabilirsin. İstersen bu konuyu doğrudan DİJİ DENT'ya sormak için hemen randevu oluşturabilirim — ister misin?";

/* ---------------- STATE ---------------- */

// Küfürlü/argo/ahlaksız kelimeler listesi
const BLOCKED_WORDS = [
  // Küfürler
  "amk", "aq", "amına", "amına koyayım", "sikerim", "sikeyim", "sikim", "sikik",
  "orospu", "orospu çocuğu", "piç", "piç kurusu", "pezevenk", "ibne", "göt",
  "götveren", "yarrak", "yarrak yemek", "am", "amcık", "döl", "döle",
  // Argo
  "lan", "ulan", "oç", "oçocuğu", "pezevenk", "şerefsiz", "namussuz",
  "haysiyetsiz", "alçak", "kaltak", "kaşar", "sürtük", "fahişe",
  // Ahlaksız
  "sikiş", "seks", "porno", "porn", "çingene", "çingene çocuğu",
  "aptal", "gerizekalı", "salak", "mal", "dangalak", "beyinsiz",
  "bok", "bok yemek", "boktan", "pislik", "iğrenç", "rezil"
];

let state = {
  updateAvailable: false,
  expandedDoctor: null,
  lightboxPhoto: null,
  infoTab: "Bebekler",
  screen: "home",
  moreOpen: false,
  appointments: [],
  myAppointments: [],
  announcements: [],
  accounting: { incomes: [], expenses: [], firms: [], bankAccounts: [], invoices: [] },
  treatmentPrices: {},
  autoExpenses: { kira:50000, elektrik:3000, su:1500, dogalgaz:2000, sgk:8000, vergi:5000 },
  bookingForm: { date:"", time:"", name:"", phone:"" },
  bookingStatus: "idle",
  contactForm: { name:"", phone:"", msg:"" },
  contactStatus: "idle",
  reviews: [],
  reviewForm: { name:"", rating:5, text:"" },
  cart: {}, // productId -> qty
  checkoutForm: { name:"", phone:"", address:"" },
  checkoutStatus: "idle",
  chatLog: [{ from:"bot", text:"Merhaba! Ben DİJİ DENT 😊 Dinç Diş Kliniği'in yapay zeka asistanıyım. Diş ağrısı, fiyatlar, randevu ya da aklına takılan her şeyi sorabilirsin." }],
  chatInput: "",
  /* smile state kaldırıldı - Dişini Tasarla yeni kod bekleniyor */
  settings: { muted: false, lang: "tr" },
  adminLoggedIn: false,
  adminForm: { email:"", pass:"" },
  adminError: "",
  blockedUsers: [],  // Engellenen kullanıcı e-postaları
  blockedChatUsers: [],  // DİJİ DENT'da engellenen kullanıcılar (anonymous ID)
  socialMedia: {},  // Sosyal medya linkleri (youtube, instagram, twitter vb.)
  customProducts: [],
  orders: [],
  serviceVideos: {},   // { serviceId: youtubeUrl }
  productImages: {},   // { productId: imageUrl }
  deviceVideos: {},    // { deviceId: youtubeUrl }
  expandedDevice: null,
  expandedService: null,
  user: null,        // Firebase Google ile giriş yapan kullanıcı (null = giriş yapılmamış)
  fbReady: false,     // firebase-init.js yüklenip window.fb hazır olunca true olur
  adminTab: "appointments", // Yönetici paneli aktif sekme
  authBusy: false,
  // Kullanıcı profili
  userProfile: null,  // { firstName, lastName, age, weight, height, brushReminderTime, notificationsEnabled }
  familyMembers: [],  // [{id, name, relation, age, brushReminderTime, streak, lastBrushDate}]
  treatments: [],     // [{id, uid, treatmentName, date, notes, addedBy}]
  badges: [],         // ["first_review", "7_day_streak", ...]
  healthTips: [],     // [{id, text}] - Firebase'den
  dailyTip: "",       // Bugünün ipucu
  brushStreak: 0,     // Diş fırçalama serisi (gün)
  lastBrushDate: null, // Son fırçalama tarihi
  brushingVideoUrl: "", // Çocuklar için diş fırçalama videosu (yönetici ekler)
  doctorPhotoUrl: "", // Doktor fotoğrafı (yönetici değiştirir)
  clinicLogoUrl: "", // Klinik logosu (yönetici değiştirir)
  splashImageUrl: "", // Splash ekranı görseli (yönetici değiştirir)
};

/* ---------------- STORAGE ---------------- */
/* localStorage burada yalnızca Firebase bağlantısı kurulana kadar (ya da
   internetsizken) geçici/offline yedek olarak kullanılır. Firebase hazır
   olduğunda reviews/products/appointments/orders artık Firestore'dan
   gerçek zamanlı gelir — bkz. initFirebaseSync() en alttaki başlatma
   bölümünde. */
function loadAll() {
  // Anonymous chat ID oluştur (eğer yoksa)
  if (!localStorage.getItem('dincdis_chat_id')) {
    localStorage.setItem('dincdis_chat_id', 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  }
  
  try { state.appointments = JSON.parse(localStorage.getItem("dincdis_appointments") || "[]"); } catch(e){ state.appointments = []; }
  try { state.reviews = JSON.parse(localStorage.getItem("dincdis_reviews") || "[]"); } catch(e){ state.reviews = []; }
  try { state.blockedUsers = JSON.parse(localStorage.getItem("dincdis_blocked_users") || "[]"); } catch(e){ state.blockedUsers = []; }
  try { state.blockedChatUsers = JSON.parse(localStorage.getItem("dincdis_blocked_chat_users") || "[]"); } catch(e){ state.blockedChatUsers = []; }
  try { state.socialMedia = JSON.parse(localStorage.getItem("dincdis_social_media") || "{}"); } catch(e){ state.socialMedia = {}; }
  try { state.accounting = JSON.parse(localStorage.getItem("dincdis_accounting") || '{"incomes":[],"expenses":[],"firms":[],"bankAccounts":[],"invoices":[]}'); } catch(e){ state.accounting = {incomes:[],expenses:[],firms:[],bankAccounts:[],invoices:[]}; }
  try { state.treatmentPrices = JSON.parse(localStorage.getItem("dincdis_treatment_prices") || '{}'); } catch(e){ state.treatmentPrices = {}; }
  try { state.autoExpenses = JSON.parse(localStorage.getItem("dincdis_auto_expenses") || '{"kira":50000,"elektrik":3000,"su":1500,"dogalgaz":2000,"sgk":8000,"vergi":5000}'); } catch(e){}
  try { state.customProducts = JSON.parse(localStorage.getItem("dincdis_custom_products") || "[]"); } catch(e){ state.customProducts = []; }
  try { const s = JSON.parse(localStorage.getItem("dincdis_settings")); if (s) state.settings = { ...state.settings, ...s }; } catch(e){}
  
  // Kullanıcı profili ve streak
  loadUserProfile();
}
function persist(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

/* Yönetici girişi artık Firebase Authentication (e-posta/şifre) ile yapılır.
   Hangi e-postanın yönetici sayıldığı firebase-init.js içindeki ADMIN_EMAIL
   sabitinde tanımlıdır — o dosyada kendi admin e-postanla değiştirmen ve
   Firebase konsolunda Authentication > Users kısmından o hesabı oluşturman
   gerekir. */

function allProducts() {
  const extra = state.customProducts.length ? [{ id:"ozel", name:"Diğer Ürünler", items: state.customProducts }] : [];
  return [...PRODUCT_CATEGORIES, ...extra];
}

/* ---------------- YARDIMCI UI PARÇALARI ---------------- */

function scallop() {
  let d = "M0,10 ";
  for (let i=0;i<10;i++) d += `Q${i*10+5},0 ${i*10+10},10 `;
  d += "L100,10 Z";
  return `<svg class="scallop" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="${d}" fill="#F1FAF8"/></svg>`;
}

function topbar(title, subtitle, opts) {
  opts = opts || {};
  const backBtn = opts.back ? `<button class="backbtn" data-action="goto" data-screen="${opts.back}">←</button>` : "";
  return `
    <div class="topbar">
      <div class="topbar-inner">
        ${backBtn}
        <img src="${state.clinicLogoUrl || 'icon-192.png'}" class="logo-badge-img" alt="Dinç Diş logo" />
        <div>
          <p class="eyebrow">Dinç Diş Kliniği</p>
          <h1 class="title">${title}</h1>
          ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
        </div>
      </div>
      ${scallop()}
    </div>`;
}

function stars(n) {
  let s = "";
  for (let i=1;i<=5;i++) s += i<=n ? "★" : "☆";
  return `<span class="stars">${s}</span>`;
}

/* ---------------- HOME ---------------- */

function renderHome() {
  const grid = MORE_ITEMS.map(i => `
    <button class="grid-item" data-action="goto" data-screen="${i.id}">
      ${i.img ? `<img src="${i.img}" class="grid-icon" style="width:52px;height:52px;border-radius:12px;object-fit:cover;" />` : `<span class="grid-icon">${icon(i.icon,22)}</span>`}<span class="grid-label">${t(i.id)}</span>
    </button>`).join("");

  const stats = [
    { n:"5+", tr:"Yıllık Deneyim", en:"Years Experience" },
    { n:String(SERVICES.length)+"+", tr:"Tedavi Çeşidi", en:"Treatment Types" },
    { n:"6", tr:"Gün Açık", en:"Days Open" },
    { n:"%100", tr:"Steril Ortam", en:"Sterile Care" },
  ];

  const quickLinks = [
    { id:"services", label:"Hizmetler" }, { id:"devices", label:"Cihazlarımız" },
    { id:"info", label:"Bilgiler" }, { id:"reviews", label:"Yorumlar" },
    { id:"store", label:"Mağaza" }, { id:"contact", label:"İletişim" },
  ];

  return `
    <div class="topbar" style="background:none;padding:0;">
      <div class="hero" style="background-image:linear-gradient(160deg, rgba(10,92,82,.88), rgba(46,143,192,.82)), url('clinic-hero.jpg');">
        <div class="hero-inner">
          <img src="${state.clinicLogoUrl || 'icon-192.png'}" class="logo-badge-img" alt="Dinç Diş logo" />
          <p class="eyebrow">Dinç Diş Kliniği</p>
          <h1 class="title" style="font-size:26px;">Gülümsemenin adresi</h1>
          <p class="subtitle">Adana, Seyhan'de güven veren bakım.</p>
        </div>
        ${scallop()}
      </div>
    </div>
    <div class="content">
      <div class="card p5 mb4" style="border-color:var(--cta);">
        <div class="row-start">
          <img src="tab-quickbook.png" style="width:48px;height:48px;border-radius:12px;object-fit:contain;" />
          <div>
            <p class="name" style="font-size:17px;">Hızlı randevu</p>
            <p class="desc">60 saniyede muayene randevusu oluştur, biz seni arayalım.</p>
            <button class="linklike" data-action="goto" data-screen="booking">Randevu al &rarr;</button>
          </div>
        </div>
      </div>

      <div class="card p4 mb5 row">
        <img src="${state.doctorPhotoUrl || 'doctor-photo.jpg'}" class="avatar-sm" alt="Erdinç KÖLÜK" />
        <div>
          <p class="name" style="font-size:14px;">Erdinç KÖLÜK</p>
          <p class="desc">Klinik sorumlu hekimi · 5 yıl deneyim</p>
        </div>
      </div>

      <div class="stats-band mb5">
        ${stats.map(s => `<div class="stat-cell"><p class="stat-num">${s.n}</p><p class="stat-tr">${s.tr}</p><p class="stat-en">${s.en}</p></div>`).join("")}
      </div>

      ${(state.announcements || []).length > 0 ? `
      <p class="section-label">📢 Duyurular</p>
      <div class="mb5">
        ${(state.announcements || []).slice(0,3).map(a => `
          <div class="card p4 mb3" style="border-left:3px solid var(--cta);">
            <p class="name" style="font-size:14px;margin:0;">📢 ${escapeHtml(a.title || "")}</p>
            <p class="desc" style="margin:6px 0;line-height:1.5;">${escapeHtml(a.text || "")}</p>
            ${a.imageUrl ? `<img src="${a.imageUrl}" style="width:100%;border-radius:12px;margin-top:8px;display:block;" />` : ''}
            ${a.videoUrl ? `<div style="margin-top:8px;"><a href="${escapeAttr(a.videoUrl)}" target="_blank" class="btn-primary" style="text-decoration:none;display:flex;padding:10px;font-size:13px;">🎥 Videoyu İzle</a></div>` : ''}
            <p class="footnote" style="margin-top:6px;">${a.createdAt ? new Date(a.createdAt).toLocaleDateString("tr-TR", {day:'numeric',month:'long',year:'numeric'}) : ''}</p>
          </div>
        `).join("")}
      </div>
      ` : ''}

      <p class="section-label">Hızlı erişim</p>
      <div class="menu-grid mb5">${grid}</div>

      <p class="section-label">Öne çıkan hizmetler</p>
      <div class="hscroll mb5">
        ${SERVICES.slice(0,6).map(s => `
          <div class="mini-card" data-action="goto-service" data-id="${s.id}">
            ${s.img ? `<img src="${s.img}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />` : `<div>${icon(s.icon,18)}</div>`}
            <p class="name">${s.name}</p>
          </div>`).join("")}
      </div>

      <div class="footer-band">
        <p class="footer-tagline">Modern teknoloji ve uzman kadromuzla sağlıklı gülüşler tasarlıyoruz.</p>
        <div class="footer-links">
          ${quickLinks.map(l => `<button class="footer-link" data-action="goto" data-screen="${l.id}">${l.label}</button>`).join("")}
        </div>
        <p class="footer-phone">${icon("mail",14)} 0536 597 35 95</p>
      </div>
    </div>`;
}

/* ---------------- HİZMETLER ---------------- */

function youtubeEmbedUrl(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function renderServices() {
  const items = SERVICES.map(s => {
    const expanded = state.expandedService === s.id;
    let detail = "";
    if (expanded) {
      let media = "";
      if (s.before || s.after) {
        media = `<div class="before-after">
          ${s.before ? `<div><span class="ba-label">Öncesi/Örnek</span><img src="${s.before}" /></div>` : ""}
          ${s.after ? `<div><span class="ba-label">Sonrası/Süreç</span><img src="${s.after}" /></div>` : ""}
        </div>`;
      }
      const ytUrl = state.serviceVideos[s.id];
      const embed = youtubeEmbedUrl(ytUrl);
      let video = "";
      if (embed) {
        video = `<div class="video-box"><iframe src="${embed}" style="width:100%;aspect-ratio:16/9;border:none;border-radius:12px;" allowfullscreen loading="lazy"></iframe></div>`;
      } else {
        video = `<div class="video-box"><div class="video-placeholder">▶️<br/><span>Tanıtım videosu yakında eklenecek</span></div></div>`;
      }
      detail = `<div class="service-detail">
        <p class="desc" style="margin-bottom:10px;">${s.info}</p>
        ${media}${video}
      </div>`;
    }
    return `
    <div class="card p4 mb3">
      <div class="row" data-action="toggle-service" data-id="${s.id}" style="cursor:pointer;">
        ${s.img ? `<img src="${s.img}" style="width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0;" />` : `<div class="badge ${s.tone==='blue'?'badge-blue':'badge-teal'}">${icon(s.icon,20)}</div>`}
        <div style="flex:1;padding-right:8px;">
          <p class="name">${s.name}</p>
          <p class="desc">${s.desc}</p>
        </div>
      </div>
      ${detail}
    </div>`;
  }).join("");
  return `${topbar("Hizmetler","Kartlara dokunarak detay, görsel ve tanıtım videosunu görebilirsin.")}
    <div class="content">${items}</div>`;
}

/* ---------------- DOKTORLAR ---------------- */

function renderDoctors() {
  const cards = DOCTORS.map(d => {
    const expanded = state.expandedDoctor === d.id;
    return `
    <div class="card p5 mb3">
      <div class="row-start" data-action="toggle-doctor" data-id="${d.id}" style="cursor:pointer;">
        <img src="${state.doctorPhotoUrl || d.photo}" class="avatar-lg" alt="${d.name}" data-action="open-lightbox" data-src="${state.doctorPhotoUrl || d.photo}" style="cursor:zoom-in;" />
        <div>
          <p class="name" style="font-size:18px;">${d.name}</p>
          <p class="desc" style="color:var(--tealLight);font-weight:500;margin-top:2px;">${d.title}</p>
          <p class="desc" style="margin-top:8px;">${d.school}</p>
          <p class="desc">${d.experience}</p>
          <p class="desc">${d.focus}</p>
        </div>
      </div>
      ${expanded ? `<div class="service-detail"><p class="desc">${d.bio}</p></div>` : `<button class="linklike" style="margin-top:10px;" data-action="toggle-doctor" data-id="${d.id}">Daha fazla oku →</button>`}
    </div>`;
  }).join("");
  return `${topbar("Doktorlarımız","Kliniğimizde görev yapan uzman hekimler.", {back:"home"})}<div class="content">${cards}</div>`;
}

/* ---------------- CİHAZLARIMIZ ---------------- */

function renderDevices() {
  const cards = DEVICES.map(d => {
    const expanded = state.expandedDevice === d.id;
    let detail = "";
    if (expanded) {
      const ytUrl = state.deviceVideos[d.id];
      const embed = youtubeEmbedUrl(ytUrl);
      detail = `<div class="service-detail">
        ${embed
          ? `<div class="video-box"><iframe src="${embed}" style="width:100%;aspect-ratio:16/9;border:none;border-radius:12px;" allowfullscreen loading="lazy"></iframe></div>`
          : `<div class="video-box"><div class="video-placeholder">${icon("monitor",22)}<br/><span>Bu cihazın tanıtım videosu yakında eklenecek</span></div></div>`}
      </div>`;
    }
    return `
    <div class="card p4 mb3">
      <div class="row" data-action="toggle-device" data-id="${d.id}" style="cursor:pointer;">
        ${d.img ? `<img src="${d.img}" style="width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0;" />` : `<div class="badge badge-blue">${icon(d.icon,22)}</div>`}
        <div><p class="name" style="font-size:15px;">${d.name}</p><p class="desc">${d.desc}</p></div>
      </div>
      ${detail}
    </div>`;
  }).join("");
  return `${topbar("Cihazlarımız","Son teknoloji, yapay zeka destekli görüntüleme ve üretim cihazları. Kartlara dokunarak tanıtım videosunu izleyebilirsin.", {back:"home"})}
    <div class="content">${cards}</div>`;
}

/* ---------------- GÜLÜŞÜNÜ TASARLA (kamera + yüz takibi) ---------------- */

/* ---------------- REFERANSLAR ---------------- */

/* ---------------- GİRİŞ GEREKTİREN İŞLEMLER İÇİN ORTAK KART ---------------- */
function authGate(message) {
  if (state.user) return "";
  return `<div class="card p4 mb4" style="text-align:center;">
    <p class="desc" style="margin-bottom:10px;">${message}</p>
    <button class="btn-primary" data-action="google-signin" ${state.authBusy?"disabled":""}>${state.authBusy ? "Giriş yapılıyor…" : "🔵 Google ile Giriş Yap"}</button>
  </div>`;
}

const LANGS = [
  { id:"tr", label:"Türkçe" }, { id:"en", label:"English" }, { id:"ar", label:"العربية" },
  { id:"de", label:"Deutsch" }, { id:"es", label:"Español" },
];

/* Arayüz (menü/başlık/buton) çevirileri. İçerik (makaleler, asistan
   cevapları) şimdilik yalnızca Türkçedir — bu ayrı, çok daha büyük bir iştir. */
const I18N = {
  tr: { home:"Ana Sayfa", services:"Hizmetler", booking:"Randevu", chatbot:"DİJİ DENT", more:"Diğer",
    account:"Hesabım", doctors:"Doktorlarımız", devices:"Cihazlarımız",
    reviews:"Yorumlar", store:"Mağaza", address:"Adresimiz", contact:"İletişim", info:"Diş Sağlığı Bilgileri",
    "admin-login":"Yönetici Girişi", settings:"Ayarlar", campaigns:"Kampanyalar", save:"Kaydet", send:"Gönder" },
  en: { home:"Home", services:"Services", booking:"Appointment", chatbot:"DİJİ DENT", more:"More",
    account:"My Account", doctors:"Our Doctors", devices:"Our Devices", smile:"Design Your Smile",
    reviews:"Reviews", store:"Store", address:"Our Address", contact:"Contact", info:"Dental Health Info",
    "admin-login":"Admin Login", settings:"Settings", campaigns:"Campaigns", save:"Save", send:"Send" },
  ar: { home:"الرئيسية", services:"الخدمات", booking:"موعد", chatbot:"DİJİ DENT", more:"المزيد",
    account:"حسابي", doctors:"أطباؤنا", devices:"أجهزتنا", smile:"صمم ابتسامتك",
    reviews:"التقييمات", store:"المتجر", address:"عنواننا", contact:"تواصل معنا", info:"معلومات صحة الأسنان",
    "admin-login":"دخول المدير", settings:"الإعدادات", campaigns:"العروض", save:"حفظ", send:"إرسال" },
  de: { home:"Start", services:"Leistungen", booking:"Termin", chatbot:"DİJİ DENT", more:"Mehr",
    account:"Mein Konto", doctors:"Unsere Ärzte", devices:"Unsere Geräte", smile:"Lächeln gestalten",
    reviews:"Bewertungen", store:"Shop", address:"Unsere Adresse", contact:"Kontakt", info:"Zahngesundheit",
    "admin-login":"Admin-Login", settings:"Einstellungen", campaigns:"Aktionen", save:"Speichern", send:"Senden" },
  es: { home:"Inicio", services:"Servicios", booking:"Cita", chatbot:"DİJİ DENT", more:"Más",
    account:"Mi Cuenta", doctors:"Nuestros Doctores", devices:"Nuestros Equipos", smile:"Diseña tu Sonrisa",
    reviews:"Reseñas", store:"Tienda", address:"Nuestra Dirección", contact:"Contacto", info:"Salud Dental",
    "admin-login":"Acceso Admin", settings:"Ajustes", campaigns:"Promociones", save:"Guardar", send:"Enviar" },
};
function t(key) {
  const lang = (state.settings && state.settings.lang) || "tr";
  return (I18N[lang] && I18N[lang][key]) || I18N.tr[key] || key;
}

function renderSettings() {
  const s = state.settings;
  return `${topbar("Ayarlar","Uygulama tercihlerini buradan yönetebilirsin.", {back:"home"})}
    <div class="content">
      <div class="card p4 mb4 row" style="justify-content:space-between;">
        <div><p class="name" style="font-size:14px;">Uygulama sesleri</p><p class="desc">Tıklama, giriş ve bildirim sesleri</p></div>
        <button class="chip ${s.muted?'':'chip-active'}" data-action="toggle-mute">${s.muted ? "Kapalı" : "Açık"}</button>
      </div>
      <p class="section-label">Uygulama dili</p>
      <p class="footnote" style="margin-top:-6px;">Menü ve başlıklar seçtiğin dile döner. (Not: makale/asistan içerikleri şimdilik yalnızca Türkçedir.)</p>
      <div class="chip-row mb4" style="flex-wrap:wrap;">
        ${LANGS.map(l => `<button class="chip ${s.lang===l.id?'chip-active':''}" data-action="set-lang" data-id="${l.id}">${l.label}</button>`).join("")}
      </div>
    </div>`;
}

/* ============ ROZET TANIMLARI ============ */
const BADGE_DEFS = [
  { id: "first_review", name: "İlk Yorum", icon: "⭐", desc: "İlk yorumunu yazdı" },
  { id: "first_appointment", name: "İlk Randevu", icon: "📅", desc: "İlk randevusunu aldı" },
  { id: "7_day_streak", name: "7 Gün", icon: "🔥", desc: "7 gün üst üste fırçaladı" },
  { id: "14_day_streak", name: "14 Gün", icon: "💪", desc: "14 gün üst üste fırçaladı" },
  { id: "30_day_streak", name: "30 Gün", icon: "🏅", desc: "30 gün üst üste fırçaladı" },
  { id: "60_day_streak", name: "60 Gün", icon: "🥇", desc: "60 gün üst üste fırçaladı" },
  { id: "100_day_streak", name: "100 Gün", icon: "👑", desc: "100 gün üst üste fırçaladı" },
  { id: "365_day_streak", name: "365 Gün", icon: "🏆", desc: "Bir yıl üst üste fırçaladı!" },
  { id: "family_member", name: "Aile", icon: "👨‍👩‍👧", desc: "Aile üyesi ekledi" },
  { id: "profile_complete", name: "Tam Profil", icon: "✅", desc: "Tüm profil bilgilerini doldurdu" },
];

const DEFAULT_HEALTH_TIPS = [
  "Günde en az 2 kez, 2 dakika diş fırçalamak diş sağlığınız için en önemli adımdır.",
  "Diş ipi kullanmak diş eti hastalıklarını %40 oranında azaltır.",
  "Şekerli yiyeceklerden sonra ağzınızı su ile çalkalamak çürük riskini azaltır.",
  "Diş fırçanızı her 3 ayda bir değiştirmeyi unutmayın.",
  "Florürlü diş macunu kullanmak diş minesini güçlendirir.",
  "Düzenli diş kontrolü, sorunları erken teşhis etmenin en iyi yoludur.",
  "Çay ve kahve dişlerde lekelenmeye neden olabilir, ardından su için.",
  "Sert kıllı diş fırçası diş etlerine zarar verebilir, yumuşak kıllı tercih edin.",
  "Dil temizliği ağız kokusunu %70 oranında azaltır.",
  "Süt ürünleri kalsiyum açısından zengindir ve dişleri güçlendirir.",
  "Çocuklarda diş fırçalama alışkanlığı 2 yaşından itibaren kazandırılmalıdır.",
  "Diş sıkma ve gıcırdatma, dişlere ciddi zarar verebilir — farkında olun.",
  "Elma ve havuç gibi sert meyveler doğal diş temizleyici görevi görür.",
  "Sigara diş eti hastalıklarının en büyük nedenlerinden biridir.",
  "Ağız gargarası, fırçalamanın ulaşamadığı bölgeleri temizlemeye yardımcı olur.",
];

function renderAccount() {
  if (!state.user) {
    return `${topbar("Hesabım","Randevu almak, yorum yapmak ve sipariş vermek için giriş yap.", {back:"home"})}
      <div class="content">
        <div class="card p5" style="text-align:center;">
          <div style="font-size:64px;margin-bottom:16px;">👤</div>
          <p class="name" style="font-size:18px;margin-bottom:8px;">Hoş Geldiniz!</p>
          <p class="desc" style="margin-bottom:24px;">Randevu almak, yorum yapmak ve profilinizi yönetmek için Google ile giriş yapın.</p>
          <button class="btn-primary" data-action="sign-in-google" style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;font-size:16px;">
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Google ile Giriş Yap
          </button>
        </div>
      </div>`;
  }

  const p = state.userProfile || {};
  const bmi = (p.weight && p.height) ? (p.weight / Math.pow(p.height/100, 2)).toFixed(1) : null;
  const bmiLabel = bmi ? (bmi < 18.5 ? "Zayıf" : bmi < 25 ? "Normal" : bmi < 30 ? "Fazla Kilolu" : "Obez") : "";
  const bmiColor = bmi ? (bmi < 18.5 ? "#3498db" : bmi < 25 ? "#27ae60" : bmi < 30 ? "#f39c12" : "#e74c3c") : "";
  const streak = state.brushStreak || 0;
  const todayBrushed = state.lastBrushDate === new Date().toDateString();

  // 6 aylık kontrol hatırlatma
  const lastCheckup = p.lastCheckup ? new Date(p.lastCheckup) : null;
  const nextCheckup = lastCheckup ? new Date(lastCheckup.getTime() + 180*24*60*60*1000) : null;
  const daysUntilCheckup = nextCheckup ? Math.ceil((nextCheckup - new Date()) / (24*60*60*1000)) : null;

  return `${topbar("Profilim","Kişisel bilgileriniz ve diş sağlığı araçlarınız.", {back:"home"})}
    <div class="content">
      
      <!-- Profil Kartı -->
      <div class="card p4 mb4">
        <div class="row" style="justify-content:space-between;align-items:center;">
          <div class="row" style="gap:12px;">
            <div class="badge badge-teal">${icon("user",22)}</div>
            <div>
              <p class="name" style="font-size:16px;">${escapeHtml(p.firstName && p.lastName ? p.firstName + " " + p.lastName : (state.user.name || "Kullanıcı"))}</p>
              <p class="desc">${escapeHtml(state.user.email || "")}</p>
            </div>
          </div>
          <button class="qty-btn" style="width:auto;padding:8px 16px;" data-action="edit-profile">✏️ Düzenle</button>
        </div>
      </div>

      <!-- Diş Fırçalama Serisi -->
      <div class="card p4 mb4" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;">
        <div style="text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">🔥</div>
          <p style="font-size:32px;font-weight:700;margin:0;">${streak} Gün</p>
          <p style="font-size:14px;opacity:0.9;margin:4px 0 16px;">Diş Fırçalama Serisi</p>
          ${todayBrushed 
            ? `<button class="btn-primary" style="background:rgba(255,255,255,0.2);color:white;border:2px solid white;" disabled>✅ Bugün Fırçaladın!</button>`
            : `<button class="btn-primary" style="background:white;color:#764ba2;" data-action="brush-teeth">🪥 Fırçaladım!</button>`
          }
        </div>
      </div>

      <!-- BMI Hesaplama -->
      ${p.weight && p.height ? `
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 12px;">⚖️ Vücut Kitle İndeksi</p>
        <div style="text-align:center;">
          <p style="font-size:42px;font-weight:700;color:${bmiColor};margin:0;">${bmi}</p>
          <p style="font-size:16px;color:${bmiColor};font-weight:600;margin:4px 0;">${bmiLabel}</p>
          <p class="footnote" style="margin:8px 0 0;">${p.weight} kg · ${p.height} cm${p.age ? " · " + p.age + " yaş" : ""}</p>
        </div>
      </div>` : `
      <div class="card p4 mb4" style="border:2px dashed var(--border);">
        <p class="desc" style="text-align:center;margin:0;">⚖️ BMI hesaplama için profilinizi düzenleyip kilo ve boy bilgilerinizi girin.</p>
      </div>`}

      <!-- Diş Fırçalama Videosu (Çocuklar İçin) -->
      ${state.brushingVideoUrl ? `
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 12px;">🎬 Eğlenceli Diş Fırçalama (2 dk)</p>
        <p class="footnote" style="margin:0 0 12px;">Çocuklar için eğlenceli 2 dakikalık diş fırçalama videosu. Videoyu izlerken dişlerini fırçala!</p>
        <button class="btn-primary" data-action="watch-brush-video" style="width:100%;">▶️ Videoyu İzle</button>
      </div>` : ""}

      <!-- Günlük İpucu -->
      ${state.dailyTip ? `
      <div class="card p4 mb4" style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:white;">
        <p style="font-size:12px;font-weight:600;opacity:0.9;margin:0 0 6px;">💡 GÜNÜN DİŞ SAĞLIĞI İPUCU</p>
        <p style="font-size:15px;margin:0;line-height:1.5;">${escapeHtml(state.dailyTip)}</p>
      </div>` : ""}

      <!-- Rozetler -->
      ${state.badges.length > 0 ? `
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 12px;">🏆 Rozetlerim</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${state.badges.map(b => {
            const badgeDef = BADGE_DEFS.find(d => d.id === b);
            return badgeDef ? `<div style="background:var(--bg);border-radius:12px;padding:8px 12px;text-align:center;min-width:80px;">
              <div style="font-size:24px;">${badgeDef.icon}</div>
              <p style="font-size:11px;margin:4px 0 0;font-weight:500;">${badgeDef.name}</p>
            </div>` : "";
          }).join("")}
        </div>
      </div>` : ""}

      <!-- Aile Üyeleri -->
      <div class="card p4 mb4">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <p class="section-label" style="margin:0;">👨‍👩‍👧‍👦 Aile Üyeleri</p>
          <button class="qty-btn" style="width:auto;padding:6px 14px;" data-action="add-family-member">+ Ekle</button>
        </div>
        ${(state.familyMembers || []).length > 0 ? state.familyMembers.map(fm => `
          <div class="card p3 mb2" style="background:var(--bg);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <p class="desc" style="margin:0;font-weight:600;">${escapeHtml(fm.name)} <span style="font-weight:400;opacity:0.7;">(${escapeHtml(fm.relation || "")})</span></p>
                <p class="footnote" style="margin:2px 0 0;">${fm.age ? fm.age + " yaş" : ""} · 🔥 ${fm.streak || 0} gün seri</p>
              </div>
              <div style="display:flex;gap:6px;">
                <button class="qty-btn" style="padding:4px 8px;" data-action="edit-family-member" data-id="${fm.id}">✏️</button>
                <button class="qty-btn" style="padding:4px 8px;background:var(--bad);color:#fff;" data-action="remove-family-member" data-id="${fm.id}">🗑️</button>
              </div>
            </div>
          </div>
        `).join("") : `<p class="footnote">Henüz aile üyesi eklenmedi. Çocuklarınızın diş fırçalama takibini buradan yapabilirsiniz.</p>`}
      </div>

      <!-- Tedavi Geçmişi -->
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 12px;">🦷 Tedavi Geçmişim</p>
        ${(() => {
          const email = state.user?.email || "";
          const fullName = ((p.firstName || "") + " " + (p.lastName || "")).trim();
          const myTreatments = (state.treatments || []).filter(t => 
            t.userName === email || t.userName === fullName || t.userName === (p.firstName || "") || t.uid === state.user?.uid
          );
          return myTreatments.length > 0 ? myTreatments.slice().reverse().map(t => `
            <div class="card p3 mb2" style="background:var(--bg);">
              <p class="desc" style="margin:0;font-weight:600;">${escapeHtml(t.treatmentName)}</p>
              <p class="footnote" style="margin:2px 0 0;">📅 ${escapeHtml(t.date || "")} ${t.notes ? "· " + escapeHtml(t.notes) : ""}</p>
            </div>
          `).join("") : `<p class="footnote">Henüz tedavi kaydı yok. Yönetici tarafından eklendiğinde burada görünecek.</p>`;
        })()}
      </div>

      <!-- Randevu Geçmişi -->
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 12px;">📅 Randevu Geçmişim</p>
        ${(state.appointments || []).filter(a => a.uid === state.user?.uid).slice().reverse().map(a => `
          <div class="card p3 mb2" style="background:var(--bg);">
            <p class="desc" style="margin:0;">${escapeHtml(a.date || "")} ${escapeHtml(a.time || "")}</p>
          </div>
        `).join("") || `<p class="footnote">Henüz randevu geçmişiniz yok.</p>`}
      </div>

      <!-- Hatırlatmalar -->
      <div class="card p4 mb4">
        <p class="section-label" style="margin:0 0 16px;">🔔 Hatırlatmalar</p>
        
        <div style="margin-bottom:16px;">
          <p class="desc" style="margin:0 0 8px;font-weight:500;">🪥 Diş Fırçalama Hatırlatması</p>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="time" class="input" id="brush-time" value="${escapeAttr(p.brushReminderTime || "21:00")}" style="flex:1;" />
            <button class="qty-btn" style="width:auto;padding:8px 16px;" data-action="save-brush-time">Kaydet</button>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <p class="desc" style="margin:0 0 8px;font-weight:500;">🏥 6 Aylık Diş Kontrolü</p>
          ${daysUntilCheckup !== null ? `
            <p class="desc" style="margin:0;color:${daysUntilCheckup <= 30 ? 'var(--bad)' : 'var(--teal)'};">
              ${daysUntilCheckup > 0 ? `📅 ${daysUntilCheckup} gün sonra (${nextCheckup.toLocaleDateString("tr-TR")})` : "⚠️ Kontrol zamanı geldi! Randevu alın."}
            </p>
            <button class="qty-btn" style="margin-top:8px;width:auto;padding:8px 16px;" data-action="mark-checkup-done">✓ Kontrolü Yapıldı İşaretle</button>
          ` : `
            <p class="footnote" style="margin:0;">Henüz kontrol tarihi kaydedilmedi.</p>
            <button class="qty-btn" style="margin-top:8px;width:auto;padding:8px 16px;" data-action="mark-checkup-done">📅 Bugün Kontrol Vardı</button>
          `}
        </div>

        <div>
          <p class="desc" style="margin:0 0 8px;font-weight:500;">🔕 Bildirim Ayarları</p>
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" ${p.notificationsEnabled !== false ? 'checked' : ''} data-action="toggle-notifications" style="width:20px;height:20px;" />
            <span class="desc" style="margin:0;">Bildirimleri etkinleştir</span>
          </label>
        </div>
      </div>

      <!-- Çıkış -->
      <button class="btn-primary" style="background:var(--bad);width:100%;" data-action="sign-out">Çıkış Yap</button>
    </div>`;
}

function renderProfileEdit() {
  const p = state.userProfile || {};
  return `${topbar("Profili Düzenle","Kişisel bilgilerinizi güncelleyin.", {back:"account"})}
    <div class="content">
      <div class="card p5">
        <div class="field"><label>Ad</label><input class="input" id="pf-first" placeholder="Adınız" value="${escapeAttr(p.firstName||"")}" /></div>
        <div class="field"><label>Soyad</label><input class="input" id="pf-last" placeholder="Soyadınız" value="${escapeAttr(p.lastName||"")}" /></div>
        <div class="field"><label>Yaş</label><input class="input" id="pf-age" type="number" placeholder="Yaşınız" value="${escapeAttr(p.age||"")}" /></div>
        <div class="field"><label>Kilo (kg)</label><input class="input" id="pf-weight" type="number" placeholder="Kilonuz" value="${escapeAttr(p.weight||"")}" /></div>
        <div class="field"><label>Boy (cm)</label><input class="input" id="pf-height" type="number" placeholder="Boyunuz" value="${escapeAttr(p.height||"")}" /></div>
        <button class="btn-primary" data-action="save-profile" style="width:100%;margin-top:12px;">💾 Kaydet</button>
      </div>
    </div>`;
}

function renderBrushingVideo() {
  if (!state.brushingVideoUrl) {
    return `${topbar("Diş Fırçalama","Video bulunamadı.", {back:"account"})}
      <div class="content"><p class="footnote">Henüz diş fırçalama videosu eklenmemiş.</p></div>`;
  }
  // YouTube embed
  let embedUrl = state.brushingVideoUrl;
  const ytMatch = state.brushingVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  return `${topbar("🪥 Diş Fırçala!","Videoyu izle, dişlerini fırçala!", {back:"account"})}
    <div class="content">
      <div class="card p4" style="text-align:center;">
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
          <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay;encrypted-media" allowfullscreen></iframe>
        </div>
        <p class="desc" style="margin:16px 0 8px;">🎵 Müzik eşliğinde 2 dakika dişlerini fırçala!</p>
        <button class="btn-primary" data-action="brush-teeth" style="margin-top:8px;">✅ Fırçalamayı Bitirdim!</button>
      </div>
    </div>`;
}

function renderFamilyAdd() {
  const editingId = state._editingFamilyMember;
  const member = editingId ? (state.familyMembers || []).find(m => m.id === editingId) : null;
  return `${topbar(editingId ? "Üyeyi Düzenle" : "Aile Üyesi Ekle", editingId ? "Bilgileri güncelleyin." : "Çocuğunuz veya aile üyenizi ekleyin.", {back:"account"})}
    <div class="content">
      <div class="card p5">
        <div class="field"><label>Ad Soyad</label><input class="input" id="fm-name" placeholder="Ad soyad" value="${escapeAttr(member?.name || "")}" /></div>
        <div class="field"><label>Yakınlık</label>
          <select class="input" id="fm-relation">
            <option value="Çocuğum" ${member?.relation === "Çocuğum" ? "selected" : ""}>Çocuğum</option>
            <option value="Eşim" ${member?.relation === "Eşim" ? "selected" : ""}>Eşim</option>
            <option value="Kardeşim" ${member?.relation === "Kardeşim" ? "selected" : ""}>Kardeşim</option>
            <option value="Annem/Babam" ${member?.relation === "Annem/Babam" ? "selected" : ""}>Annem/Babam</option>
            <option value="Diğer" ${member?.relation === "Diğer" ? "selected" : ""}>Diğer</option>
          </select>
        </div>
        <div class="field"><label>Yaş</label><input class="input" id="fm-age" type="number" placeholder="Yaş" value="${escapeAttr(member?.age || "")}" /></div>
        <div class="field"><label>Fırçalama Hatırlatma Saati</label><input type="time" class="input" id="fm-brush-time" value="${escapeAttr(member?.brushReminderTime || "20:00")}" /></div>
        <button class="btn-primary" data-action="save-family-member" style="width:100%;margin-top:12px;">💾 Kaydet</button>
      </div>
    </div>`;
}

function renderReviews() {
  const r = state.reviewForm;
  // Engellenen kullanıcıların yorumlarını gizle
  const filteredReviews = state.reviews.filter(rv => !rv.uid || !state.blockedUsers.includes(rv.uid));
  const list = filteredReviews.length ? filteredReviews.slice().reverse().map(rv => `
    <div class="card p4 mb3">
      <div class="row" style="justify-content:space-between;">
        <p class="name" style="font-size:14px;">${escapeHtml(rv.name)}</p>
        ${stars(rv.rating)}
      </div>
      <p class="desc" style="margin-top:6px;">${escapeHtml(rv.text)}</p>
      ${rv.adminReply ? `<div style="margin-top:10px;padding:10px 12px;background:var(--bg);border-radius:10px;border-left:3px solid var(--tealLight);">
        <p class="footnote" style="margin:0 0 3px;color:var(--tealLight);font-weight:600;">Dinç Diş Kliniği yanıtı</p>
        <p class="desc" style="margin:0;">${escapeHtml(rv.adminReply)}</p>
      </div>` : ""}
    </div>`).join("") : `<p class="footnote">Henüz yorum yok — ilk yorumu sen yapabilirsin!</p>`;

  const ratingBtns = [1,2,3,4,5].map(n => `<button class="star-btn ${r.rating===n?'star-active':''}" data-action="pick-rating" data-n="${n}">★</button>`).join("");

  return `${topbar("Yorumlar","Müşterilerimizin deneyimleri.", {back:"home"})}
    <div class="content">
      ${authGate("Yorum yapmak için Google ile giriş yapman gerekiyor.")}
      ${state.user ? `<div class="card p5 mb5">
        <p class="name" style="font-size:16px;margin-bottom:10px;">Yorum bırak</p>
        <div class="field"><label>Adın</label><input class="input" id="rv-name" placeholder="Adın" value="${escapeAttr(r.name)}" /></div>
        <div class="field"><label>Puan</label><div class="star-row">${ratingBtns}</div></div>
        <div class="field"><label>Yorumun</label><textarea id="rv-text" placeholder="Deneyimini paylaş">${escapeHtml(r.text)}</textarea></div>
        <button class="btn-primary" data-action="submit-review" ${!(r.name && r.text) ? "disabled":""}>Yorumu Paylaş</button>
      </div>` : ""}
      ${list}
    </div>`;
}

/* ---------------- RANDEVU (sadece muayene) ---------------- */

function renderBooking() {
  const f = state.bookingForm;
  const slots = TIME_SLOTS.map(t => `<div class="slot ${f.time===t?'active':''}" data-action="pick-time" data-time="${t}">${t}</div>`).join("");
  const canSubmit = f.date && f.time && f.name && f.phone;
  let statusHtml = "";
  if (state.bookingStatus==="done") statusHtml = `<p class="status-ok">✓ Randevun kaydedildi, en kısa sürede aranacaksın. Yöneticimize bilgi iletildi.</p>`;
  if (state.bookingStatus==="error") statusHtml = `<p class="status-err">Kaydedilemedi, lütfen tekrar dene.</p>`;

  const list = state.myAppointments.slice().reverse().map(a => `
    <div class="card p4 mb3 row" style="justify-content:space-between;">
      <div><p class="name" style="font-size:14px;">Muayene</p><p class="desc">${escapeHtml(a.name)} · ${escapeHtml(a.phone)}</p></div>
      <span style="font-size:12px;color:var(--tealLight);font-family:'IBM Plex Mono',monospace;">${a.date} ${a.time}</span>
    </div>`).join("");

  return `${topbar("Randevu Al","Sadece muayene randevusu alınır — hangi tedaviye uygun olduğuna hekimimiz muayenede karar verir.")}
    <div class="content">
      ${authGate("Randevu almak için Google ile giriş yapman gerekiyor.")}
      ${state.user ? `<div class="card p5 mb5">
        <div class="field"><label>Hizmet</label><input class="input" value="Muayene" disabled style="background:#EEF6F4;color:var(--muted);" /></div>
        <div class="field"><label>Tarih</label><input class="input" type="date" id="f-date" value="${f.date}" /></div>
        <div class="field"><label>Saat</label><div class="slot-grid">${slots}</div></div>
        <div class="field"><label>Ad Soyad</label><input class="input" id="f-name" placeholder="Adınız Soyadınız" value="${escapeAttr(f.name)}" /></div>
        <div class="field"><label>Telefon</label><input class="input" id="f-phone" placeholder="05xx xxx xx xx" value="${escapeAttr(f.phone)}" /></div>
        <button class="btn-primary" data-action="submit-booking" ${!canSubmit || state.bookingStatus==='saving' ? 'disabled':''}>
          ${state.bookingStatus==='saving' ? 'Kaydediliyor…' : icon('calendar',16)+' Randevuyu Onayla'}
        </button>
        ${statusHtml}
      </div>` : ""}
      ${state.myAppointments.length ? `<p class="section-label">Bu oturumda oluşturduğun randevular</p>${list}` : ""}
    </div>`;
}

/* ---------------- MAĞAZA ---------------- */

function cartCount() { return Object.values(state.cart).reduce((a,b)=>a+b,0); }
function cartTotal() {
  let total = 0;
  const all = allProducts();
  for (const cat of all) for (const p of cat.items) if (state.cart[p.id]) total += p.price * state.cart[p.id];
  return total;
}

function renderStore() {
  if (state.checkoutStatus === "form") return renderCheckout();
  const cats = allProducts().map(cat => `
    <p class="section-label">${cat.name}</p>
    <div class="mb4">
      ${cat.items.map(p => {
        const img = state.productImages[p.id];
        const thumb = img
          ? `<img src="${img}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0;" />`
          : `<div class="badge badge-blue" style="width:52px;height:52px;">${icon("box",22)}</div>`;
        return `
        <div class="card p4 mb3 row" style="justify-content:space-between;">
          ${thumb}
          <div style="flex:1;"><p class="name" style="font-size:14px;">${p.name}</p><p class="desc">${p.price} ₺</p></div>
          <div class="qty-row">
            <button class="qty-btn" data-action="cart-dec" data-id="${p.id}">−</button>
            <span class="qty-val">${state.cart[p.id]||0}</span>
            <button class="qty-btn" data-action="cart-inc" data-id="${p.id}">+</button>
          </div>
        </div>`;
      }).join("")}
    </div>`).join("");

  const count = cartCount();
  return `${topbar("Mağaza","Klinikten temin edebileceğiniz ağız bakım ürünleri.", {back:"home"})}
    <div class="content" style="padding-bottom:90px;">
      ${cats}
      <p class="footnote">Ürünler örnektir — yönetici panelinden yeni ürün ekleyebilir ve görsellerini güncelleyebilirsiniz.</p>
    </div>
    ${count>0 ? `<div class="cart-bar"><span>${count} ürün · ${cartTotal()} ₺</span><button class="btn-primary" style="width:auto;padding:10px 18px;" data-action="goto-checkout">Sepeti Onayla</button></div>` : ""}`;
}

function renderCheckout() {
  const c = state.checkoutForm;
  const canSubmit = c.name && c.phone && c.address;
  const lines = [];
  const all = allProducts();
  for (const cat of all) for (const p of cat.items) if (state.cart[p.id]) lines.push(`${p.name} × ${state.cart[p.id]} = ${p.price*state.cart[p.id]} ₺`);
  return `${topbar("Siparişi Tamamla","Ödeme banka hesabı üzerinden yapılır, kargo bilgisi telefonunuza iletilir.")}
    <div class="content">
      <div class="card p4 mb4">
        <p class="name" style="font-size:14px;margin-bottom:8px;">Sipariş özeti</p>
        ${lines.map(l=>`<p class="desc">${l}</p>`).join("")}
        <p class="name" style="margin-top:8px;">Toplam: ${cartTotal()} ₺</p>
      </div>
      ${authGate("Sipariş verebilmek için Google ile giriş yapman gerekiyor.")}
      ${state.user ? `<div class="card p5 mb4">
        <div class="field"><label>Ad Soyad</label><input class="input" id="ck-name" value="${escapeAttr(c.name)}" /></div>
        <div class="field"><label>Telefon</label><input class="input" id="ck-phone" placeholder="05xx xxx xx xx" value="${escapeAttr(c.phone)}" /></div>
        <div class="field"><label>Teslimat Adresi</label><textarea id="ck-address" placeholder="Açık adres">${escapeHtml(c.address)}</textarea></div>
        <button class="btn-primary" data-action="submit-order" ${!canSubmit?"disabled":""}>Siparişi Onayla</button>
      </div>` : ""}
      <div class="card p4">
        <p class="footnote" style="margin:0;">💳 Ödeme: klinik IBAN'ına havale/EFT ile yapılır (yönetici panelinden IBAN eklenebilir). Ödeme dekontu WhatsApp/telefon ile iletilmelidir. Kargo takip numarası SMS ile paylaşılır.</p>
      </div>
      <button class="linklike" style="margin-top:12px;" data-action="back-to-store">← Mağazaya dön</button>
    </div>`;
}

/* ---------------- ADRES ---------------- */

function renderAddress() {
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Nur+Di%C5%9F+%26+Dental+Klinik+K%C4%B1z%C4%B1ltepe+Adana";
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(mapsUrl);
  return `${topbar("Adresimiz","Bizi haritada bulun veya QR kodu okutun.", {back:"home"})}
    <div class="content">
      <div class="card p4 mb4 row"><div>${icon("pin",18)}</div><p style="margin:0;font-size:14px;">Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21 Mahallesi</p></div>
      <div class="card p5 mb4" style="text-align:center;">
        <img src="${qrUrl}" alt="Konum QR kodu" style="width:200px;height:200px;margin:0 auto;display:block;border-radius:12px;" />
        <p class="footnote">QR kodu okutunca doğrudan harita konumumuz açılır.</p>
      </div>
      <a href="${mapsUrl}" target="_blank" class="btn-primary" style="text-decoration:none;display:flex;">🗺️ Haritada Aç</a>
    </div>`;
}

/* ---------------- İLETİŞİM ---------------- */

function renderContact() {
  const c = state.contactForm;
  const canSubmit = c.name && c.msg;
  let statusHtml = "";
  if (state.contactStatus==="done") statusHtml = `<p class="status-ok">✓ Mesajın iletildi, teşekkürler.</p>`;
  if (state.contactStatus==="error") statusHtml = `<p class="status-err">Gönderilemedi, lütfen tekrar dene.</p>`;
  return `${topbar("İletişim","Bize ulaş, ya da mesaj bırak.", {back:"home"})}
    <div class="content">
      <div class="mb5">
        <div class="card p4 mb3 row"><div>${icon("pin",18)}</div><p style="margin:0;font-size:14px;">Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21</p></div>
        <div class="card p4 mb3 row"><div>${icon("mail",18)}</div><p style="margin:0;font-size:14px;">0536 597 35 95</p></div>
        <div class="card p4 mb3 row"><div>${icon("calendar",18)}</div><p style="margin:0;font-size:14px;">Hafta içi 09:00–18:00, Cumartesi 10:00–14:00</p></div>
        <div class="card p4 row"><div>${icon("user",18)}</div><p style="margin:0;font-size:14px;">Erdinç KÖLÜK</p></div>
      </div>
      
      ${Object.keys(state.socialMedia).length > 0 ? `
      <div class="card p4 mb5">
        <p class="name" style="font-size:16px;margin-bottom:12px;">📱 Bizi Takip Edin</p>
        ${state.socialMedia.youtube ? `<a href="${state.socialMedia.youtube}" target="_blank" class="card p3 mb2 row" style="text-decoration:none;color:var(--ink);"><div>📺</div><p style="margin:0;font-size:14px;">YouTube</p></a>` : ''}
        ${state.socialMedia.instagram ? `<a href="${state.socialMedia.instagram}" target="_blank" class="card p3 mb2 row" style="text-decoration:none;color:var(--ink);"><div>📷</div><p style="margin:0;font-size:14px;">Instagram</p></a>` : ''}
        ${state.socialMedia.twitter ? `<a href="${state.socialMedia.twitter}" target="_blank" class="card p3 mb2 row" style="text-decoration:none;color:var(--ink);"><div>🐦</div><p style="margin:0;font-size:14px;">Twitter / X</p></a>` : ''}
        ${state.socialMedia.facebook ? `<a href="${state.socialMedia.facebook}" target="_blank" class="card p3 mb2 row" style="text-decoration:none;color:var(--ink);"><div>📘</div><p style="margin:0;font-size:14px;">Facebook</p></a>` : ''}
        ${state.socialMedia.whatsapp ? `<a href="${state.socialMedia.whatsapp.startsWith('http') ? escapeAttr(state.socialMedia.whatsapp) : 'https://wa.me/' + state.socialMedia.whatsapp.replace(/\D/g, '')}" target="_blank" class="card p3 mb2 row" style="text-decoration:none;color:var(--ink);"><div>📱</div><p style="margin:0;font-size:14px;">WhatsApp</p></a>` : ''}
      </div>` : ''}
      <div class="card p5">
        <p class="name" style="font-size:17px;margin-bottom:12px;">Mesaj bırak</p>
        <div class="field"><label>Ad Soyad</label><input class="input" id="c-name" value="${escapeAttr(c.name)}" /></div>
        <div class="field"><label>Telefon (opsiyonel)</label><input class="input" id="c-phone" value="${escapeAttr(c.phone)}" /></div>
        <div class="field"><label>Mesajınız</label><textarea id="c-msg" placeholder="Sorunuzu yazın">${escapeHtml(c.msg)}</textarea></div>
        <button class="btn-primary" data-action="submit-contact" ${!canSubmit || state.contactStatus==='saving' ? 'disabled':''}>
          ${state.contactStatus==='saving' ? 'Gönderiliyor…' : icon('mail',16)+' Mesajı Gönder'}
        </button>
        ${statusHtml}
      </div>
    </div>`;
}

/* ---------------- BİLGİ ---------------- */

function renderInfo() {
  const tabs = [
    { id:"Bebekler", label:"Bebekler" },
    { id:"Çocuklar", label:"Çocuklar" },
    { id:"Yetişkinler", label:"Yetişkinler" },
    { id:"Yanlışlar", label:"Doğru Bilinen Yanlışlar" },
    { id:"Bitkiler", label:"Şifalı Bitkiler" },
  ];
  const active = state.infoTab || "Bebekler";

  const tabBtns = tabs.map(t => `
    <button class="chip ${active===t.id?'chip-active':''}" data-action="set-info-tab" data-id="${t.id}">${t.label}</button>`).join("");

  let body = "";
  if (active === "Yanlışlar") {
    body = MYTHS.map(m => `
      <div class="card p4 mb3">
        <div class="row-start mb3"><div class="myth-x">✕</div><p class="desc" style="margin:0;">${m.wrong}</p></div>
        <div class="row-start"><div class="myth-check">✓</div><p class="name" style="font-size:14px;">${m.right}</p></div>
      </div>`).join("");
  } else if (active === "Bitkiler") {
    body = `
      <div class="card p4 mb4" style="background:#FFF8E8;border-color:#F0DFAF;">
        <p class="desc" style="margin:0;color:#8A6D1D;">⚠️ Bu bölüm yalnızca genel bilgi amaçlıdır, tıbbi tavsiye ya da tedavi önerisi değildir. Sorumluluk kullanıcıya aittir. Şikayetin devam etmesi veya şiddetlenmesi durumunda mutlaka diş hekimine başvurunuz.</p>
      </div>
      ${HERBS.map(h => `
        <div class="card p4 mb3">
          <p class="name" style="font-size:14px;">${h.name}</p>
          <p class="desc" style="margin-top:6px;"><b>Ne için iyi gelir:</b> ${h.helps}</p>
          <p class="desc"><b>Nasıl kullanılır:</b> ${h.how}</p>
          <p class="desc"><b>Miktar:</b> ${h.amount}</p>
          <p class="desc" style="color:var(--bad);"><b>Dikkat:</b> ${h.caution}</p>
        </div>`).join("")}`;
  } else {
    body = ARTICLES.filter(a=>a.group===active).map(a => `
      <div class="card p4 mb3">
        <p class="name" style="font-size:14px;">${a.title}</p>
        <p class="desc" style="margin-top:6px;">${a.body}</p>
      </div>`).join("");
    if (active === "Bebekler") {
      body = `<div class="card p4 mb4" style="padding:0;overflow:hidden;"><img src="info-toothache.jpg" style="width:100%;display:block;" alt="Diş ağrısı bilgi kartı" /></div>` + body;
    }
  }

  return `${topbar("Diş Sağlığı Bilgileri","Bebeklerden yetişkinlere, doğru bilinen yanlışlar ve şifalı bitkiler dahil.", {back:"home"})}
    <div class="content">
      <div class="chip-row mb4" style="flex-wrap:wrap;">${tabBtns}</div>
      ${body}
    </div>`;
}

/* ---------------- CHATBOT ---------------- */

function findChatReply(text) {
  const lower = text.toLocaleLowerCase("tr");
  for (const item of CHATBOT_KB) {
    for (const k of item.keys) if (lower.includes(k)) return item;
  }
  return { reply: CHATBOT_FALLBACK };
}

function renderChatbot() {
  if (!state.user) {
    return `${topbar("DİJİ DENT","Diş sağlığı asistanınız.")}
      <div class="content">
        <div class="card p5" style="text-align:center;">
          <div style="font-size:64px;margin-bottom:16px;">🤖</div>
          <p class="name" style="font-size:18px;margin-bottom:8px;">DİJİ DENT ile Sohbet</p>
          <p class="desc" style="margin-bottom:24px;">Diş sağlığı hakkında soru sormak ve fotoğraf göndermek için önce giriş yapmanız gerekiyor.</p>
          <button class="btn-primary" data-action="sign-in-google" style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;font-size:16px;">
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Google ile Giriş Yap
          </button>
        </div>
      </div>`;
  }
  const msgs = state.chatLog.map(m => `
    <div class="chat-msg ${m.from==='user' ? 'chat-user':'chat-bot'}">${m.image ? `<img src="${m.image}" style="width:100%;border-radius:10px;margin-bottom:6px;display:block;" />` : ""}${escapeHtml(m.text)}${m.bookingBtn ? `<br><button class="btn-primary" style="margin-top:10px;padding:10px 16px;font-size:13px;" data-action="goto" data-screen="booking">📅 Randevu Al</button>` : ""}</div>`).join("");
  return `${topbar("DİJİ DENT","Diş sağlığı hakkında soru sor, dişinin fotoğrafını da gönderebilirsin.")}
    <div class="content" style="padding-bottom:100px;">
      ${!AI_ENDPOINT_READY ? `<p class="footnote" style="margin-bottom:10px;">ℹ️ Şu an genişletilmiş bilgi tabanıyla cevap veriyorum. Yapay zeka bağlantısı aktif olunca (yönetici tarafından kurulacak) her konuya cevap verebileceğim.</p>` : ""}
      <div class="chat-log" id="chat-log">${msgs}</div>
    </div>
    <div class="chat-input-bar">
      <input type="file" accept="image/*" id="chat-photo-input" style="display:none;" data-action-change="chat-photo" />
      <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="chat-photo-pick">📷</button>
      <input class="input" id="chat-input" placeholder="Bir şey sor..." value="${escapeAttr(state.chatInput)}" />
      <button class="btn-primary" style="width:auto;padding:10px 16px;" data-action="send-chat">Gönder</button>
    </div>`;
}

/* ---------------- YÖNETİCİ ---------------- */

function renderAdminLogin() {
  const f = state.adminForm;
  return `${topbar("Yönetici Girişi","Sadece klinik yönetimi içindir.", {back:"home"})}
    <div class="content">
      <div class="card p5">
        <div class="field"><label>Yönetici e-postası</label><input class="input" id="ad-email" value="${escapeAttr(f.email)}" /></div>
        <div class="field"><label>Şifre</label><input class="input" type="password" id="ad-pass" value="${escapeAttr(f.pass)}" /></div>
        ${state.adminError ? `<p class="status-err">${state.adminError}</p>` : ""}
        <button class="btn-primary" data-action="admin-login" ${state.authBusy?"disabled":""}>${state.authBusy?"Giriş yapılıyor…":"Giriş Yap"}</button>
        <p class="footnote">Bu e-posta/şifre, Firebase konsolunda Authentication &gt; Users kısmında oluşturduğun yönetici hesabıdır.</p>
      </div>
    </div>`;
}

function renderAdminPanel() {
  const tabs = [
    { id: "appointments", label: "📅 Randevular", count: state.appointments.length },
    { id: "orders", label: "📦 Siparişler", count: state.orders.length },
    { id: "products", label: "🛍️ Ürünler", count: 0 },
    { id: "videos", label: "🎥 Videolar", count: 0 },
    { id: "social", label: "📱 Sosyal Medya", count: 0 },
    { id: "reviews", label: "⭐ Yorumlar", count: state.reviews.length },
    { id: "treatments", label: "🦷 Tedaviler", count: state.treatments.length },
    { id: "tips", label: "💡 İpuçları", count: state.healthTips.length },
    { id: "announcements", label: "📢 Duyurular", count: state.announcements.length },
    { id: "images", label: "🖼️ Görseller", count: 0 },
    { id: "accounting", label: "💰 Muhasebe", count: 0 }
  ];

  const tabButtons = tabs.map(t => `
    <button class="admin-tab ${state.adminTab === t.id ? 'active' : ''}" data-action="admin-tab" data-tab="${t.id}">
      ${t.label}${t.count > 0 ? ` <span class="tab-badge">${t.count}</span>` : ''}
    </button>
  `).join("");

  let tabContent = "";

  if (state.adminTab === "appointments") {
    const apps = state.appointments.slice().reverse().map(a=>`<div class="card p3 mb2"><p class="desc" style="margin:0;">${a.date||""} ${a.time||""} · ${escapeHtml(a.name)} · ${escapeHtml(a.phone)}</p></div>`).join("") || `<p class="footnote">Henüz randevu yok.</p>`;
    tabContent = `
      <p class="section-label">Gelen randevular (canlı)</p>
      <div class="mb4">${apps}</div>
    `;
  }

  if (state.adminTab === "orders") {
    const ords = state.orders.slice().reverse().map(o=>`<div class="card p3 mb2"><p class="desc" style="margin:0;">${escapeHtml(o.name)} · ${escapeHtml(o.phone)} · ${o.total} ₺</p><p class="footnote" style="margin:2px 0 0;">${escapeHtml(o.address||"")}</p></div>`).join("") || `<p class="footnote">Henüz sipariş yok.</p>`;
    tabContent = `
      <p class="section-label">Gelen siparişler (canlı)</p>
      <div class="mb4">${ords}</div>
    `;
  }

  if (state.adminTab === "products") {
    const imgRows = allProducts().flatMap(cat => cat.items).map(p => `
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">${p.name}</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="img-${p.id}" placeholder="Görsel URL'si" value="${escapeAttr(state.productImages[p.id]||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-product-image" data-id="${p.id}">Kaydet</button>
        </div>
      </div>`).join("");

    tabContent = `
      <p class="section-label">Yeni ürün ekle</p>
      <div class="card p5 mb4">
        <div class="field"><label>Ürün adı</label><input class="input" id="np-name" /></div>
        <div class="field"><label>Fiyat (₺)</label><input class="input" id="np-price" type="number" /></div>
        <button class="btn-primary" data-action="admin-add-product">Ürünü Ekle</button>
      </div>
      <p class="section-label">Ürün görselleri</p>
      <p class="footnote" style="margin-top:-4px;">Görseli bir yere yükleyip (ör. Google Drive'da "herkese açık" paylaşım linki, Imgur vb.) buraya linkini yapıştır.</p>
      <div class="mb4">${imgRows}</div>
    `;
  }

  if (state.adminTab === "videos") {
    const videoRows = SERVICES.map(s => `
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">${s.name}</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="vid-${s.id}" placeholder="YouTube linki" value="${escapeAttr(state.serviceVideos[s.id]||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-video" data-id="${s.id}">Kaydet</button>
        </div>
      </div>`).join("");

    const deviceVideoRows = DEVICES.map(d => `
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">${d.name}</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="dvid-${d.id}" placeholder="YouTube linki" value="${escapeAttr(state.deviceVideos[d.id]||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-device-video" data-id="${d.id}">Kaydet</button>
        </div>
      </div>`).join("");

    tabContent = `
      <p class="section-label">🪥 Çocuklar İçin Diş Fırçalama Videosu</p>
      <p class="footnote" style="margin-top:-4px;">Çocukların izleyerek diş fırçalayacağı eğlenceli 2 dakikalık YouTube videosu. Boş bırakılırsa profil sayfasında görünmez.</p>
      <div class="card p3 mb4">
        <div style="display:flex;gap:6px;">
          <input class="input" id="brush-video-url" placeholder="YouTube linki (örn: https://youtube.com/watch?v=...)" value="${escapeAttr(state.brushingVideoUrl||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-brush-video">Kaydet</button>
        </div>
      </div>
      <p class="section-label">Hizmet tanıtım videoları</p>
      <p class="footnote" style="margin-top:-4px;">YouTube'a yüklediğin videonun linkini ilgili hizmetin yanına yapıştır.</p>
      <div class="mb4">${videoRows}</div>
      <p class="section-label">Cihaz tanıtım videoları</p>
      <p class="footnote" style="margin-top:-4px;">Cihazın nasıl çalıştığını gösteren YouTube videosunun linkini yapıştır.</p>
      <div class="mb4">${deviceVideoRows}</div>
    `;
  }

  if (state.adminTab === "social") {
    const socialMediaRows = `
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">📺 YouTube</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="sm-youtube" placeholder="YouTube kanal linki" value="${escapeAttr(state.socialMedia.youtube||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-social" data-id="youtube">Kaydet</button>
        </div>
      </div>
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">📷 Instagram</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="sm-instagram" placeholder="Instagram profil linki" value="${escapeAttr(state.socialMedia.instagram||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-social" data-id="instagram">Kaydet</button>
        </div>
      </div>
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">🐦 Twitter / X</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="sm-twitter" placeholder="Twitter/X profil linki" value="${escapeAttr(state.socialMedia.twitter||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-social" data-id="twitter">Kaydet</button>
        </div>
      </div>
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">📘 Facebook</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="sm-facebook" placeholder="Facebook sayfa linki" value="${escapeAttr(state.socialMedia.facebook||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-social" data-id="facebook">Kaydet</button>
        </div>
      </div>
      <div class="card p3 mb2">
        <p class="desc" style="margin:0 0 6px;font-weight:500;color:var(--ink);">📱 WhatsApp</p>
        <div style="display:flex;gap:6px;">
          <input class="input" id="sm-whatsapp" placeholder="WhatsApp linki (https://chat.whatsapp.com/... veya numara)" value="${escapeAttr(state.socialMedia.whatsapp||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-social" data-id="whatsapp">Kaydet</button>
        </div>
      </div>`;

    tabContent = `
      <p class="section-label">Sosyal Medya Linkleri</p>
      <p class="footnote" style="margin-top:-4px;">İletişim sayfasında görünecek sosyal medya hesaplarınızın linklerini girin.</p>
      <div class="mb4">${socialMediaRows}</div>
    `;
  }

  if (state.adminTab === "reviews") {
    const reviewRows = state.reviews.slice().reverse().map(rv => {
      const isBlocked = rv.uid && state.blockedUsers.includes(rv.uid);
      return `
      <div class="card p3 mb2" style="${isBlocked ? 'opacity:0.5;' : ''}">
        <p class="desc" style="margin:0 0 2px;"><b>${escapeHtml(rv.name)}</b> ${stars(rv.rating)} ${isBlocked ? '<span style="color:var(--bad);font-size:11px;">(ENGELLİ)</span>' : ''}</p>
        <p class="desc" style="margin:0 0 6px;">${escapeHtml(rv.text)}</p>
        <div style="display:flex;gap:6px;margin-bottom:6px;">
          <input class="input" id="rvreply-${rv.id}" placeholder="Yanıt yaz (herkes görür)" value="${escapeAttr(rv.adminReply||"")}" style="flex:1;" />
          <button class="qty-btn" style="width:auto;padding:0 12px;" data-action="save-review-reply" data-id="${rv.id}">Kaydet</button>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="qty-btn" style="width:auto;padding:0 12px;background:var(--bad);color:#fff;" data-action="delete-review" data-id="${rv.id}">🗑️ Sil</button>
          ${rv.uid ? `<button class="qty-btn" style="width:auto;padding:0 12px;background:${isBlocked ? 'var(--teal)' : 'var(--bad)'};color:#fff;" data-action="${isBlocked ? 'unblock-user' : 'block-user'}" data-uid="${rv.uid}">${isBlocked ? '✓ Engeli Kaldır' : '🚫 Kullanıcıyı Engelle'}</button>` : ''}
        </div>
      </div>`;
    }).join("") || `<p class="footnote">Henüz yorum yok.</p>`;

    tabContent = `
      <p class="section-label">Yorumlara yanıt ver</p>
      <p class="footnote" style="margin-top:-4px;">Yazdığın yanıt, o yorumun altında tüm kullanıcılara görünür.</p>
      <div class="mb4">${reviewRows}</div>
    `;
  }

  if (state.adminTab === "treatments") {
    // Tedavi fiyat listesi
    const priceList = state.treatmentPrices || {};
    const defaultPrices = {
      "Muayene": 0, "Dolgu": 2000, "Kanal Tedavisi": 4000, "İmplant": 15000,
      "Zirkonyum Kaplama": 5000, "Diş Beyazlatma": 3000, "Ortodonti": 25000,
      "Protez": 12000, "Diş Taşı Temizliği": 1000, "Diş Çekimi": 1500,
      "Köprü": 8000, "Lamine Veneer": 6000, "Şeffaf Plak": 20000, "Cerrahi Çekim": 3000
    };
    const allPrices = { ...defaultPrices, ...priceList };

    // Mevcut tedavi kayıtları
    const treatmentRows = (state.treatments || []).slice().reverse().map(t => `
      <div class="card p3 mb2">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <p style="font-size:13px;font-weight:600;margin:0;">🦷 ${escapeHtml(t.treatmentName)} — ${escapeHtml(t.userName || "Bilinmeyen")}</p>
            <p style="font-size:11px;color:var(--muted);margin:2px 0 0;">📅 ${escapeHtml(t.date || "")} ${t.notes ? "· " + escapeHtml(t.notes) : ""}</p>
            ${t.amount ? `<p style="font-size:12px;font-weight:700;color:#2E7D32;margin:4px 0 0;">💰 ₺${parseFloat(t.amount).toLocaleString('tr-TR')} ${t.invoiceNo ? "· F: " + escapeHtml(t.invoiceNo) : ""}</p>` : ""}
          </div>
          <button data-action="delete-treatment" data-id="${t.id}" style="background:#FFEBEE;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:11px;color:#C62828;">🗑️</button>
        </div>
      </div>
    `).join("") || '<p class="footnote">Henüz tedavi kaydı yok.</p>';

    // Otomatik giderler durumu
    const now = new Date();
    const autoExpenses = state.autoExpenses || { kira:50000, elektrik:3000, su:1500, dogalgaz:2000, sgk:8000, vergi:5000 };

    tabContent = `
      <!-- Tedavi Fiyat Listesi -->
      <div class="card p4 mb3">
        <p style="font-size:14px;font-weight:700;margin:0 0 10px;">💲 Tedavi Fiyat Listesi</p>
        <p style="font-size:11px;color:var(--muted);margin:0 0 10px;">Her tedavi için fiyat belirleyin. Tedavi kaydedildiğinde otomatik faturalanır.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          ${Object.entries(allPrices).map(([name, price]) => `
            <div style="display:flex;align-items:center;gap:4px;padding:4px 0;border-bottom:1px solid var(--line);">
              <span style="font-size:11px;flex:1;">${name}</span>
              <input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${price}" data-price-name="${name}" data-action-blur="update-price" />
              <span style="font-size:10px;color:var(--muted);">₺</span>
            </div>
          `).join("")}
        </div>
        <div style="display:flex;gap:6px;margin-top:10px;">
          <input class="input" id="new-price-name" placeholder="Yeni tedavi adı" style="flex:1;font-size:11px;" />
          <input class="input" id="new-price-amount" type="number" placeholder="Fiyat" style="width:80px;font-size:11px;" />
          <button class="btn-primary" style="width:auto;padding:6px 12px;font-size:11px;" data-action="add-price">+ Ekle</button>
        </div>
      </div>

      <!-- Tedavi Kaydet (Hasta + Otomatik Fatura) -->
      <div class="card p4 mb3" style="background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border:1px solid #A5D6A7;">
        <p style="font-size:14px;font-weight:700;margin:0 0 10px;color:#1B5E20;">🦷 Hasta Tedavi Kaydet</p>
        <p style="font-size:11px;color:#2E7D32;margin:0 0 10px;">Tedavi seçildiğinde otomatik fiyatlandırma + fatura + muhasebe kaydı yapılır.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input class="input" id="tr-user" placeholder="Hasta adı" />
          <select class="input" id="tr-name">
            ${Object.entries(allPrices).map(([name, price]) => `<option value="${name}" data-price="${price}">${name} — ₺${price.toLocaleString('tr-TR')}</option>`).join("")}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;">
          <input class="input" id="tr-date" type="date" value="${now.toISOString().split('T')[0]}" style="font-size:11px;" />
          <select class="input" id="tr-payment" style="font-size:11px;">
            <option>Nakit</option><option>Kredi Kartı</option><option>POS</option><option>Havale/EFT</option>
          </select>
          <select class="input" id="tr-patient-type" style="font-size:11px;">
            <option value="kisi">Şahıs</option><option value="mukellef">Vergi Mükellefi</option>
          </select>
        </div>
        <input class="input" id="tr-notes" placeholder="Not (isteğe bağlı)" style="margin-top:8px;font-size:11px;" />
        <button class="btn-primary" style="margin-top:10px;background:linear-gradient(135deg,#2E7D32,#43A047);" data-action="add-treatment">🦷 Tedavi Kaydet & Fatura Kes</button>
      </div>

      <!-- Mevcut Tedaviler -->
      <div class="card p4 mb3">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <p style="font-size:13px;font-weight:700;margin:0;">📋 Tedavi Kayıtları</p>
          <button class="btn-primary" style="width:auto;padding:4px 10px;font-size:10px;" data-action="print-treatments">🖨️ Çıktı Al</button>
        </div>
        ${treatmentRows}
      </div>
    `;
  }
  if (state.adminTab === "tips") {
    const tipRows = (state.healthTips || []).map(t => `
      <div class="card p3 mb2">
        <p class="desc" style="margin:0;">💡 ${escapeHtml(t.text || "")}</p>
        <button class="qty-btn" style="margin-top:8px;width:auto;padding:4px 12px;background:var(--bad);color:#fff;" data-action="delete-tip" data-id="${t.id}">🗑️ Sil</button>
      </div>
    `).join("") || `<p class="footnote">Henüz ipucu eklenmedi. Varsayılan ipuçları kullanılıyor.</p>`;

    tabContent = `
      <p class="section-label">Yeni İpucu Ekle</p>
      <p class="footnote" style="margin-top:-4px;">Kullanıcıların profilinde günlük olarak gösterilecek diş sağlığı ipuçları.</p>
      <div class="card p5 mb4">
        <div class="field"><label>İpucu Metni</label><textarea id="tip-text" placeholder="Örn: Günde 2 kez 2 dakika diş fırçalamak idealdir." style="min-height:60px;"></textarea></div>
        <button class="btn-primary" data-action="add-tip">💾 İpucu Ekle</button>
      </div>
      <p class="section-label">Mevcut İpuçları (${(state.healthTips || []).length})</p>
      <div class="mb4">${tipRows}</div>
    `;
  }

  if (state.adminTab === "announcements") {
    const annRows = (state.announcements || []).slice().reverse().map(a => `
      <div class="card p3 mb2">
        <p class="name" style="font-size:14px;margin:0;">📢 ${escapeHtml(a.title || "")}</p>
        <p class="desc" style="margin:4px 0;">${escapeHtml((a.text || "").substring(0,100))}${(a.text||"").length > 100 ? '...' : ''}</p>
        ${a.imageUrl ? `<img src="${a.imageUrl}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-top:4px;" />` : ''}
        ${a.videoUrl ? `<p class="footnote" style="margin:4px 0;">🎥 Video: ${escapeHtml(a.videoUrl.substring(0,40))}...</p>` : ''}
        <p class="footnote" style="margin:4px 0;">${a.createdAt ? new Date(a.createdAt).toLocaleString("tr-TR") : ''}</p>
        <button class="qty-btn" style="margin-top:6px;width:auto;padding:4px 12px;background:var(--bad);color:#fff;" data-action="delete-announcement" data-id="${a.id}">🗑️ Sil</button>
      </div>
    `).join("") || `<p class="footnote">Henüz duyuru yok.</p>`;

    tabContent = `
      <p class="section-label">Yeni Duyuru Oluştur</p>
      <p class="footnote" style="margin-top:-4px;">Duyuru yayınlandığında tüm kullanıcılara bildirim gönderilir.</p>
      <div class="card p5 mb4">
        <div class="field"><label>Duyuru Başlığı</label><input class="input" id="ann-title" placeholder="Örn: Klinik bayramda kapalı" /></div>
        <div class="field"><label>Duyuru Metni</label><textarea id="ann-text" placeholder="Detaylı açıklama..." style="min-height:80px;"></textarea></div>
        <div class="field"><label>Görsel (isteğe bağlı)</label><input type="file" id="ann-image" accept="image/*" style="font-size:12px;" /></div>
        <div class="field"><label>Video Linki (isteğe bağlı - YouTube)</label><input class="input" id="ann-video" placeholder="https://youtube.com/watch?v=..." /></div>
        <button class="btn-primary" data-action="add-announcement">📢 Duyuru Yayınla</button>
      </div>
      <p class="section-label">Mevcut Duyurular (${(state.announcements || []).length})</p>
      <div class="mb4">${annRows}</div>
    `;
  }

  if (state.adminTab === "images") {
    tabContent = `
      <p class="section-label">👨‍⚕️ Doktor Fotoğrafı</p>
      <p class="footnote" style="margin-top:-4px;">Doktor fotoğrafını değiştirmek için yeni fotoğrafın URL'sini girin (Imgur, Google Drive vb. herkese açık link).</p>
      <div class="card p4 mb4">
        <div style="text-align:center;margin-bottom:12px;">
          <img src="${state.doctorPhotoUrl || 'doctor-photo.jpg'}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--teal);" alt="Doktor" />
          <p style="font-size:12px;color:var(--muted);margin:6px 0 0;">Mevcut fotoğraf</p>
        </div>
        <div class="field">
          <label>Fotoğraf URL'si</label>
          <input class="input" id="doctor-photo-url" placeholder="https://i.imgur.com/... veya başka link" value="${escapeAttr(state.doctorPhotoUrl||'')}" />
        </div>
        <button class="btn-primary" data-action="save-doctor-photo">Doktor Fotoğrafını Güncelle</button>
      </div>

      <p class="section-label">🏥 Klinik Logosu</p>
      <p class="footnote" style="margin-top:-4px;">Klinik logosunu değiştirmek için yeni logonun URL'sini girin.</p>
      <div class="card p4 mb4">
        <div style="text-align:center;margin-bottom:12px;">
          <img src="${state.clinicLogoUrl || 'icon-192.png'}" style="width:80px;height:80px;border-radius:16px;object-fit:contain;background:#fff;padding:6px;border:2px solid var(--line);" alt="Logo" />
          <p style="font-size:12px;color:var(--muted);margin:6px 0 0;">Mevcut logo</p>
        </div>
        <div class="field">
          <label>Logo URL'si</label>
          <input class="input" id="clinic-logo-url" placeholder="https://i.imgur.com/... veya başka link" value="${escapeAttr(state.clinicLogoUrl||'')}" />
        </div>
        <button class="btn-primary" data-action="save-clinic-logo">Klinik Logosunu Güncelle</button>
      </div>

      <p class="section-label">🖼️ Splash Ekranı Görseli</p>
      <p class="footnote" style="margin-top:-4px;">Uygulama açılışında görünen büyük arka plan görseli.</p>
      <div class="card p4 mb4">
        <div style="text-align:center;margin-bottom:12px;">
          <img src="${state.splashImageUrl || 'splash-6-clinic.jpg'}" style="width:100%;max-height:120px;border-radius:12px;object-fit:cover;" alt="Splash" />
        </div>
        <div class="field">
          <label>Splash Görseli URL'si</label>
          <input class="input" id="splash-image-url" placeholder="https://..." value="${escapeAttr(state.splashImageUrl||'')}" />
        </div>
        <button class="btn-primary" data-action="save-splash-image">Splash Görselini Güncelle</button>
      </div>
    `;
  }

  if (state.adminTab === "accounting") {
    const acc = state.accounting || { incomes:[], expenses:[], firms:[], bankAccounts:[], invoices:[] };
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const monthIncomes = (acc.incomes||[]).filter(i => { const d = new Date(i.date); return d.getMonth()===thisMonth && d.getFullYear()===thisYear; });
    const monthExpenses = (acc.expenses||[]).filter(e => { const d = new Date(e.date); return d.getMonth()===thisMonth && d.getFullYear()===thisYear; });
    const yearIncomes = (acc.incomes||[]).filter(i => { const d = new Date(i.date); return d.getFullYear()===thisYear; });
    const yearExpenses = (acc.expenses||[]).filter(e => { const d = new Date(e.date); return d.getFullYear()===thisYear; });
    const totalIncome = monthIncomes.reduce((s,i) => s + (parseFloat(i.amount)||0), 0);
    const totalExpense = monthExpenses.reduce((s,e) => s + (parseFloat(e.amount)||0), 0);
    const totalKDV = monthIncomes.reduce((s,i) => s + (parseFloat(i.kdv)||0), 0);
    const totalStopaj = monthIncomes.reduce((s,i) => s + (parseFloat(i.stopaj)||0), 0);
    const profit = totalIncome - totalExpense;
    const yearIncome = yearIncomes.reduce((s,i) => s + (parseFloat(i.amount)||0), 0);
    const yearExpense = yearExpenses.reduce((s,e) => s + (parseFloat(e.amount)||0), 0);
    const yearProfit = yearIncome - yearExpense;

    // Yıllık gelir vergisi hesaplama (2026 dilimleri)
    let vergi = 0;
    if (yearProfit > 0) {
      if (yearProfit <= 190000) vergi = yearProfit * 0.15;
      else if (yearProfit <= 400000) vergi = 28500 + (yearProfit - 190000) * 0.20;
      else if (yearProfit <= 1000000) vergi = 70500 + (yearProfit - 400000) * 0.27;
      else if (yearProfit <= 5300000) vergi = 232500 + (yearProfit - 1000000) * 0.35;
      else vergi = 1737500 + (yearProfit - 5300000) * 0.40;
    }

    // Otomatik fatura no oluştur
    const monthStr = String(now.getMonth()+1).padStart(2,'0');
    const yearStr = String(now.getFullYear());
    const thisMonthInvoices = (acc.invoices||[]).filter(inv => inv.no && inv.no.startsWith(yearStr + '-' + monthStr));
    const nextInvoiceNo = yearStr + '-' + monthStr + '-' + String((thisMonthInvoices.length || 0) + 1).padStart(5, '0');

    // Son işlemler
    const recentTx = [...(acc.incomes||[]).map(i=>({...i,txType:'income'})), ...(acc.expenses||[]).map(e=>({...e,txType:'expense'}))]
      .sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,15);

    // POS modal (göster/gizle)
    const showPOS = state._showPOS || false;

    tabContent = `
      <!-- Dashboard -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div class="card p3" style="text-align:center;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border:1px solid #A5D6A7;">
          <p style="font-size:10px;color:#2E7D32;margin:0;font-weight:600;">GELİR (Bu Ay)</p>
          <p style="font-size:16px;font-weight:800;color:#1B5E20;margin:2px 0;">₺${totalIncome.toLocaleString('tr-TR',{minimumFractionDigits:2})}</p>
        </div>
        <div class="card p3" style="text-align:center;background:linear-gradient(135deg,#FFEBEE,#FFCDD2);border:1px solid #EF9A9A;">
          <p style="font-size:10px;color:#C62828;margin:0;font-weight:600;">GİDER (Bu Ay)</p>
          <p style="font-size:16px;font-weight:800;color:#B71C1C;margin:2px 0;">₺${totalExpense.toLocaleString('tr-TR',{minimumFractionDigits:2})}</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">
        <div class="card p2" style="text-align:center;">
          <p style="font-size:9px;color:#666;margin:0;">KDV (%10)</p>
          <p style="font-size:13px;font-weight:700;color:#E65100;margin:2px 0;">₺${totalKDV.toLocaleString('tr-TR',{minimumFractionDigits:2})}</p>
        </div>
        <div class="card p2" style="text-align:center;">
          <p style="font-size:9px;color:#666;margin:0;">Stopaj (%20)</p>
          <p style="font-size:13px;font-weight:700;color:#1565C0;margin:2px 0;">₺${totalStopaj.toLocaleString('tr-TR',{minimumFractionDigits:2})}</p>
        </div>
        <div class="card p2" style="text-align:center;background:${profit>=0?'#E3F2FD':'#FFF3E0'};">
          <p style="font-size:9px;color:#666;margin:0;">${profit>=0?'NET KÂR':'ZARAR'}</p>
          <p style="font-size:13px;font-weight:700;color:${profit>=0?'#0D47A1':'#BF360C'};margin:2px 0;">₺${Math.abs(profit).toLocaleString('tr-TR',{minimumFractionDigits:2})}</p>
        </div>
      </div>

      <!-- Yıllık Vergi Özeti -->
      <div class="card p3 mb3" style="background:linear-gradient(135deg,#FFF8E1,#FFECB3);border:1px solid #FFD54F;">
        <p style="font-size:11px;font-weight:700;color:#E65100;margin:0 0 4px;">📊 YILLIK VERGİ TAHMİNİ (${yearStr})</p>
        <div style="display:flex;justify-content:space-between;font-size:12px;">
          <span>Yıllık Gelir: <b>₺${yearIncome.toLocaleString('tr-TR')}</b></span>
          <span>Gider: <b>₺${yearExpense.toLocaleString('tr-TR')}</b></span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px;">
          <span>Net Kâr: <b style="color:${yearProfit>=0?'#2E7D32':'#C62828'};">₺${yearProfit.toLocaleString('tr-TR')}</b></span>
          <span>Tahmini GV: <b style="color:#E65100;">₺${vergi.toLocaleString('tr-TR',{maximumFractionDigits:0})}</b></span>
        </div>
      </div>

      <!-- POS / Ödeme Al -->
      <div class="card p4 mb3" style="background:linear-gradient(135deg,#1A237E,#283593);color:white;border:none;">
        <p style="font-size:14px;font-weight:700;margin:0 0 8px;">💳 POS - Ödeme Al</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input class="input" id="pos-desc" placeholder="Açıklama / Hasta" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);" />
          <input class="input" id="pos-amount" type="number" placeholder="Tutar (₺)" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;">
          <select class="input" id="pos-category" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);font-size:11px;">
            <option>Muayene</option><option>Dolgu</option><option>Kanal Tedavisi</option><option>İmplant</option><option>Zirkonyum</option><option>Beyazlatma</option><option>Ortodonti</option><option>Protez</option><option>Diş Taşı Temizliği</option><option>Diğer</option>
          </select>
          <select class="input" id="pos-payment" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);font-size:11px;">
            <option>Kredi Kartı</option><option>Temassız</option><option>Karekod</option><option>Nakit</option><option>Havale/EFT</option>
          </select>
          <select class="input" id="pos-patient-type" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);font-size:11px;">
            <option value="kisi">Şahıs (Stopaj Yok)</option><option value="mukellef">Vergi Mükellefi (Stopaj %20)</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
          <input class="input" id="pos-firm" placeholder="Firma (isteğe bağlı)" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);font-size:11px;" />
          <input class="input" id="pos-tc" placeholder="TC / Vergi No (isteğe bağlı)" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);font-size:11px;" />
        </div>
        <button class="btn-primary" style="margin-top:10px;background:linear-gradient(135deg,#4CAF50,#66BB6A);font-size:15px;font-weight:700;" data-action="pos-pay">💳 Ödeme Al & Fatura Kes</button>
        <p style="font-size:10px;margin:6px 0 0;opacity:0.7;">Fatura No: ${nextInvoiceNo} | KDV: %10 | Otomatik vergi hesaplama</p>
      </div>

      <!-- Gider Ekle -->
      <div class="card p4 mb3">
        <p style="font-size:13px;font-weight:700;color:var(--bad);margin:0 0 8px;">📉 Gider Ekle</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input class="input" id="acc-exp-desc" placeholder="Açıklama (firma, detay)" style="font-size:12px;" />
          <input class="input" id="acc-exp-amount" type="number" placeholder="Tutar (₺)" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px;">
          <select class="input" id="acc-exp-cat" style="font-size:11px;">
            <option>Kira</option><option>Personel Maaş</option><option>SGK Primi</option><option>Malzeme</option><option>Vergi</option><option>Damga Vergisi</option><option>Sigorta</option><option>Elektrik/Su/İnternet</option><option>Cihaz Bakım</option><option>Muhasebeci</option><option>Bağ-Kur</option><option>Depozito</option><option>İade</option><option>Diğer</option>
          </select>
          <input class="input" id="acc-exp-firm" placeholder="Firma" style="font-size:11px;" />
          <input class="input" id="acc-exp-invoice" placeholder="Fatura No" style="font-size:11px;" />
        </div>
        <div style="margin-top:8px;">
          <label style="font-size:11px;display:flex;align-items:center;gap:6px;">
            <input type="checkbox" id="acc-exp-stopaj" /> Kira ödemesi (Stopaj %20 otomatik)
          </label>
        </div>
        <button class="btn-primary" style="margin-top:10px;background:var(--bad);" data-action="acc-add-expense">📉 Gider Kaydet</button>
      </div>

      <!-- Son İşlemler -->
      <div class="card p4 mb3">
        <p style="font-size:13px;font-weight:700;margin:0 0 10px;">📋 Son İşlemler (${recentTx.length})</p>
        ${recentTx.length === 0 ? '<p class="footnote">Henüz kayıt yok.</p>' : recentTx.map(tx => {
          const kdv = tx.kdv ? parseFloat(tx.kdv) : 0;
          const stopaj = tx.stopaj ? parseFloat(tx.stopaj) : 0;
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);">' +
            '<div style="flex:1;">' +
              '<p style="font-size:12px;margin:0;font-weight:600;">' + (tx.txType==='income'?'💰':'📉') + ' ' + escapeHtml(tx.description||'') + '</p>' +
              '<p style="font-size:10px;color:var(--muted);margin:2px 0 0;">' + escapeHtml(tx.category||'') + (tx.firm ? ' · '+escapeHtml(tx.firm) : '') + ' · ' + tx.date + (tx.invoiceNo ? ' · F:'+escapeHtml(tx.invoiceNo) : '') + '</p>' +
              (kdv || stopaj ? '<p style="font-size:9px;color:#888;margin:1px 0 0;">KDV: ₺'+kdv.toFixed(2)+' | Stopaj: ₺'+stopaj.toFixed(2)+'</p>' : '') +
            '</div>' +
            '<div style="text-align:right;display:flex;align-items:center;gap:6px;">' +
              '<p style="font-size:13px;font-weight:700;color:' + (tx.txType==='income'?'#2E7D32':'#C62828') + ';margin:0;">' + (tx.txType==='income'?'+':'-') + '₺' + (parseFloat(tx.amount)||0).toLocaleString('tr-TR') + '</p>' +
              '<button data-action="acc-delete" data-id="' + tx.id + '" data-type="' + tx.txType + '" style="background:#FFEBEE;border:none;border-radius:6px;padding:4px 6px;cursor:pointer;font-size:10px;color:#C62828;">🗑️</button>' +
            '</div>' +
          '</div>';
        }).join('')}
      </div>

      <!-- Aylık Vergi Detayı -->
      <div class="card p4 mb3">
        <p style="font-size:13px;font-weight:700;margin:0 0 8px;">🧾 ${monthStr}/${yearStr} Vergi Özeti</p>
        <table style="width:100%;font-size:11px;border-collapse:collapse;">
          <tr style="border-bottom:1px solid var(--line);"><td style="padding:4px 0;">Brüt Gelir</td><td style="text-align:right;font-weight:600;">₺${monthIncomes.reduce((s,i)=>s+(parseFloat(i.grossAmount||i.amount)||0),0).toLocaleString('tr-TR',{minimumFractionDigits:2})}</td></tr>
          <tr style="border-bottom:1px solid var(--line);"><td style="padding:4px 0;">Hesaplanan KDV (%10)</td><td style="text-align:right;color:#E65100;font-weight:600;">₺${totalKDV.toLocaleString('tr-TR',{minimumFractionDigits:2})}</td></tr>
          <tr style="border-bottom:1px solid var(--line);"><td style="padding:4px 0;">Kesilen Stopaj (%20)</td><td style="text-align:right;color:#1565C0;font-weight:600;">₺${totalStopaj.toLocaleString('tr-TR',{minimumFractionDigits:2})}</td></tr>
          <tr style="border-bottom:1px solid var(--line);"><td style="padding:4px 0;">Damga Vergisi (‰9.48)</td><td style="text-align:right;color:#7B1FA2;font-weight:600;">₺${(monthIncomes.reduce((s,i)=>s+(parseFloat(i.damga||0)||0),0)).toLocaleString('tr-TR',{minimumFractionDigits:2})}</td></tr>
          <tr><td style="padding:4px 0;font-weight:700;">Net Kâr/Zarar</td><td style="text-align:right;font-weight:800;color:${profit>=0?'#2E7D32':'#C62828'};">₺${profit.toLocaleString('tr-TR',{minimumFractionDigits:2})}</td></tr>
        </table>
      </div>

      <!-- Otomatik Aylık Giderler -->
      <div class="card p4 mb3" style="background:linear-gradient(135deg,#FFF3E0,#FFE0B2);border:1px solid #FFB74D;">
        <p style="font-size:14px;font-weight:700;margin:0 0 8px;color:#E65100;">🔄 Otomatik Aylık Giderler</p>
        <p style="font-size:11px;color:#BF360C;margin:0 0 10px;">Her ayın 5'inde otomatik muhasebeleştirilir. Tutarları ayarlayın.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">🏠 Kira</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).kira||50000}" data-auto="kira" /></div>
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">⚡ Elektrik</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).elektrik||3000}" data-auto="elektrik" /></div>
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">💧 Su</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).su||1500}" data-auto="su" /></div>
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">🔥 Doğalgaz</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).dogalgaz||2000}" data-auto="dogalgaz" /></div>
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">🏥 SGK/Prim</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).sgk||8000}" data-auto="sgk" /></div>
          <div style="display:flex;align-items:center;gap:4px;"><span style="font-size:11px;flex:1;">📋 Vergi/Beyanname</span><input class="input" style="width:80px;padding:4px 6px;font-size:11px;text-align:right;" type="number" value="${(state.autoExpenses||{}).vergi||5000}" data-auto="vergi" /></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn-primary" style="flex:1;font-size:12px;background:var(--bad);" data-action="save-auto-expenses">💾 Tutarları Kaydet</button>
          <button class="btn-primary" style="flex:1;font-size:12px;background:#E65100;" data-action="run-auto-expenses">⚡ Şimdi Uygula (Bu Ay)</button>
        </div>
        <p style="font-size:10px;color:#888;margin:6px 0 0;">Toplam aylık otomatik gider: ₺${Object.values(state.autoExpenses||{kira:50000,elektrik:3000,su:1500,dogalgaz:2000,sgk:8000,vergi:5000}).reduce((s,v) => s + (parseFloat(v)||0), 0).toLocaleString('tr-TR')}</p>
      </div>
    `;
  }
  return `${topbar("Yönetici Paneli","Menüden istediğiniz bölümü seçin.", {back:"home"})}
    <div class="content">
      <div class="admin-tabs">${tabButtons}</div>
      ${tabContent}
      <button class="linklike" data-action="admin-logout">Çıkış yap</button>
      <p class="footnote" style="margin-top:14px;">${state.fbReady ? "✓ Firebase'e bağlı — bu liste tüm cihazlarda anlık günceldir." : "⚠ Firebase bağlantısı bekleniyor, geçici olarak yalnızca bu cihazdaki veriler görünüyor."}</p>
    </div>`;
}

/* ---------------- YARDIMCI: ESCAPE ---------------- */
function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function escapeAttr(s){ return escapeHtml(s); }

/* ---------------- ANA RENDER / NAV ---------------- */

const SCREEN_MAP = {
  home: renderHome, services: renderServices, doctors: renderDoctors, devices: renderDevices,
  "dentist-game": renderDentistGame,
  smile: renderSmile,
  reviews: renderReviews, booking: renderBooking, store: renderStore,
  address: renderAddress, contact: renderContact, info: renderInfo, chatbot: renderChatbot,
  "admin-login": renderAdminLogin, "admin-panel": renderAdminPanel, account: renderAccount,
  "profile-edit": renderProfileEdit, "brushing-video": renderBrushingVideo, "family-add": renderFamilyAdd,
  settings: renderSettings,
};

function renderNav() {
  return NAV_TABS.map(tab => `
    <button class="navbtn ${state.screen===tab.id || (tab.id==='more' && state.moreOpen) ?'active':''}" data-action="${tab.id==='more'?'toggle-more':'goto'}" data-screen="${tab.id}">
      <span class="icon">${tab.img ? `<img src="${tab.img}" style="width:30px;height:30px;border-radius:6px;object-fit:contain;" />` : icon(tab.icon,20)}</span><span>${t(tab.id)}</span>
    </button>`).join("");
}

function renderMoreSheet() {
  if (!state.moreOpen) return "";
  const items = MORE_ITEMS.map(i => `
    <button class="grid-item" data-action="goto" data-screen="${i.id}">
      ${i.img ? `<img src="${i.img}" class="grid-icon" style="width:52px;height:52px;border-radius:12px;object-fit:cover;" />` : `<span class="grid-icon">${icon(i.icon,22)}</span>`}<span class="grid-label">${t(i.id)}</span>
    </button>`).join("");
  return `<div class="sheet-overlay" data-action="toggle-more">
    <div class="sheet">
      <div class="sheet-handle"></div>
      <p class="section-label" style="margin-top:4px;">${t("more")}</p>
      <div class="menu-grid">${items}</div>
    </div>
  </div>`;
}

function render() {
  stopCameraHardware();
  const screenEl = document.getElementById("screen");
  let target = state.screen;
  if (target === "store" && state.checkoutStatus === "form") target = "store"; // checkout handled inside renderStore
  const fn = SCREEN_MAP[target] || renderHome;
  screenEl.innerHTML = fn();
  document.getElementById("navbar").innerHTML = renderNav();
  document.getElementById("more-sheet").innerHTML = renderMoreSheet();
  const updateBar = document.getElementById("update-bar");
  if (updateBar) {
    updateBar.innerHTML = state.updateAvailable
      ? `<button data-action="reload-update" style="width:100%;border:none;background:var(--teal);color:#fff;padding:10px;font-size:13px;">🔄 Yeni sürüm hazır — yenilemek için dokun</button>`
      : "";
  }
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.innerHTML = state.lightboxPhoto
      ? `<div class="lightbox-overlay" data-action="close-lightbox"><img src="${state.lightboxPhoto}" class="lightbox-img" /></div>`
      : "";
  }
  bindFieldEvents();
  if (state.screen === "smile") initSmile();
  if (state.screen === "chatbot") { const log = document.getElementById("chat-log"); if (log) log.scrollTop = log.scrollHeight; }
}

function refreshDisabled() {
  const map = {
    "submit-booking": () => !(state.bookingForm.date && state.bookingForm.time && state.bookingForm.name && state.bookingForm.phone),
    "submit-contact": () => !(state.contactForm.name && state.contactForm.msg),
    "submit-review": () => !(state.reviewForm.name && state.reviewForm.text),
    "submit-order": () => !(state.checkoutForm.name && state.checkoutForm.phone && state.checkoutForm.address),
  };
  for (const action in map) {
    const btn = document.querySelector(`[data-action="${action}"]`);
    if (btn) btn.disabled = map[action]();
  }
}

function bindFieldEvents() {
  const $ = id => document.getElementById(id);
  /* smile scale slider kaldırıldı */
  if (state.screen === "booking") {
    const d=$("f-date"), n=$("f-name"), p=$("f-phone");
    if (d) d.onchange = e => { state.bookingForm.date = e.target.value; state.bookingStatus="idle"; render(); };
    if (n) n.oninput = e => { state.bookingForm.name = e.target.value; refreshDisabled(); };
    if (p) p.oninput = e => { state.bookingForm.phone = e.target.value; refreshDisabled(); };
  }
  if (state.screen === "contact") {
    const n=$("c-name"), p=$("c-phone"), m=$("c-msg");
    if (n) n.oninput = e => { state.contactForm.name = e.target.value; refreshDisabled(); };
    if (p) p.oninput = e => { state.contactForm.phone = e.target.value; };
    if (m) m.oninput = e => { state.contactForm.msg = e.target.value; refreshDisabled(); };
  }
  if (state.screen === "reviews") {
    const n=$("rv-name"), t=$("rv-text");
    if (n) n.oninput = e => { state.reviewForm.name = e.target.value; refreshDisabled(); };
    if (t) t.oninput = e => { state.reviewForm.text = e.target.value; refreshDisabled(); };
  }
  if (state.screen === "admin-login") {
    const u=$("ad-email"), p=$("ad-pass");
    if (u) u.oninput = e => { state.adminForm.email = e.target.value; };
    if (p) p.oninput = e => { state.adminForm.pass = e.target.value; };
  }
  if (state.screen === "admin-panel") {
    const n=$("np-name"), p=$("np-price");
    if (n) n.oninput = e => { state._newProdName = e.target.value; };
    if (p) p.oninput = e => { state._newProdPrice = e.target.value; };
  }
  if (state.screen === "chatbot") {
    const i=$("chat-input"), photo=$("chat-photo-input");
    if (i) { i.oninput = e => { state.chatInput = e.target.value; };
      i.onkeydown = e => { if (e.key==="Enter") sendChat(); }; }
    if (photo) photo.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxW = 700;
          const ratio = Math.min(1, maxW/img.width);
          canvas.width = img.width*ratio; canvas.height = img.height*ratio;
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          const base64 = dataUrl.split(",")[1];
          sendChat(base64);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
  }
  if (state.screen === "store" && state.checkoutStatus === "form") {
    const n=$("ck-name"), p=$("ck-phone"), a=$("ck-address");
    if (n) n.oninput = e => { state.checkoutForm.name = e.target.value; refreshDisabled(); };
    if (p) p.oninput = e => { state.checkoutForm.phone = e.target.value; refreshDisabled(); };
    if (a) a.oninput = e => { state.checkoutForm.address = e.target.value; refreshDisabled(); };
  }
}

function sendChat(imageBase64) {
  if (!state.user) {
    state.chatLog.push({ from:"bot", text:"⚠️ DİJİ DENT ile konuşmak için önce Google ile giriş yapmanız gerekiyor." });
    render();
    return;
  }
  const text = (state.chatInput||"").trim();
  if (!text && !imageBase64) return;
  
  // Engellenen kullanıcı kontrolü
  const userChatId = state.user.uid;
  if (state.blockedChatUsers.includes(userChatId)) {
    state.chatLog.push({ from:"bot", text:"⚠️ Hesabınız engellenmiştir. DİJİ DENT ile konuşamazsınız. Lütfen yönetici ile iletişime geçin." });
    state.chatInput = "";
    render();
    return;
  }
  
  // Küfürlü/argo/ahlaksız kelime kontrolü
  if (text) {
    const lowerText = text.toLowerCase();
    const hasBlockedWord = BLOCKED_WORDS.some(word => {
      // Kısa kelimeler (3 harf ve altı) için kelime sınırı kontrolü
      if (word.length <= 3) {
        const regex = new RegExp('(^|[^a-züöçşığİÜÖÇŞIĞ])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-züöçşığİÜÖÇŞIĞ])', 'i');
        return regex.test(lowerText);
      }
      // Uzun kelimeler için normal includes
      return lowerText.includes(word);
    });
    
    if (hasBlockedWord) {
      // Uyarı ver ve engelle
      state.chatLog.push({ from:"bot", text:"⚠️ Küfürlü, argo veya ahlaksız içerik tespit edildi. Bu tür mesajlar kabul edilmez. Tekrarlanması durumunda hesabınız engellenecektir." });
      
      // İlk ihlal: Uyarı
      const warnings = parseInt(localStorage.getItem('dincdis_chat_warnings_' + userChatId) || '0') + 1;
      localStorage.setItem('dincdis_chat_warnings_' + userChatId, warnings.toString());
      
      // 3. ihlal: Otomatik engelle
      if (warnings >= 3) {
        if (!state.blockedChatUsers.includes(userChatId)) {
          state.blockedChatUsers.push(userChatId);
          localStorage.setItem('dincdis_blocked_chat_users', JSON.stringify(state.blockedChatUsers));
          state.chatLog.push({ from:"bot", text:"🚫 Hesabınız küfürlü/argo/ahlaksız içerik nedeniyle engellenmiştir. Lütfen yönetici ile iletişime geçin." });
        }
      }
      
      state.chatInput = "";
      render();
      return;
    }
  }
  
  state.chatLog.push({ from:"user", text: text || "📷 Fotoğraf gönderildi", image: imageBase64 ? ("data:image/jpeg;base64,"+imageBase64) : null });
  state.chatInput = "";
  render();
  playSound("click");

  if (AI_ENDPOINT_READY) {
    // Chat geçmişi oluştur (son 10 mesaj)
    const recentMessages = state.chatLog.slice(-10).map(m => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text
    }));
    if (text) recentMessages.push({ role: "user", content: text });

    fetch(AI_ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "chat", messages: recentMessages }),
    })
      .then(r => r.json())
      .then(data => {
        let replyText = data.reply || CHATBOT_FALLBACK;
        let showBookingBtn = false;
        if (replyText.includes("[RANDEVU_BUTONU]")) {
          replyText = replyText.replace("[RANDEVU_BUTONU]", "").trim();
          showBookingBtn = true;
        }
        state.chatLog.push({ from:"bot", text: replyText, bookingBtn: showBookingBtn });
        render();
      })
      .catch(() => {
        const item = findChatReply(text || "diş");
        state.chatLog.push({ from:"bot", text: item.reply });
        render();
      });
    return;
  }

  setTimeout(() => {
    const item = findChatReply(text || "diş");
    state.chatLog.push({ from:"bot", text: item.reply });
    render();
    if (item.goto) {
      setTimeout(() => {
        state.screen = item.goto;
        if (item.expand) state.expandedService = item.expand;
        window.scrollTo(0,0);
        render();
      }, 900);
    }
  }, 350);
}

/* ---------------- TIKLAMA OLAYLARI ---------------- */

let _entrySoundPlayed = false;
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (!_entrySoundPlayed) { _entrySoundPlayed = true; playSound("login"); }
  else if (action !== "send-chat") playSound("click"); // sendChat kendi tık sesini zaten çalıyor

  if (action === "goto") {
    state.screen = el.dataset.screen;
    state.moreOpen = false;
    if (state.screen !== "store") state.checkoutStatus = state.checkoutStatus === "form" ? "idle" : state.checkoutStatus;
    window.scrollTo(0,0);
    history.pushState({ screen: state.screen }, "", "#" + state.screen);
    render();
  }
  if (action === "goto-service") {
    state.screen = "services";
    state.expandedService = el.dataset.id;
    render();
  }
  if (action === "toggle-service") {
    state.expandedService = state.expandedService === el.dataset.id ? null : el.dataset.id;
    render();
  }
  if (action === "toggle-device") {
    state.expandedDevice = state.expandedDevice === el.dataset.id ? null : el.dataset.id;
    render();
  }
  if (action === "toggle-more") {
    state.moreOpen = !state.moreOpen;
    render();
  }
  if (action === "pick-time") { state.bookingForm.time = el.dataset.time; state.bookingStatus="idle"; render(); }
  if (action === "submit-booking") {
    const f = state.bookingForm;
    if (!(f.date && f.time && f.name && f.phone) || !state.user) return;
    state.bookingStatus = "saving"; render();
    const entry = { date:f.date, time:f.time, name:f.name, phone:f.phone, uid: state.user.uid };
    (async () => {
      try {
        if (window.fb && state.fbReady) await window.fb.addAppointment(entry);
        else { state.appointments.push({ id:Date.now(), ...entry }); persist("dincdis_appointments", state.appointments); }
        state.myAppointments.push({ id:Date.now(), ...entry });
        state.bookingStatus = "done";
        state.bookingForm = { date:"", time:"", name:"", phone:"" };
        playSound("success");
      } catch (e) { state.bookingStatus = "error"; playSound("error"); }
      render();
    })();
  }
  if (action === "submit-contact") {
    const c = state.contactForm;
    if (!(c.name && c.msg)) return;
    state.contactStatus = "saving"; render();
    (async () => {
      try {
        if (window.fb && state.fbReady) await window.fb.addMessage(c);
        else {
          let list=[]; try{ list = JSON.parse(localStorage.getItem("dincdis_messages")||"[]"); }catch(e){}
          list.push({ id:Date.now(), ...c });
          persist("dincdis_messages", list);
        }
        state.contactStatus = "done";
        state.contactForm = { name:"", phone:"", msg:"" };
        playSound("success");
      } catch (e) { state.contactStatus = "error"; playSound("error"); }
      render();
    })();
  }
  if (action === "pick-rating") { state.reviewForm.rating = parseInt(el.dataset.n,10); render(); }
  if (action === "submit-review") {
    const r = state.reviewForm;
    if (!(r.name && r.text) || !state.user) return;
    
    // Engellenen kullanıcı kontrolü
    if (state.blockedUsers.includes(state.user.uid)) {
      alert("Hesabınız engellenmiştir. Yorum yapamazsınız.");
      return;
    }
    
    const entry = { name:r.name, rating:r.rating, text:r.text, uid: state.user.uid };
    (async () => {
      try {
        if (window.fb && state.fbReady) await window.fb.addReview(entry);
        else { state.reviews.push({ id:Date.now(), ...entry }); persist("dincdis_reviews", state.reviews); }
        playSound("success");
      } catch (e) { /* sessiz geç, kullanıcıyı engellemeyelim */ }
      state.reviewForm = { name:"", rating:5, text:"" };
      render();
    })();
  }
  if (action === "cart-inc") { state.cart[el.dataset.id] = (state.cart[el.dataset.id]||0)+1; render(); }
  if (action === "cart-dec") { state.cart[el.dataset.id] = Math.max(0,(state.cart[el.dataset.id]||0)-1); render(); }
  if (action === "goto-checkout") { state.checkoutStatus = "form"; render(); }
  if (action === "back-to-store") { state.checkoutStatus = "idle"; render(); }
  if (action === "submit-order") {
    const c = state.checkoutForm;
    if (!(c.name && c.phone && c.address) || !state.user) return;
    const items = []; const all = allProducts();
    for (const cat of all) for (const p of cat.items) if (state.cart[p.id]) items.push({name:p.name, qty:state.cart[p.id], price:p.price});
    const entry = { ...c, items, total: cartTotal(), uid: state.user.uid };
    (async () => {
      try {
        if (window.fb && state.fbReady) await window.fb.addOrder(entry);
        else {
          let list=[]; try{ list = JSON.parse(localStorage.getItem("dincdis_orders")||"[]"); }catch(e){}
          list.push({ id:Date.now(), ...entry });
          persist("dincdis_orders", list);
        }
        state.cart = {};
        state.checkoutForm = { name:"", phone:"", address:"" };
        state.checkoutStatus = "idle";
        state.screen = "home";
        render();
        playSound("success");
        alert("Siparişiniz alındı! Ödeme ve kargo bilgileri için sizinle iletişime geçilecektir.");
      } catch (e) { playSound("error"); alert("Sipariş kaydedilemedi, lütfen tekrar dene."); }
    })();
  }
  if (action === "send-chat") sendChat();
  if (action === "chat-photo-pick") { document.getElementById("chat-photo-input")?.click(); }
  /* smile handler'lar kaldırıldı - Dişini Tasarla yeni kod bekleniyor */
  if (action === "toggle-mute") {
    state.settings.muted = !state.settings.muted;
    persist("dincdis_settings", state.settings);
    render();
  }
  if (action === "set-lang") {
    state.settings.lang = el.dataset.id;
    persist("dincdis_settings", state.settings);
    render();
  }
  if (action === "sign-in-google") {
    if (!window.fb) { alert("Giriş sistemi henüz hazır değil, birkaç saniye sonra tekrar dene."); return; }
    state.authBusy = true; render();
    window.fb.signInGoogle().then((res) => {
      state.authBusy = false;
      if (!res.ok) { playSound("error"); alert("Giriş yapılamadı: " + (res.error||"")); }
      else playSound("login");
      render();
    });
  }
  if (action === "sign-out") {
    if (window.fb) window.fb.signOutUser();
    state.userProfile = null;
    state.brushStreak = 0;
    state.lastBrushDate = null;
    localStorage.removeItem("dincdis_user_profile");
    localStorage.removeItem("dincdis_brush_streak");
    localStorage.removeItem("dincdis_last_brush");
    state.screen = "home";
    render();
  }

  /* ===== PROFİL SİSTEMİ ===== */
  if (action === "edit-profile") {
    state.screen = "profile-edit";
    render();
  }

  if (action === "save-profile") {
    const profile = {
      firstName: (document.getElementById("pf-first")?.value || "").trim(),
      lastName: (document.getElementById("pf-last")?.value || "").trim(),
      age: parseInt(document.getElementById("pf-age")?.value) || null,
      weight: parseFloat(document.getElementById("pf-weight")?.value) || null,
      height: parseFloat(document.getElementById("pf-height")?.value) || null,
      brushReminderTime: state.userProfile?.brushReminderTime || "21:00",
      notificationsEnabled: state.userProfile?.notificationsEnabled !== false,
      lastCheckup: state.userProfile?.lastCheckup || null,
    };
    state.userProfile = profile;
    localStorage.setItem("dincdis_user_profile", JSON.stringify(profile));
    // Firebase'e kaydet
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, profile).catch(e => console.error("Profil kaydedilemedi:", e));
    }
    state.screen = "account";
    render();
    showNotif("✅ Profil Kaydedildi", "Bilgileriniz güncellendi.");
  }

  if (action === "brush-teeth") {
    const today = new Date().toDateString();
    if (state.lastBrushDate === today) return; // Zaten bugün fırçalamış
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastBrushDate === yesterday) {
      state.brushStreak = (state.brushStreak || 0) + 1;
    } else {
      state.brushStreak = 1; // Seri kırılmış, yeniden başla
    }
    state.lastBrushDate = today;
    localStorage.setItem("dincdis_brush_streak", state.brushStreak);
    localStorage.setItem("dincdis_last_brush", today);
    // Firebase'e kaydet
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveBrushStreak(state.user.uid, { streak: state.brushStreak, lastDate: today }).catch(() => {});
    }
    render();
    const milestones = [7, 14, 30, 60, 100, 365];
    const milestone = milestones.find(m => state.brushStreak === m);
    checkBadges();
    if (milestone) {
      showNotif("🏆 Tebrikler!", `${milestone} günlük diş fırçalama serisine ulaştın!`);
    } else {
      showNotif("🪥 Harika!", `${state.brushStreak} günlük seri! Devam et!`);
    }
  }

  if (action === "save-brush-time") {
    const time = document.getElementById("brush-time")?.value || "21:00";
    if (!state.userProfile) state.userProfile = {};
    state.userProfile.brushReminderTime = time;
    localStorage.setItem("dincdis_user_profile", JSON.stringify(state.userProfile));
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, state.userProfile).catch(() => {});
    }
    // Bildirim planla
    scheduleBrushReminder(time);
    render();
    showNotif("⏰ Hatırlatma Ayarlandı", `Her gün saat ${time}'de diş fırçalama hatırlatması alacaksınız.`);
  }

  if (action === "mark-checkup-done") {
    if (!state.userProfile) state.userProfile = {};
    state.userProfile.lastCheckup = new Date().toISOString();
    localStorage.setItem("dincdis_user_profile", JSON.stringify(state.userProfile));
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, state.userProfile).catch(() => {});
    }
    // 6 ay sonrası için bildirim planla
    scheduleCheckupReminder();
    render();
    showNotif("🏥 Kontrol Kaydedildi", "6 ay sonra bir sonraki kontrol hatırlatması alacaksınız.");
  }

  if (action === "toggle-notifications") {
    if (!state.userProfile) state.userProfile = {};
    state.userProfile.notificationsEnabled = el.checked;
    localStorage.setItem("dincdis_user_profile", JSON.stringify(state.userProfile));
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, state.userProfile).catch(() => {});
    }
    if (el.checked) requestNotifPermission();
  }

  if (action === "watch-brush-video") {
    state.screen = "brushing-video";
    render();
  }

  /* ===== AİLE ÜYESİ SİSTEMİ ===== */
  if (action === "add-family-member") {
    state._editingFamilyMember = null;
    state.screen = "family-add";
    render();
  }

  if (action === "edit-family-member") {
    state._editingFamilyMember = el.dataset.id;
    state.screen = "family-add";
    render();
  }

  if (action === "save-family-member") {
    const name = (document.getElementById("fm-name")?.value || "").trim();
    const relation = document.getElementById("fm-relation")?.value || "";
    const age = parseInt(document.getElementById("fm-age")?.value) || null;
    const brushReminderTime = document.getElementById("fm-brush-time")?.value || "20:00";
    if (!name) { alert("Ad soyad gerekli!"); return; }

    if (!state.familyMembers) state.familyMembers = [];
    
    if (state._editingFamilyMember) {
      // Düzenle
      const idx = state.familyMembers.findIndex(m => m.id === state._editingFamilyMember);
      if (idx !== -1) {
        state.familyMembers[idx] = { ...state.familyMembers[idx], name, relation, age, brushReminderTime };
      }
    } else {
      // Yeni ekle
      state.familyMembers.push({
        id: "fm_" + Date.now(),
        name, relation, age, brushReminderTime,
        streak: 0, lastBrushDate: null
      });
    }

    // Kaydet
    localStorage.setItem("dincdis_family_members", JSON.stringify(state.familyMembers));
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, { ...state.userProfile, familyMembers: state.familyMembers }).catch(() => {});
    }
    state._editingFamilyMember = null;
    checkBadges();
    state.screen = "account";
    render();
    showNotif("👨‍👩‍👧 Kaydedildi", `${name} aile üyelerinize eklendi.`);
  }

  if (action === "remove-family-member") {
    const id = el.dataset.id;
    if (!confirm("Bu aile üyesini silmek istediğinize emin misiniz?")) return;
    state.familyMembers = (state.familyMembers || []).filter(m => m.id !== id);
    localStorage.setItem("dincdis_family_members", JSON.stringify(state.familyMembers));
    if (window.fb && state.fbReady && state.user) {
      window.fb.saveUserProfile(state.user.uid, { ...state.userProfile, familyMembers: state.familyMembers }).catch(() => {});
    }
    render();
  }

  if (action === "save-brush-video") {
    const url = (document.getElementById("brush-video-url")?.value || "").trim();
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setBrushingVideo(url).then(() => {
      state.brushingVideoUrl = url;
      alert("Diş fırçalama videosu kaydedildi.");
    }).catch(() => alert("Kaydedilemedi."));
  }

  /* ===== GÖRSEL YÖNETİMİ (Doktor Foto, Logo, Splash) ===== */
  if (action === "save-doctor-photo") {
    const url = (document.getElementById("doctor-photo-url")?.value || "").trim();
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setClinicSetting("doctor_photo", url).then(() => {
      state.doctorPhotoUrl = url;
      render();
      alert("Doktor fotoğrafı güncellendi.");
    }).catch(() => alert("Kaydedilemedi."));
  }
  if (action === "save-clinic-logo") {
    const url = (document.getElementById("clinic-logo-url")?.value || "").trim();
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setClinicSetting("clinic_logo", url).then(() => {
      state.clinicLogoUrl = url;
      render();
      alert("Klinik logosu güncellendi.");
    }).catch(() => alert("Kaydedilemedi."));
  }
  if (action === "save-splash-image") {
    const url = (document.getElementById("splash-image-url")?.value || "").trim();
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setClinicSetting("splash_image", url).then(() => {
      state.splashImageUrl = url;
      render();
      alert("Splash görseli güncellendi.");
    }).catch(() => alert("Kaydedilemedi."));
  }

  /* ===== TEDAVİ YÖNETİMİ ===== */
  if (action === "add-treatment") {
    const userName = (document.getElementById("tr-user")?.value || "").trim();
    const treatmentName = (document.getElementById("tr-name")?.value || "").trim();
    const date = document.getElementById("tr-date")?.value || new Date().toISOString().split('T')[0];
    const notes = (document.getElementById("tr-notes")?.value || "").trim();
    const payment = document.getElementById("tr-payment")?.value || "Nakit";
    const patientType = document.getElementById("tr-patient-type")?.value || "kisi";
    if (!userName || !treatmentName) { alert("Hasta adı ve tedavi gerekli!"); return; }

    // Fiyat listesinden fiyatı al
    const defaultPrices = { "Muayene":0,"Dolgu":2000,"Kanal Tedavisi":4000,"İmplant":15000,"Zirkonyum Kaplama":5000,"Diş Beyazlatma":3000,"Ortodonti":25000,"Protez":12000,"Diş Taşı Temizliği":1000,"Diş Çekimi":1500,"Köprü":8000,"Lamine Veneer":6000,"Şeffaf Plak":20000,"Cerrahi Çekim":3000 };
    const allPrices = { ...defaultPrices, ...(state.treatmentPrices || {}) };
    const grossAmount = allPrices[treatmentName] || 0;

    // Tedavi kaydını Firebase'e ekle
    const treatmentData = { userName, treatmentName, date, notes, amount: grossAmount, paymentMethod: payment, patientType };

    // Otomatik fatura + muhasebe
    if (grossAmount > 0) {
      if (!state.accounting) state.accounting = { incomes:[], expenses:[], firms:[], bankAccounts:[], invoices:[] };
      const kdv = grossAmount * 0.10;
      const stopaj = patientType === "mukellef" ? grossAmount * 0.20 : 0;
      const damga = grossAmount * 0.00948;
      const netTahsil = grossAmount - stopaj + kdv;

      const now = new Date();
      const monthStr = String(now.getMonth()+1).padStart(2,'0');
      const yearStr = String(now.getFullYear());
      const thisMonthInv = (state.accounting.invoices||[]).filter(inv => inv.no && inv.no.startsWith(yearStr+'-'+monthStr));
      const invoiceNo = yearStr+'-'+monthStr+'-'+String((thisMonthInv.length||0)+1).padStart(5,'0');

      state.accounting.incomes.push({
        id:"inc_"+Date.now(), description: userName + " - " + treatmentName, amount: netTahsil, grossAmount,
        category: treatmentName, paymentMethod: payment, date, kdv, stopaj, damga, kdvOran:0.10, stopajOran: patientType==='mukellef'?0.20:0,
        invoiceNo, patientType, createdAt: new Date().toISOString()
      });
      if (!state.accounting.invoices) state.accounting.invoices = [];
      state.accounting.invoices.push({ no:invoiceNo, date, description:userName+' - '+treatmentName, grossAmount, kdv, stopaj, damga, netAmount:netTahsil, category:treatmentName, paymentMethod:payment });
      localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();
      treatmentData.invoiceNo = invoiceNo;
    }

    if (window.fb && state.fbReady) {
      window.fb.addTreatment(treatmentData).then(() => {
        let msg = "✅ Tedavi kaydedildi: " + treatmentName;
        if (grossAmount > 0) msg += "\n💰 ₺" + grossAmount.toLocaleString('tr-TR') + (treatmentData.invoiceNo ? "\n🧾 Fatura: " + treatmentData.invoiceNo : "");
        alert(msg);
        render();
      }).catch(() => alert("Kaydedilemedi."));
    } else {
      // Firebase yoksa local'e kaydet
      if (!state.treatments) state.treatments = [];
      state.treatments.push({ id:"tr_"+Date.now(), ...treatmentData });
      localStorage.setItem("dincdis_treatments_local", JSON.stringify(state.treatments));
      let msg = "✅ Tedavi kaydedildi: " + treatmentName;
      if (grossAmount > 0) msg += "\n💰 ₺" + grossAmount.toLocaleString('tr-TR');
      alert(msg);
      render();
    }
  }

  if (action === "delete-treatment") {
    const id = el.dataset.id;
    if (!confirm("Bu tedavi kaydını silmek istediğinize emin misiniz?")) return;
    // Local'den sil
    state.treatments = (state.treatments||[]).filter(t => t.id !== id);
    localStorage.setItem("dincdis_treatments_local", JSON.stringify(state.treatments));
    if (window.fb && state.fbReady) {
      window.fb.deleteTreatment(id).then(() => render()).catch(() => render());
    } else { render(); }
  }

  /* ===== FİYAT LİSTESİ YÖNETİMİ ===== */
  if (action === "add-price") {
    const name = document.getElementById("new-price-name")?.value?.trim();
    const amount = parseFloat(document.getElementById("new-price-amount")?.value);
    if (!name || isNaN(amount)) { alert("Tedavi adı ve fiyat gerekli!"); return; }
    if (!state.treatmentPrices) state.treatmentPrices = {};
    state.treatmentPrices[name] = amount;
    localStorage.setItem("dincdis_treatment_prices", JSON.stringify(state.treatmentPrices)); saveAccountingToFirebase();
    alert("✅ " + name + ": ₺" + amount.toLocaleString('tr-TR'));
    render();
  }

  if (action === "update-price") {
    const name = el.dataset.priceName;
    const amount = parseFloat(el.value);
    if (!name || isNaN(amount)) return;
    if (!state.treatmentPrices) state.treatmentPrices = {};
    state.treatmentPrices[name] = amount;
    localStorage.setItem("dincdis_treatment_prices", JSON.stringify(state.treatmentPrices)); saveAccountingToFirebase();
  }

  /* ===== OTOMATİK GİDER YÖNETİMİ ===== */
  if (action === "save-auto-expenses") {
    const inputs = document.querySelectorAll("[data-auto]");
    if (!state.autoExpenses) state.autoExpenses = {};
    inputs.forEach(inp => { state.autoExpenses[inp.dataset.auto] = parseFloat(inp.value) || 0; });
    localStorage.setItem("dincdis_auto_expenses", JSON.stringify(state.autoExpenses)); saveAccountingToFirebase();
    alert("✅ Otomatik gider tutarları kaydedildi.");
    render();
  }

  if (action === "run-auto-expenses") {
    if (!confirm("Bu ayın otomatik giderlerini şimdi muhasebeleştirmek istiyor musunuz?")) return;
    if (!state.accounting) state.accounting = { incomes:[], expenses:[], firms:[], bankAccounts:[], invoices:[] };
    const ae = state.autoExpenses || { kira:50000, elektrik:3000, su:1500, dogalgaz:2000, sgk:8000, vergi:5000 };
    const date = new Date().toISOString().split('T')[0];
    const autoItems = [
      { desc:"Kira Ödemesi", cat:"Kira", amount:ae.kira, firm:"", stopaj:ae.kira*0.20, isKiraStopaj:true },
      { desc:"Elektrik Faturası", cat:"Elektrik/Su/İnternet", amount:ae.elektrik, firm:"" },
      { desc:"Su Faturası", cat:"Elektrik/Su/İnternet", amount:ae.su, firm:"" },
      { desc:"Doğalgaz Faturası", cat:"Elektrik/Su/İnternet", amount:ae.dogalgaz, firm:"" },
      { desc:"SGK/Prim Ödemesi", cat:"SGK Primi", amount:ae.sgk, firm:"" },
      { desc:"Vergi Beyannamesi", cat:"Vergi", amount:ae.vergi, firm:"" },
    ];
    let total = 0;
    autoItems.forEach(item => {
      if (item.amount > 0) {
        state.accounting.expenses.push({
          id:"exp_auto_"+Date.now()+"_"+Math.random().toString(36).substr(2,4),
          description: item.desc, amount: item.amount, category: item.cat, firm: item.firm,
          date, stopaj: item.stopaj||0, isKiraStopaj: item.isKiraStopaj||false,
          createdAt: new Date().toISOString()
        });
        total += item.amount;
      }
    });
    localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();
    alert("✅ " + autoItems.filter(i=>i.amount>0).length + " otomatik gider muhasebeleştirildi.\nToplam: ₺" + total.toLocaleString('tr-TR'));
    render();
  }

  if (action === "print-treatments") {
    const printContent = document.querySelector('.card.p4.mb3:last-child')?.innerHTML || '';
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>Tedavi Kayıtları</title><style>body{font-family:Arial;padding:20px;} .card{border:1px solid #ddd;padding:10px;margin:8px 0;border-radius:8px;}</style></head><body><h2>Dinç Diş Klinik - Tedavi Kayıtları</h2>' + printContent + '</body></html>');
    w.document.close();
    w.print();
  }

  /* ===== İPUCU YÖNETİMİ ===== */
  if (action === "add-tip") {
    const text = (document.getElementById("tip-text")?.value || "").trim();
    if (!text) { alert("İpucu metni gerekli!"); return; }
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.addHealthTip(text).then(() => {
      alert("İpucu eklendi.");
      render();
    }).catch(() => alert("Eklenemedi."));
  }

  if (action === "delete-tip") {
    const id = el.dataset.id;
    if (!confirm("Bu ipucunu silmek istediğinize emin misiniz?")) return;
    if (window.fb && state.fbReady) {
      window.fb.deleteHealthTip(id).then(() => render()).catch(() => alert("Silinemedi."));
    }
  }

  if (action === "add-announcement") {
    const title = document.getElementById("ann-title")?.value?.trim();
    const text = document.getElementById("ann-text")?.value?.trim();
    const videoUrl = document.getElementById("ann-video")?.value?.trim() || "";
    const imageFile = document.getElementById("ann-image")?.files?.[0];
    if (!title || !text) { alert("Başlık ve metin gerekli!"); return; }

    const addAnnouncement = (imageUrl) => {
      if (window.fb && state.fbReady) {
        window.fb.addAnnouncement({ title, text, imageUrl: imageUrl || "", videoUrl, createdAt: new Date().toISOString() })
          .then(() => {
            alert("Duyuru yayınlandı! 📢");
            render();
          }).catch(e => alert("Yayınlanamadı: " + e.message));
      } else {
        alert("Firebase bağlantısı hazır değil.");
      }
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => addAnnouncement(e.target.result);
      reader.readAsDataURL(imageFile);
    } else {
      addAnnouncement("");
    }
  }

  if (action === "delete-announcement") {
    const id = el.dataset.id;
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    if (window.fb && state.fbReady) {
      window.fb.deleteAnnouncement(id).then(() => render()).catch(() => alert("Silinemedi."));
    }
  }

  if (action === "reload-update") {
    window.location.reload();
  }
  if (action === "toggle-doctor") {
    state.expandedDoctor = state.expandedDoctor === el.dataset.id ? null : el.dataset.id;
    render();
  }
  if (action === "open-lightbox") {
    state.lightboxPhoto = el.dataset.src;
    render();
  }
  if (action === "close-lightbox") {
    state.lightboxPhoto = null;
    render();
  }
  if (action === "set-info-tab") {
    state.infoTab = el.dataset.id;
    render();
  }
  if (action === "admin-login") {
    if (!window.fb) { state.adminError = "Giriş sistemi henüz hazır değil, birkaç saniye sonra tekrar dene."; render(); return; }
    state.authBusy = true; state.adminError = ""; render();
    window.fb.adminSignIn(state.adminForm.email, state.adminForm.pass).then((res) => {
      state.authBusy = false;
      if (res.ok) {
        state.adminLoggedIn = true; localStorage.setItem("dincdis_admin_logged_in", "true"); state.adminError = ""; state.screen = "admin-panel";
        startAdminSubscriptions();
        playSound("login");
      } else {
        state.adminError = res.error || "Giriş başarısız.";
        playSound("error");
      }
      render();
    });
  }
  if (action === "admin-tab") {
    state.adminTab = el.dataset.tab;
    render();
  }
  if (action === "admin-logout") {
    stopAdminSubscriptions();
    if (window.fb) window.fb.signOutUser();
    state.adminLoggedIn = false; localStorage.removeItem("dincdis_admin_logged_in"); state.screen = "home"; render();
  }

  /* ===== 🎮 DİŞ DOKTORU OYUNU HANDLER'LARI ===== */
  if (action === "game-start") {
    resetGame();
    gameState.screen = "exam";
    render();
  }

  if (action === "game-restart") {
    resetGame();
    gameState.screen = "exam";
    render();
  }

  if (action === "game-tooth") {
    const isBad = el.dataset.bad === "true";
    if (isBad) {
      gameState.screen = "diagnose";
      gameState.message = "";
      gameState.score += 10;
      render();
    } else {
      gameState.message = "❌ Bu diş sağlam! Sorunlu dişi bul!";
      render();
    }
  }

  if (action === "game-diagnose") {
    const patient = GAME_PATIENTS[gameState.patientIndex];
    const selected = el.dataset.problem;
    if (selected === patient.problem) {
      gameState.message = "✅ Doğru teşhis! " + patient.problemLabel + "!";
      gameState.score += 20;
      setTimeout(() => {
        gameState.screen = "tools";
        gameState.message = "";
        render();
      }, 1200);
      render();
    } else {
      gameState.message = "❌ Yanlış! Tekrar dene.";
      render();
    }
  }

  if (action === "game-tool") {
    const patient = GAME_PATIENTS[gameState.patientIndex];
    const selected = el.dataset.tool;
    if (selected === patient.tool) {
      gameState.message = "";
      gameState.screen = "treating";
      gameState.treatClicks = 0;
      gameState.treatTarget = 10 + Math.floor(Math.random() * 5);
      render();
    } else {
      gameState.message = "❌ Yanlış alet! " + patient.treatmentLabel + " için doğru aleti seç.";
      render();
    }
  }

  if (action === "game-treat") {
    gameState.treatClicks++;
    if (gameState.treatClicks >= gameState.treatTarget) {
      // Tedavi tamamlandı
      gameState.screen = "result";
      gameState.score += 20;
      gameState.stars++;
      render();
    } else {
      render();
    }
  }

  if (action === "game-next") {
    gameState.patientIndex++;
    if (gameState.patientIndex >= GAME_PATIENTS.length) {
      gameState.screen = "done";
    } else {
      gameState.screen = "exam";
      gameState.message = "";
      gameState.badToothIndex = Math.floor(Math.random() * 8);
    }
    render();
  }

  /* ===== 💰 MUHASEBE HANDLER'LARI ===== */
  if (action === "pos-pay") {
    const desc = document.getElementById("pos-desc")?.value?.trim();
    const amount = parseFloat(document.getElementById("pos-amount")?.value);
    const category = document.getElementById("pos-category")?.value;
    const payment = document.getElementById("pos-payment")?.value;
    const patientType = document.getElementById("pos-patient-type")?.value;
    const firm = document.getElementById("pos-firm")?.value?.trim() || "";
    const tc = document.getElementById("pos-tc")?.value?.trim() || "";
    if (!desc || !amount) { alert("Açıklama ve tutar gerekli!"); return; }
    if (!state.accounting) state.accounting = { incomes:[], expenses:[], firms:[], bankAccounts:[], invoices:[] };

    // Otomatik vergi hesaplama
    const grossAmount = amount; // Brüt tutar
    const kdvOran = 0.10; // Sağlık hizmetleri KDV %10
    const kdv = grossAmount * kdvOran;
    const stopajOran = patientType === "mukellef" ? 0.20 : 0;
    const stopaj = grossAmount * stopajOran;
    const damga = grossAmount * 0.00948; // Damga vergisi ‰9.48
    const netTahsil = grossAmount - stopaj + kdv;

    // Otomatik fatura no
    const now = new Date();
    const monthStr = String(now.getMonth()+1).padStart(2,'0');
    const yearStr = String(now.getFullYear());
    const thisMonthInvoices = (state.accounting.invoices||[]).filter(inv => inv.no && inv.no.startsWith(yearStr + '-' + monthStr));
    const invoiceNo = yearStr + '-' + monthStr + '-' + String((thisMonthInvoices.length || 0) + 1).padStart(5, '0');
    const date = now.toISOString().split('T')[0];

    // Gelir kaydı
    state.accounting.incomes.push({
      id: "inc_" + Date.now(), description: desc, amount: netTahsil, grossAmount: grossAmount,
      category: category, paymentMethod: payment, date: date, firm: firm, tcNo: tc,
      kdv: kdv, stopaj: stopaj, damga: damga, kdvOran: kdvOran, stopajOran: stopajOran,
      invoiceNo: invoiceNo, patientType: patientType,
      createdAt: new Date().toISOString()
    });

    // Fatura kaydı
    if (!state.accounting.invoices) state.accounting.invoices = [];
    state.accounting.invoices.push({
      no: invoiceNo, date: date, description: desc, grossAmount: grossAmount,
      kdv: kdv, stopaj: stopaj, damga: damga, netAmount: netTahsil,
      category: category, paymentMethod: payment, firm: firm, tcNo: tc
    });

    localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();

    // Makbuz özeti
    let receipt = "✅ ÖDEME ALINDI!\n\n";
    receipt += "Fatura No: " + invoiceNo + "\n";
    receipt += "Hasta/Firma: " + desc + (firm ? " (" + firm + ")" : "") + "\n";
    receipt += "İşlem: " + category + "\n";
    receipt += "Ödeme: " + payment + "\n\n";
    receipt += "── Vergi Detayı ──\n";
    receipt += "Brüt Tutar: ₺" + grossAmount.toLocaleString('tr-TR',{minimumFractionDigits:2}) + "\n";
    receipt += "KDV (%10): ₺" + kdv.toLocaleString('tr-TR',{minimumFractionDigits:2}) + "\n";
    if (stopaj > 0) receipt += "Stopaj (%20): -₺" + stopaj.toLocaleString('tr-TR',{minimumFractionDigits:2}) + "\n";
    receipt += "Damga (‰9.48): ₺" + damga.toLocaleString('tr-TR',{minimumFractionDigits:2}) + "\n";
    receipt += "───\n";
    receipt += "NET TAHSİL: ₺" + netTahsil.toLocaleString('tr-TR',{minimumFractionDigits:2});

    alert(receipt);
    render();
  }

  if (action === "acc-add-expense") {
    const desc = document.getElementById("acc-exp-desc")?.value?.trim();
    const amount = parseFloat(document.getElementById("acc-exp-amount")?.value);
    const category = document.getElementById("acc-exp-cat")?.value;
    const firm = document.getElementById("acc-exp-firm")?.value?.trim() || "";
    const invoiceNo = document.getElementById("acc-exp-invoice")?.value?.trim() || "";
    const isKiraStopaj = document.getElementById("acc-exp-stopaj")?.checked;
    if (!desc || !amount) { alert("Açıklama ve tutar gerekli!"); return; }
    if (!state.accounting) state.accounting = { incomes:[], expenses:[], firms:[], bankAccounts:[], invoices:[] };

    // Kira stopajı otomatik hesaplama
    let stopaj = 0;
    let grossAmount = amount;
    if (isKiraStopaj) {
      // Kira stopajı: Brüt × %20
      grossAmount = amount;
      stopaj = grossAmount * 0.20;
    }

    state.accounting.expenses.push({
      id: "exp_" + Date.now(), description: desc, amount: amount, grossAmount: grossAmount,
      category: category, firm: firm, date: new Date().toISOString().split('T')[0],
      invoiceNo: invoiceNo, stopaj: stopaj, isKiraStopaj: isKiraStopaj,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();
    alert("✅ Gider kaydedildi: ₺" + amount.toLocaleString('tr-TR') + (stopaj > 0 ? "\nStopaj (%20): ₺" + stopaj.toLocaleString('tr-TR',{minimumFractionDigits:2}) : ""));
    render();
  }

  if (action === "acc-delete") {
    const id = el.dataset.id;
    const type = el.dataset.type;
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    if (!state.accounting) return;
    if (type === "income") {
      state.accounting.incomes = (state.accounting.incomes||[]).filter(i => i.id !== id);
      // İlgili faturayı da sil
      const deletedIncome = (state.accounting.incomes||[]).find(i => i.id === id);
      if (deletedIncome && deletedIncome.invoiceNo) {
        state.accounting.invoices = (state.accounting.invoices||[]).filter(inv => inv.no !== deletedIncome.invoiceNo);
      }
    } else {
      state.accounting.expenses = (state.accounting.expenses||[]).filter(e => e.id !== id);
    }
    localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();
    render();
  }
  if (action === "admin-add-product") {
    const name = state._newProdName, price = parseFloat(state._newProdPrice);
    if (!name || !price) return;
    (async () => {
      try {
        if (window.fb && state.fbReady) await window.fb.addProduct({ name, price });
        else { state.customProducts.push({ id:"cp"+Date.now(), name, price }); persist("dincdis_custom_products", state.customProducts); }
      } catch (e) { alert("Ürün eklenemedi."); }
      state._newProdName = ""; state._newProdPrice = "";
      render();
    })();
  }
  if (action === "save-video") {
    const id = el.dataset.id;
    const val = document.getElementById(`vid-${id}`)?.value || "";
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setServiceVideo(id, val).then(() => alert("Video linki kaydedildi.")).catch(() => alert("Kaydedilemedi."));
  }
  if (action === "save-product-image") {
    const id = el.dataset.id;
    const val = document.getElementById(`img-${id}`)?.value || "";
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setProductImage(id, val).then(() => alert("Ürün görseli kaydedildi.")).catch(() => alert("Kaydedilemedi."));
  }
  if (action === "save-device-video") {
    const id = el.dataset.id;
    const val = document.getElementById(`dvid-${id}`)?.value || "";
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.setDeviceVideo(id, val).then(() => alert("Cihaz videosu kaydedildi.")).catch(() => alert("Kaydedilemedi."));
  }
  
  if (action === "save-social") {
    const id = el.dataset.id;
    const val = document.getElementById(`sm-${id}`)?.value || "";
    state.socialMedia[id] = val;
    localStorage.setItem("dincdis_social_media", JSON.stringify(state.socialMedia));
    
    if (window.fb && state.fbReady) {
      window.fb.setSocialMedia(id, val).then(() => alert("Sosyal medya linki kaydedildi (tüm cihazlarda).")).catch((err) => {
        console.error("Kaydedilemedi:", err);
        alert("Kaydedilemedi: " + err.message);
      });
    } else {
      alert("Sosyal medya linki kaydedildi (sadece bu cihazda).");
    }
  }
  if (action === "save-review-reply") {
    const id = el.dataset.id;
    const val = document.getElementById(`rvreply-${id}`)?.value || "";
    if (!window.fb || !state.fbReady) { alert("Firebase bağlantısı hazır değil."); return; }
    window.fb.replyToReview(id, val).then(() => alert("Yanıt kaydedildi.")).catch(() => alert("Kaydedilemedi."));
  }
  
  if (action === "delete-review") {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    const id = el.dataset.id;
    
    // Önce state'i güncelle
    state.reviews = state.reviews.filter(r => r.id !== id);
    localStorage.setItem("dincdis_reviews", JSON.stringify(state.reviews));
    
    if (window.fb && state.fbReady) {
      window.fb.deleteReview(id).then(() => {
        alert("Yorum silindi (tüm cihazlarda).");
        // state.reviews otomatik güncellenecek (subscribe ile)
        render();
      }).catch((err) => {
        console.error("Yorum silinemedi:", err);
        alert("Yorum silindi (sadece bu cihazda): " + err.message);
        render();
      });
    } else {
      alert("Yorum silindi (sadece bu cihazda).");
      render();
    }
  }
  
  if (action === "block-user") {
    const uid = el.dataset.uid;
    if (!uid) { alert("Kullanıcı ID bulunamadı."); return; }
    if (!confirm("Bu kullanıcıyı engellemek istediğinize emin misiniz? Engellenen kullanıcı yorum yapamaz.")) return;
    if (!state.blockedUsers.includes(uid)) {
      state.blockedUsers.push(uid);
      localStorage.setItem("dincdis_blocked_users", JSON.stringify(state.blockedUsers));
      
      if (window.fb && state.fbReady) {
        window.fb.addToBlockedUsers(uid).then(() => {
          alert("Kullanıcı engellendi (tüm cihazlarda).");
          render();
        }).catch((err) => {
          console.error("Kullanıcı engellenemedi:", err);
          alert("Engellenemedi: " + err.message);
        });
      } else {
        alert("Kullanıcı engellendi (sadece bu cihazda).");
        render();
      }
    }
  }
  
  if (action === "unblock-user") {
    const uid = el.dataset.uid;
    if (!uid) { alert("Kullanıcı ID bulunamadı."); return; }
    if (!confirm("Bu kullanıcının engelini kaldırmak istediğinize emin misiniz?")) return;
    
    // Önce state'i güncelle
    state.blockedUsers = state.blockedUsers.filter(u => u !== uid);
    localStorage.setItem("dincdis_blocked_users", JSON.stringify(state.blockedUsers));
    
    if (window.fb && state.fbReady) {
      window.fb.removeFromBlockedUsers(uid).then(() => {
        alert("Kullanıcı engeli kaldırıldı (tüm cihazlarda).");
        // state.blockedUsers otomatik güncellenecek (subscribe ile)
        render();
      }).catch((err) => {
        console.error("Engel kaldırılamadı:", err);
        alert("Kullanıcı engeli kaldırıldı (sadece bu cihazda): " + err.message);
        render();
      });
    } else {
      alert("Kullanıcı engeli kaldırıldı (sadece bu cihazda).");
      render();
    }
  }
});

/* ---------------- KAMERA + YÜZ TAKİBİ (Gülüşünü Tasarla) ----------------
   face-api.js (tinyFaceDetector + 68 nokta yüz landmark modeli) kullanılır.
   Ağız konturunu bulup üzerine seçilen "gülüş stiline" göre yarı saydam bir
   katman çizer. Model dosyaları CDN'den yüklenir; bu nedenle bu özellik
   yalnızca gerçek internet bağlantısı olan bir cihazda/host'ta çalışır.
   Bu ortamda (offline sandbox) test edilememiştir — canlıya alındıktan
   sonra bir kez kontrol edilmesi önerilir. */

let smileStream = null;
let smileRAF = null;
let faceApiReady = false;
let faceApiLoading = false;

async function ensureFaceApi() {
  if (faceApiReady) return true;
  if (faceApiLoading) return false;
  faceApiLoading = true;
  try {
    if (!window.faceapi) {
      await loadScript("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js");
    }
    const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
    await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    faceApiReady = true;
    return true;
  } catch (err) {
    console.error("face-api yüklenemedi:", err);
    return false;
  } finally {
    faceApiLoading = false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function startCamera() {
  const statusEl = document.getElementById("smile-status");
  const video = document.getElementById("smile-video");
  const canvas = document.getElementById("smile-canvas");
  if (!video || !canvas) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (statusEl) statusEl.textContent = "Bu tarayıcı kamera erişimini desteklemiyor.";
    state.smileCameraOn = false; render(); return;
  }

  if (statusEl) statusEl.textContent = "Kameraya erişim isteniyor...";
  try {
    smileStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
  } catch (err) {
    if (statusEl) statusEl.textContent = "Kameraya erişilemedi — tarayıcı ayarlarından bu site için kamera iznini kontrol et.";
    state.smileCameraOn = false; render(); return;
  }
  if (!state.smileCameraOn) { smileStream.getTracks().forEach(t=>t.stop()); return; }

  video.srcObject = smileStream;
  // ÖNEMLİ: video HİÇBİR ZAMAN görünür olmamalı — sadece canvas'a kaynak
  // olarak kullanılır. Önceki sürümde "block" yapılıyordu; .cam-wrap flex
  // kutusu olduğu için video ve canvas yan yana iki ayrı görüntü gibi dizilip
  // "ortadan ikiye bölünmüş" görüntü hatasına yol açıyordu. Kök sebep buydu.
  video.style.display = "none";
  await new Promise((resolve) => { video.onloadedmetadata = resolve; });
  await video.play();

  const vw = video.videoWidth || 480, vh = video.videoHeight || 640;
  canvas.width = vw;
  canvas.height = vh;
  const wrap = document.getElementById("smile-cam-wrap");
  if (wrap) wrap.style.aspectRatio = `${vw} / ${vh}`;
  canvas.style.transform = "scaleX(-1)"; // ön kamera aynası (doğal selfie görünümü)

  if (statusEl) statusEl.textContent = "Yüz takibi modeli yükleniyor...";
  const ok = await ensureFaceApi();
  if (!state.smileCameraOn) return;
  if (!ok && statusEl) statusEl.textContent = "Yüz takibi modeli yüklenemedi (internet bağlantısını kontrol et) — kamera görüntüsü gösteriliyor ama gülüş efekti uygulanamıyor.";
  else if (statusEl) statusEl.textContent = "";

  const ctx = canvas.getContext("2d");
  const loop = async () => {
    if (!state.smileCameraOn) return;
    try {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (ok && window.faceapi) {
        const det = await window.faceapi.detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        if (det) {
          const mouth = det.landmarks.getMouth();
          const style = SMILE_STYLES.find(s=>s.id===state.smileStyle) || SMILE_STYLES[0];
          const scale = state.smileScale || 1;
          const pts = mouth.slice(0,12);
          const cx = pts.reduce((s,p)=>s+p.x,0)/pts.length;
          const cy = pts.reduce((s,p)=>s+p.y,0)/pts.length;
          ctx.save();
          ctx.beginPath();
          pts.forEach((pt,i) => {
            const x = cx + (pt.x-cx)*scale, y = cy + (pt.y-cy)*scale;
            i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
          });
          ctx.closePath();
          ctx.fillStyle = style.tint;
          ctx.shadowColor = style.glow; ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
      }
    } catch (err) { /* kare atlanır */ }
    smileRAF = requestAnimationFrame(loop);
  };
  loop();
}

function captureSmilePhoto() {
  const canvas = document.getElementById("smile-canvas");
  if (!canvas) return;
  try {
    state.smileCapturedPhoto = canvas.toDataURL("image/jpeg", 0.92);
    state.smileCameraOn = false;
    playSound("success");
    render();
  } catch (err) { playSound("error"); alert("Fotoğraf kaydedilemedi, tekrar dene."); }
}

function stopCameraHardware() {
  // Sadece donanımı/döngüyü durdurur, state.smileCameraOn'a dokunmaz.
  // Her render() başında çağrılır (ekran yeniden çizilince video/canvas
  // elemanları da yok olduğu için akan stream'i kapatmak gerekir).
  if (smileRAF) cancelAnimationFrame(smileRAF);
  if (smileStream) { smileStream.getTracks().forEach(t=>t.stop()); smileStream = null; }
}

/* ---------------- FIREBASE BAĞLANTISI ---------------- */
/* firebase-init.js (bir ES module) yüklenip window.fb hazır olunca
   "fb-ready" olayını fırlatır. O ana kadar app.js zaten localStorage
   yedeğiyle çalışabilir durumda olur. */

let unsubReviews = null, unsubProducts = null, unsubAppointments = null, unsubOrders = null;

/* ============ BİLDİRİM SİSTEMİ ============ */
let _notifFirstLoad = { reviews: true, appointments: true, orders: true };

function requestNotifPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function showNotif(title, body) {
  // Sayfa bildirim (her zaman çalışır)
  _showInAppNotif(title, body);
  // Browser bildirimi (izin gerekli)
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification(title, { body, icon: "/icon-192.png" }); } catch(e) {}
  }
}

function _showInAppNotif(title, body) {
  const el = document.createElement("div");
  el.className = "in-app-notif";
  el.innerHTML = `<b>${escapeHtml(title)}</b><br><span>${escapeHtml(body)}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 50);
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 400); }, 5000);
}

/* ============ HATIRLATMA PLANLAMA ============ */
let _brushReminderInterval = null;
let _checkupTimeout = null;

function scheduleBrushReminder(time) {
  if (_brushReminderInterval) clearInterval(_brushReminderInterval);
  if (!state.userProfile?.notificationsEnabled) return;
  
  const [hours, minutes] = time.split(":").map(Number);
  
  _brushReminderInterval = setInterval(() => {
    const now = new Date();
    if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() < 2) {
      if (state.lastBrushDate !== now.toDateString()) {
        showNotif("🪥 Diş Fırçalama Zamanı!", "Dişlerini fırçalamayı unutma! 🔥 Serini koru!");
      }
    }
  }, 1000);
}

function scheduleCheckupReminder() {
  if (_checkupTimeout) clearTimeout(_checkupTimeout);
  if (!state.userProfile?.notificationsEnabled || !state.userProfile?.lastCheckup) return;
  
  const lastCheckup = new Date(state.userProfile.lastCheckup);
  const nextCheckup = new Date(lastCheckup.getTime() + 180*24*60*60*1000);
  const msUntilReminder = nextCheckup.getTime() - Date.now();
  
  // Eğer hatırlatma zamanı geçmişse hemen bildir
  if (msUntilReminder <= 0) {
    showNotif("🏥 Diş Kontrolü Zamanı!", "6 aylık diş kontrolünüz geldi. Randevu almayı unutmayın!");
    return;
  }
  
  // Makul bir zaman aşımı (max 24 saat = 86400000ms)
  if (msUntilReminder <= 86400000) {
    _checkupTimeout = setTimeout(() => {
      showNotif("🏥 Diş Kontrolü Zamanı!", "6 aylık diş kontrolünüz geldi. Randevu almayı unutmayın!");
    }, msUntilReminder);
  }
}

function loadUserProfile() {
  try {
    const saved = localStorage.getItem("dincdis_user_profile");
    if (saved) state.userProfile = JSON.parse(saved);
  } catch(e) {}
  try {
    state.brushStreak = parseInt(localStorage.getItem("dincdis_brush_streak") || "0");
    state.lastBrushDate = localStorage.getItem("dincdis_last_brush") || null;
  } catch(e) {}
  try {
    state.familyMembers = JSON.parse(localStorage.getItem("dincdis_family_members") || "[]");
  } catch(e) { state.familyMembers = []; }
  try {
    state.badges = JSON.parse(localStorage.getItem("dincdis_badges") || "[]");
  } catch(e) { state.badges = []; }
  
  // Streak kontrolü - eğer son fırçalama dün değilse ve bugün de değilse seri kırılmış
  if (state.lastBrushDate) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastBrushDate !== today && state.lastBrushDate !== yesterday) {
      state.brushStreak = 0;
      localStorage.setItem("dincdis_brush_streak", "0");
    }
  }
  
  // Günlük ipucu seç
  pickDailyTip();

  // Hatırlatmaları planla
  if (state.userProfile?.brushReminderTime) {
    scheduleBrushReminder(state.userProfile.brushReminderTime);
  }
  if (state.userProfile?.lastCheckup) {
    scheduleCheckupReminder();
  }
}

function pickDailyTip() {
  // Firebase'den gelen ipuçları varsa onları kullan, yoksa varsayılanları
  const tips = (state.healthTips && state.healthTips.length > 0) 
    ? state.healthTips.map(t => t.text || t)
    : DEFAULT_HEALTH_TIPS;
  // Bugünün tarihine göre deterministik seçim (her gün aynı ipucu)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  state.dailyTip = tips[dayOfYear % tips.length] || "";
}

/* ============ ROZET SİSTEMİ ============ */
function checkBadges() {
  if (!state.badges) state.badges = [];
  let newBadge = null;

  const addBadge = (id) => {
    if (!state.badges.includes(id)) {
      state.badges.push(id);
      const def = BADGE_DEFS.find(b => b.id === id);
      if (def) {
        newBadge = def;
        showNotif("🏆 Yeni Rozet!", `${def.icon} ${def.name} — ${def.desc}`);
      }
    }
  };

  // Yorum rozeti
  if (state.reviews.some(r => r.uid === state.user?.uid)) addBadge("first_review");

  // Randevu rozeti
  if (state.appointments.some(a => a.uid === state.user?.uid)) addBadge("first_appointment");

  // Streak rozetleri
  if (state.brushStreak >= 7) addBadge("7_day_streak");
  if (state.brushStreak >= 14) addBadge("14_day_streak");
  if (state.brushStreak >= 30) addBadge("30_day_streak");
  if (state.brushStreak >= 60) addBadge("60_day_streak");
  if (state.brushStreak >= 100) addBadge("100_day_streak");
  if (state.brushStreak >= 365) addBadge("365_day_streak");

  // Aile rozeti
  if ((state.familyMembers || []).length > 0) addBadge("family_member");

  // Tam profil rozeti
  const p = state.userProfile || {};
  if (p.firstName && p.lastName && p.age && p.weight && p.height) addBadge("profile_complete");

  // Kaydet
  localStorage.setItem("dincdis_badges", JSON.stringify(state.badges));
  if (window.fb && state.fbReady && state.user) {
    window.fb.saveUserProfile(state.user.uid, { ...state.userProfile, badges: state.badges, familyMembers: state.familyMembers }).catch(() => {});
  }
}

// Firebase'e accounting verilerini kaydet
function saveAccountingToFirebase() {
  if (window.fb && window.fb.saveAccountingData) {
    window.fb.saveAccountingData({
      accounting: state.accounting,
      treatmentPrices: state.treatmentPrices,
      autoExpenses: state.autoExpenses,
      treatments: state.treatments || []
    }).catch(() => {});
  }
}

function wireFirebase() {
  if (!window.fb || !window.fb.ready) return;
  state.fbReady = true;

  window.fb.onAuthChange((user) => {
    state.user = user;
    if (user) {
      // Kullanıcı giriş yaptı - profilini yükle
      window.fb.loadUserProfile(user.uid).then(profile => {
        if (profile) {
          state.userProfile = profile;
          localStorage.setItem("dincdis_user_profile", JSON.stringify(profile));
          if (profile.brushReminderTime) scheduleBrushReminder(profile.brushReminderTime);
          if (profile.lastCheckup) scheduleCheckupReminder();
        }
        render();
      }).catch(() => {});
      window.fb.loadBrushStreak(user.uid).then(data => {
        if (data) {
          state.brushStreak = data.streak || 0;
          state.lastBrushDate = data.lastDate || null;
          localStorage.setItem("dincdis_brush_streak", state.brushStreak);
          localStorage.setItem("dincdis_last_brush", state.lastBrushDate || "");
        }
        render();
      }).catch(() => {});
    } else {
      state.userProfile = null;
    }
    render();
  });

  // Herkese açık, gerçek zamanlı veriler:
  unsubReviews = window.fb.subscribeReviews((items) => {
    // Bildirim: yeni yorum geldi mi kontrol et
    if (!_notifFirstLoad.reviews && items.length > state.reviews.length) {
      const yeni = items.find(i => !state.reviews.some(r => r.id === i.id));
      if (yeni) showNotif("⭐ Yeni Yorum!", `${yeni.name}: "${(yeni.text||"").substring(0,60)}..."`);
    }
    _notifFirstLoad.reviews = false;
    state.reviews = items; render();
  });
  
  // Engellenen kullanıcıları Firebase'den yükle
  if (window.fb.subscribeBlockedUsers) {
    window.fb.subscribeBlockedUsers((blocked) => {
      state.blockedUsers = blocked;
      localStorage.setItem("dincdis_blocked_users", JSON.stringify(blocked));
      render();
    });
  }
  
  // Sosyal medya linklerini Firebase'den yükle
  if (window.fb.subscribeSocialMedia) {
    window.fb.subscribeSocialMedia((social) => {
      state.socialMedia = social;
      localStorage.setItem("dincdis_social_media", JSON.stringify(social));
      render();
    });
  }
  unsubProducts = window.fb.subscribeProducts((items) => { state.customProducts = items; render(); });
  window.fb.subscribeServiceVideos((map) => { state.serviceVideos = map; render(); });
  window.fb.subscribeDeviceVideos((map) => { state.deviceVideos = map; render(); });
  window.fb.subscribeProductImages((map) => { state.productImages = map; render(); });

  // Bildirim izni iste
  requestNotifPermission();

  // Kullanıcı profilini Firebase'den yükle
  if (state.user) {
    window.fb.loadUserProfile(state.user.uid).then(profile => {
      if (profile) {
        state.userProfile = profile;
        localStorage.setItem("dincdis_user_profile", JSON.stringify(profile));
        // Hatırlatmaları yeniden planla
        if (profile.brushReminderTime) scheduleBrushReminder(profile.brushReminderTime);
        if (profile.lastCheckup) scheduleCheckupReminder();
        render();
      }
    }).catch(() => {});
    window.fb.loadBrushStreak(state.user.uid).then(data => {
      if (data) {
        state.brushStreak = data.streak || 0;
        state.lastBrushDate = data.lastDate || null;
        localStorage.setItem("dincdis_brush_streak", state.brushStreak);
        localStorage.setItem("dincdis_last_brush", state.lastBrushDate || "");
        render();
      }
    }).catch(() => {});
  }

  // Brushing video URL'sini yükle (herkes için)
  window.fb.subscribeBrushingVideo((url) => {
    state.brushingVideoUrl = url || "";
    render();
  });

  // Klinik görsellerini yükle (doktor foto, logo, splash)
  if (window.fb.subscribeClinicSetting) {
    window.fb.subscribeClinicSetting("doctor_photo", (url) => {
      state.doctorPhotoUrl = url || "";
      render();
    });
    window.fb.subscribeClinicSetting("clinic_logo", (url) => {
      state.clinicLogoUrl = url || "";
      render();
    });
    window.fb.subscribeClinicSetting("splash_image", (url) => {
      state.splashImageUrl = url || "";
      render();
    });
  }

  // Sağlık ipuçlarını yükle
  window.fb.subscribeHealthTips((tips) => {
    state.healthTips = tips;
    pickDailyTip();
    render();
  });

  // Duyuruları yükle
  if (window.fb.subscribeAnnouncements) {
    window.fb.subscribeAnnouncements((announcements) => {
      const prevCount = (state.announcements || []).length;
      state.announcements = announcements;
      // Yeni duyuru geldiğinde bildirim göster
      if (announcements.length > prevCount && prevCount > 0) {
        const newest = announcements[0];
        if (newest) {
          showNotif("📢 Yeni Duyuru!", newest.title || "Yeni bir duyuru yayınlandı");
        }
      }
      render();
    });
  }

  // Kullanıcı tedavilerini yükle (admin ekler)
  if (window.fb.subscribeTreatments) {
    window.fb.subscribeTreatments((treatments) => {
      state.treatments = treatments;
      render();
    });
  }

  render();
}

function startAdminSubscriptions() {
  if (!window.fb || !state.fbReady) return;
  unsubAppointments = window.fb.subscribeAppointments((items) => {
    // Bildirim: yeni randevu
    if (!_notifFirstLoad.appointments && items.length > state.appointments.length) {
      const yeni = items.find(i => !state.appointments.some(r => r.id === i.id));
      if (yeni) showNotif("📅 Yeni Randevu!", `${yeni.name} — ${yeni.date||""} ${yeni.time||""}`);
    }
    _notifFirstLoad.appointments = false;
    state.appointments = items; render();
  });
  unsubOrders = window.fb.subscribeOrders((items) => {
    // Bildirim: yeni sipariş
    if (!_notifFirstLoad.orders && items.length > state.orders.length) {
      const yeni = items.find(i => !state.orders.some(r => r.id === i.id));
      if (yeni) showNotif("📦 Yeni Sipariş!", `${yeni.name} — ${yeni.total||0} ₺`);
    }
    _notifFirstLoad.orders = false;
    state.orders = items; render();
  });

  // Firebase'den accounting verilerini yükle
  if (window.fb.loadAccountingData) {
    window.fb.loadAccountingData().then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.accounting) state.accounting = data.accounting;
        if (data.treatmentPrices) state.treatmentPrices = data.treatmentPrices;
        if (data.autoExpenses) state.autoExpenses = data.autoExpenses;
        if (data.treatments) state.treatments = data.treatments;
        localStorage.setItem("dincdis_accounting", JSON.stringify(state.accounting)); saveAccountingToFirebase();
        localStorage.setItem("dincdis_treatment_prices", JSON.stringify(state.treatmentPrices)); saveAccountingToFirebase();
        localStorage.setItem("dincdis_auto_expenses", JSON.stringify(state.autoExpenses)); saveAccountingToFirebase();
        if (data.treatments) localStorage.setItem("dincdis_treatments_local", JSON.stringify(data.treatments));
        render();
      }
    }).catch(() => {});
  }
}

function stopAdminSubscriptions() {
  if (unsubAppointments) { unsubAppointments(); unsubAppointments = null; }
  if (unsubOrders) { unsubOrders(); unsubOrders = null; }
  state.appointments = []; state.orders = [];
}

window.addEventListener("fb-ready", wireFirebase);
// firebase-init.js modülü app.js'ten önce yüklenip olayı kaçırmış olabilir ihtimaline karşı:
if (window.fb && window.fb.ready) wireFirebase();

/* ---------------- SES EFEKTLERİ ----------------
   Dışarıdan ses dosyası yüklemeden, Web Audio API ile anlık
   üretilen kısa efektler. İlk çalma bir kullanıcı etkileşimi
   (tıklama) içinden tetiklenmeli — tarayıcı kuralı budur, tüm
   playSound() çağrılarımız zaten click handler'ları içinde. */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(ctx, freq, start, dur, type="sine", peakGain=0.09) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.02);
}

function playSound(kind) {
  if (state.settings && state.settings.muted) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    if (kind === "click") {
      tone(ctx, 720, 0, 0.05, "sine", 0.05);
    } else if (kind === "success") {
      // "healing" tarzı yükselen üçlü — oyunlardaki can yenileme sesi gibi
      tone(ctx, 523.25, 0.00, 0.16, "sine", 0.08);   // Do
      tone(ctx, 659.25, 0.08, 0.16, "sine", 0.08);   // Mi
      tone(ctx, 783.99, 0.16, 0.28, "sine", 0.09);   // Sol
    } else if (kind === "error") {
      tone(ctx, 300, 0.00, 0.16, "sawtooth", 0.05);
      tone(ctx, 220, 0.10, 0.22, "sawtooth", 0.05);
    } else if (kind === "login") {
      tone(ctx, 440.00, 0.00, 0.14, "sine", 0.07);
      tone(ctx, 554.37, 0.07, 0.14, "sine", 0.07);
      tone(ctx, 659.25, 0.14, 0.30, "sine", 0.08);
    }
  } catch (e) { /* ses çalınamazsa sessizce geç */ }
}


const validScreens = Object.keys(SCREEN_MAP);
const hash = window.location.hash.replace("#","");
if (validScreens.includes(hash)) state.screen = hash;
history.replaceState({ screen: state.screen }, "", "#" + state.screen);
render();

/* Android/tarayıcı GERİ tuşu: uygulamadan çıkmak yerine önceki ekrana dönsün.
   Zaten "home" ekranındaysak ve geri basılırsa, tarayıcının/uygulamanın
   normal davranışına (gerçekten çıkış) izin veriyoruz. */
window.addEventListener("popstate", (event) => {
  const target = (event.state && event.state.screen) || "home";
  if (target === state.screen) return;
  state.screen = target;
  state.moreOpen = false;
  render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(()=>{}); });
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "NURDIS_UPDATED") {
      state.updateAvailable = true;
      render();
    }
  });
}

/* Dişini Tasarla - yeni kod entegrasyonu bekleniyor */




/* ============ GÜLÜŞ STİLİNİ TASARLA - Apiframe GPT Image 2 ============ */
let _gsPhotoBase64 = null;
let _gsSelectedStyle = 'hollywood';

const SMILE_PROMPTS = {
  hollywood: 'Give a Hollywood smile: slightly prominent upper front teeth, golden ratio, perfect symmetry, bright white celebrity-like dazzling teeth.',
  inci: 'Give a pearl-like smile: teeth smaller, rounded, evenly aligned like pearls with warm natural white shade.',
  iri: 'Give larger, fuller teeth creating a powerful attractive bold smile.',
  kopek: 'Slightly elongate and sharpen the canine teeth for a characterful prominent look.',
  lamine: 'Apply thin porcelain veneer shells bonded to the front of teeth for a refined elegant smile.',
  kompozit: 'Apply composite veneers for aesthetic corrections with minimal preparation, natural looking.',
  metal: 'Apply metal-backed porcelain crowns with slightly reduced light translucency.',
  implant: 'Fill missing tooth gaps with natural-looking dental implant ceramic crowns.',
  dislek: 'Make the two upper front teeth slightly protrude outward and appear longer, rabbit-like.',
  ortodonti: 'Add realistic orthodontic braces (dental braces / diş teli) to both upper and lower teeth. Each tooth should have a small square metal bracket bonded to its front surface. A thin horizontal metal archwire should connect all brackets on the upper arch and another on the lower arch. Keep the natural tooth color and shape — only add the metal brackets and archwire on top. Make it look like a real orthodontic treatment in progress.'
};




/* ============ 🎮 KÜÇÜK DİŞ DOKTORU OYUNU v2 - 3D Görsel ============ */
const GAME_PATIENTS = [
  { id:1, emoji:"🐻", name:"Ayıcık", color:"#8B4513", complaint:"Çok tatlı yedim, dişim sızlıyor...", problem:"cavity", problemLabel:"Çürük", treatment:"Dolgu", tool:"drill", toolEmoji:"🔧" },
  { id:2, emoji:"🐰", name:"Tavşancık", color:"#FFB6C1", complaint:"Havuç kemirirken dişim kırıldı!", problem:"broken", problemLabel:"Kırık Diş", treatment:"Kaplama", tool:"crown", toolEmoji:"👑" },
  { id:3, emoji:"🐱", name:"Kedicik", color:"#FFA500", complaint:"Dişlerim sarardı, beyazlatmak istiyorum!", problem:"yellow", problemLabel:"Sararma", treatment:"Beyazlatma", tool:"whitening", toolEmoji:"💡" },
  { id:4, emoji:"🐶", name:"Köpecik", color:"#D2691E", complaint:"Diş etim şişti, çok ağrıyor!", problem:"abscess", problemLabel:"Apse", treatment:"Kanal Tedavisi", tool:"rootcanal", toolEmoji:"💉" },
  { id:5, emoji:"🦊", name:"Tilkicik", color:"#FF4500", complaint:"Dişlerimde taşlar birikti!", problem:"tartar", problemLabel:"Diş Taşı", treatment:"Temizlik", tool:"scaler", toolEmoji:"🪥" },
];

const GAME_TOOLS_ALL = [
  { id:"drill", emoji:"🔧", name:"Matkap + Dolgu" },
  { id:"crown", emoji:"👑", name:"Kaplama" },
  { id:"whitening", emoji:"💡", name:"LED + Jel" },
  { id:"rootcanal", emoji:"💉", name:"Kanal Aleti" },
  { id:"scaler", emoji:"🪥", name:"Skaler" },
  { id:"brush", emoji:"🪥", name:"Diş Fırçası" },
  { id:"pliers", emoji:"🔨", name:"Pense" },
  { id:"mirror", emoji:"🪞", name:"Ayna" },
];

let gameState = { screen:"waiting", patientIndex:0, score:0, stars:0, treatClicks:0, treatTarget:12, message:"", badToothIndex:3, shaking:false, sparkle:false, pulling:false, pullProgress:0 };

function resetGame() {
  gameState = { screen:"waiting", patientIndex:0, score:0, stars:0, treatClicks:0, treatTarget:12, message:"", badToothIndex: Math.floor(Math.random()*8), shaking:false, sparkle:false, pulling:false, pullProgress:0 };
}

/* Diş SVG çizimi */
function toothSVG(color, isProblem, problemType, index, isPulling, pullProgress) {
  const baseColor = isProblem ? getProblemColor(problemType) : color || "#FFFEF5";
  const gumColor = isProblem && problemType === "abscess" ? "#FF6B6B" : "#FFB5B5";
  const rootColor = "#F5E6D3";
  const shakeAnim = isProblem ? `animation:toothShake 0.5s ease-in-out infinite;` : '';
  const pullTransform = isPulling ? `transform:translateY(-${pullProgress}px) rotate(${pullProgress * 2}deg);` : '';
  const sparkle = isProblem ? `<circle cx="25" cy="18" r="3" fill="${getSparkleColor(problemType)}" opacity="0.7"><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/></circle>` : '';
  
  return `<svg viewBox="0 0 50 70" style="width:100%;height:100%;${shakeAnim}${pullTransform}filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
    <!-- Diş eti -->
    <ellipse cx="25" cy="22" rx="18" ry="8" fill="${gumColor}"/>
    <!-- Diş gövdesi (mine) -->
    <rect x="10" y="14" width="30" height="28" rx="6" fill="${baseColor}" stroke="#E8E0D0" stroke-width="0.5"/>
    <!-- Diş kökleri -->
    <path d="M15 42 L13 58 Q14 62 16 60 L18 44" fill="${rootColor}"/>
    <path d="M32 42 L34 58 Q33 62 31 60 L29 44" fill="${rootColor}"/>
    <!-- Mine parlaklığı -->
    <rect x="14" y="16" width="8" height="12" rx="3" fill="rgba(255,255,255,0.3)"/>
    ${sparkle}
    ${isProblem && problemType === 'cavity' ? '<circle cx="30" cy="28" r="5" fill="#3D2B1F" opacity="0.8"/><circle cx="30" cy="28" r="3" fill="#1A0F0A"/>' : ''}
    ${isProblem && problemType === 'broken' ? '<path d="M20 14 L28 22 L22 30" stroke="#CCC" stroke-width="2" fill="none"/><rect x="28" y="14" width="12" height="14" rx="2" fill="none" stroke="#CCC" stroke-dasharray="2,2"/>' : ''}
    ${isProblem && problemType === 'tartar' ? '<rect x="8" y="36" width="34" height="6" rx="2" fill="#A0A050" opacity="0.7"/><rect x="10" y="34" width="30" height="4" rx="1" fill="#808040" opacity="0.5"/>' : ''}
  </svg>`;
}

function getProblemColor(type) {
  switch(type) {
    case "cavity": return "#FFF8E1";
    case "broken": return "#FFE0E0";
    case "yellow": return "#FFD54F";
    case "abscess": return "#FFCDD2";
    case "tartar": return "#E8E0C0";
    default: return "#FFFEF5";
  }
}

function getSparkleColor(type) {
  switch(type) {
    case "cavity": return "#FF5722";
    case "broken": return "#F44336";
    case "yellow": return "#FF9800";
    case "abscess": return "#E91E63";
    case "tartar": return "#8BC34A";
    default: return "#FFF";
  }
}

/* Ağız görünümü - 8 diş */
function renderMouth(patient, badIndex, examMode, treatMode, treatProgress) {
  let teeth = '';
  for (let i = 0; i < 8; i++) {
    const isBad = i === badIndex;
    const isPulling = treatMode && isBad;
    const pp = isPulling ? Math.min(treatProgress * 3, 20) : 0;
    const toothColor = "#FFFEF5";
    
    teeth += `<div data-action="${examMode ? 'game-tooth' : ''}" data-bad="${isBad}" style="
      width:calc(12.5% - 4px); min-width:40px; aspect-ratio:5/7;
      cursor:${examMode ? 'pointer' : 'default'};
      transition: transform 0.2s, box-shadow 0.2s;
      position:relative;
      ${examMode && isBad ? 'z-index:2;' : ''}
    ">
      ${toothSVG(toothColor, isBad, patient.problem, i, isPulling, pp)}
    </div>`;
  }
  
  return `<div style="
    background: linear-gradient(180deg, #FF9E9E 0%, #FFB5B5 30%, #FF8080 100%);
    border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
    padding: 20px 12px 30px;
    position: relative;
    box-shadow: inset 0 -10px 20px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.1);
    perspective: 500px;
    transform: rotateX(5deg);
  ">
    <!-- Üst dudak -->
    <div style="position:absolute;top:-8px;left:10%;right:10%;height:16px;background:linear-gradient(180deg,#FF6B6B,#FF8080);border-radius:50% 50% 0 0;"></div>
    <!-- Dişler -->
    <div style="display:flex;justify-content:center;gap:3px;align-items:flex-end;padding-top:8px;">
      ${teeth}
    </div>
    <!-- Alt dudak -->
    <div style="position:absolute;bottom:-5px;left:15%;right:15%;height:12px;background:linear-gradient(0deg,#FF6B6B,#FF8080);border-radius:0 0 50% 50%;"></div>
  </div>`;
}

/* Parçacık efekti */
function sparkleEffect() {
  let sparkles = '';
  for (let i = 0; i < 8; i++) {
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    const delay = Math.random() * 0.5;
    sparkles += `<div style="position:absolute;left:${x}%;top:${y}%;width:8px;height:8px;background:gold;border-radius:50%;animation:sparkleFloat 0.8s ease-out ${delay}s both;">✨</div>`;
  }
  return sparkles;
}

function renderDentistGame() {
  const gs = gameState;
  const patient = GAME_PATIENTS[gs.patientIndex] || GAME_PATIENTS[0];

  const scoreBar = `<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:linear-gradient(135deg,#1A237E,#283593);border-radius:20px;margin-bottom:16px;color:white;box-shadow:0 4px 15px rgba(26,35,126,0.3);">
    <div style="text-align:center;"><div style="font-size:22px;">⭐</div><div style="font-size:12px;font-weight:700;">${gs.score}</div></div>
    <div style="text-align:center;"><div style="font-size:14px;font-weight:600;">Hasta ${gs.patientIndex + 1}/${GAME_PATIENTS.length}</div><div style="font-size:11px;opacity:0.8;">Küçük Diş Doktoru</div></div>
    <div style="text-align:center;"><div style="font-size:22px;">${"⭐".repeat(gs.stars)}</div><div style="font-size:11px;opacity:0.8;">${gs.stars}/${GAME_PATIENTS.length}</div></div>
  </div>`;

  // CSS animasyonları
  const animCSS = `<style>
    @keyframes toothShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
    @keyframes sparkleFloat { 0%{opacity:1;transform:scale(1) translateY(0)} 100%{opacity:0;transform:scale(0) translateY(-30px)} }
    @keyframes toolSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
    @keyframes slideIn { 0%{opacity:0;transform:translateX(100px)} 100%{opacity:1;transform:translateX(0)} }
    @keyframes fadeInUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes drillShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg)} 75%{transform:rotate(5deg)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 10px rgba(255,215,0,0.3)} 50%{box-shadow:0 0 30px rgba(255,215,0,0.8)} }
  </style>`;

  // BEKLEME
  if (gs.screen === "waiting") {
    return `${topbar("🎮 Küçük Diş Doktoru","Hastalarını tedavi et!", {back:"home"})}${animCSS}
      <div class="content">
        <div class="card p5" style="text-align:center;background:linear-gradient(135deg,#E3F2FD,#BBDEFB);border:2px solid #90CAF9;">
          <img src="game-logo.png" style="width:140px;height:140px;border-radius:24px;margin-bottom:12px;box-shadow:0 8px 24px rgba(0,0,0,0.15);animation:bounce 2s ease-in-out infinite;" />
          <p class="name" style="font-size:24px;margin:12px 0 8px;color:#1A237E;">Küçük Diş Doktoru</p>
          <p style="font-size:14px;color:#455A64;margin-bottom:24px;">Merhaba Doktor! Bugün 5 sevimli hasta seni bekliyor.<br>Her birinin dişini muayene et, doğru tedaviyi seç ve uygula!</p>
          <div style="display:flex;justify-content:center;gap:8px;margin-bottom:24px;font-size:40px;">
            ${GAME_PATIENTS.map(p => `<span style="animation:slideIn 0.5s ease-out both;animation-delay:${p.id*0.1}s;">${p.emoji}</span>`).join('')}
          </div>
          <button class="btn-primary" style="font-size:18px;padding:18px;background:linear-gradient(135deg,#1A237E,#283593);border-radius:16px;box-shadow:0 4px 15px rgba(26,35,126,0.3);" data-action="game-start">🩺 Kliniği Aç!</button>
        </div>
      </div>`;
  }

  // OYUN BİTTİ
  if (gs.screen === "done") {
    return `${topbar("🏆 Oyun Bitti!","Tebrikler Doktor!", {back:"home"})}${animCSS}
      <div class="content">
        <div class="card p5" style="text-align:center;background:linear-gradient(135deg,#FFF8E1,#FFECB3);border:2px solid #FFD54F;">
          <div style="font-size:80px;animation:pulse 1.5s ease-in-out infinite;">🏆</div>
          <p class="name" style="font-size:24px;color:#E65100;margin:12px 0;">Tebrikler Doktor!</p>
          <div style="font-size:36px;margin:16px 0;">${"⭐".repeat(gs.stars)}${"☆".repeat(GAME_PATIENTS.length - gs.stars)}</div>
          <p style="font-size:28px;font-weight:800;color:#1A237E;">${gs.score} Puan</p>
          <p style="font-size:15px;color:#455A64;margin:16px 0;">${gs.stars >= 4 ? "🎉 Sen harika bir diş doktorusun!" : gs.stars >= 2 ? "👏 Güzel iş! Biraz daha pratik!" : "💪 Tekrar dene, daha iyi olacaksın!"}</p>
          <button class="btn-primary" style="font-size:18px;padding:18px;background:linear-gradient(135deg,#E65100,#FF8F00);border-radius:16px;" data-action="game-restart">🔄 Tekrar Oyna</button>
        </div>
      </div>`;
  }

  // MUAYENE
  if (gs.screen === "exam") {
    return `${topbar("🎮 Muayene","Sorunlu dişi bul!", {back:"home"})}${animCSS}
      <div class="content">
        ${scoreBar}
        <div class="card p4" style="text-align:center;animation:fadeInUp 0.5s ease-out;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="font-size:56px;animation:bounce 2s ease-in-out infinite;">${patient.emoji}</div>
            <div style="text-align:left;flex:1;">
              <p class="name" style="font-size:18px;color:#1A237E;">${patient.name}</p>
              <div style="background:#FFF3CD;border-radius:10px;padding:10px;margin-top:6px;border-left:4px solid #FFB300;">
                <p style="font-size:13px;margin:0;color:#795548;">💬 "${patient.complaint}"</p>
              </div>
            </div>
          </div>
          <p style="font-size:13px;color:#666;margin-bottom:12px;">🔍 Ayna ile ağzına bak — sorunlu dişi bul ve tıkla!</p>
          ${renderMouth(patient, gs.badToothIndex, true, false, 0)}
          ${gs.message ? `<div style="margin-top:12px;padding:10px;border-radius:10px;background:#FFEBEE;"><p style="margin:0;font-size:13px;color:#C62828;">${gs.message}</p></div>` : ''}
        </div>
      </div>`;
  }

  // TEŞHİS
  if (gs.screen === "diagnose") {
    const shuffled = [...GAME_PATIENTS].sort(() => Math.random() - 0.5);
    return `${topbar("🩺 Teşhis Koy","Bu hastanın sorunu ne?", {back:"home"})}${animCSS}
      <div class="content">
        ${scoreBar}
        <div class="card p4" style="text-align:center;animation:fadeInUp 0.5s ease-out;">
          <div style="font-size:56px;margin-bottom:8px;">${patient.emoji}</div>
          <p class="name" style="font-size:18px;color:#1A237E;">${patient.name}'in sorunu ne?</p>
          <div style="margin:12px 0;">
            ${renderMouth(patient, gs.badToothIndex, false, false, 0)}
          </div>
          ${gs.message ? `<div style="padding:10px;border-radius:10px;background:${gs.message.includes("Doğru") ? '#E8F5E9' : '#FFEBEE'};margin-bottom:12px;"><p style="margin:0;font-size:13px;color:${gs.message.includes("Doğru") ? '#2E7D32' : '#C62828'};">${gs.message}</p></div>` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${shuffled.map(p => `<button data-action="game-diagnose" data-problem="${p.problem}" style="
              padding:14px 8px;border-radius:14px;border:2px solid #E0E0E0;background:white;cursor:pointer;
              font-size:13px;font-weight:600;color:#333;transition:all 0.2s;
              display:flex;flex-direction:column;align-items:center;gap:4px;
            ">${p.emoji}<br>${p.problemLabel}</button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // ALET SEÇİMİ
  if (gs.screen === "tools") {
    const shuffled = [...GAME_TOOLS_ALL].sort(() => Math.random() - 0.5);
    return `${topbar("🔧 Alet Seç","Doğru tedavi aletini seç!", {back:"home"})}${animCSS}
      <div class="content">
        ${scoreBar}
        <div class="card p4" style="text-align:center;animation:fadeInUp 0.5s ease-out;">
          <div style="font-size:48px;">${patient.emoji}</div>
          <p class="name" style="font-size:16px;color:#1A237E;">Teşhis: <span style="color:#E65100;">${patient.problemLabel}</span></p>
          <p style="font-size:13px;color:#666;margin-bottom:4px;">Tedavi: <b>${patient.treatment}</b></p>
          <p style="font-size:12px;color:#999;margin-bottom:12px;">Doğru aleti seç!</p>
          ${gs.message ? `<div style="padding:10px;border-radius:10px;background:#FFEBEE;margin-bottom:12px;"><p style="margin:0;font-size:13px;color:#C62828;">${gs.message}</p></div>` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${shuffled.map(t => `<button data-action="game-tool" data-tool="${t.id}" style="
              padding:14px;border-radius:14px;border:2px solid #E0E0E0;background:white;cursor:pointer;
              transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:6px;
            "><span style="font-size:30px;">${t.emoji}</span><span style="font-size:12px;font-weight:600;color:#333;">${t.name}</span></button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // TEDAVİ
  if (gs.screen === "treating") {
    const progress = Math.min(100, Math.round((gs.treatClicks / gs.treatTarget) * 100));
    const tool = GAME_TOOLS_ALL.find(t => t.id === patient.tool) || GAME_TOOLS_ALL[0];
    const isNearDone = progress > 70;
    
    return `${topbar("💊 Tedavi","Dişi tedavi et!", {back:"home"})}${animCSS}
      <div class="content">
        ${scoreBar}
        <div class="card p4" style="text-align:center;animation:fadeInUp 0.5s ease-out;">
          <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;">
            <div style="font-size:48px;">${patient.emoji}</div>
            <div style="font-size:36px;${gs.treatClicks > 0 ? 'animation:drillShake 0.15s ease-in-out infinite;' : ''}">${tool.emoji}</div>
          </div>
          <p class="name" style="font-size:16px;color:#1A237E;">${patient.treatment} yapılıyor...</p>
          <div style="margin:16px 0;position:relative;">
            ${renderMouth(patient, gs.badToothIndex, false, true, gs.treatClicks)}
            ${gs.treatClicks > 0 ? `<div style="position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;">${sparkleEffect()}</div>` : ''}
          </div>
          <!-- Progress bar -->
          <div style="width:100%;height:24px;background:#E0E0E0;border-radius:12px;overflow:hidden;margin:12px 0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);">
            <div style="width:${progress}%;height:100%;background:linear-gradient(90deg,${isNearDone ? '#4CAF50,#66BB6A' : '#1A237E,#283593'});border-radius:12px;transition:width 0.15s;display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:12px;font-weight:700;">${progress}%</span>
            </div>
          </div>
          <button data-action="game-treat" style="
            width:100%;padding:20px;border-radius:16px;border:3px solid ${isNearDone ? '#4CAF50' : '#FFB300'};
            background:linear-gradient(135deg,${isNearDone ? '#E8F5E9,#C8E6C9' : '#FFF8E1,#FFECB3'});
            cursor:pointer;font-size:18px;font-weight:700;color:#333;
            animation:${gs.treatClicks > 0 ? 'pulse 0.3s' : 'glowPulse 2s infinite'};
            box-shadow:0 4px 15px rgba(0,0,0,0.1);transition:all 0.1s;
          ">${tool.emoji} TIKLA! (${gs.treatTarget - gs.treatClicks} kaldı)</button>
        </div>
      </div>`;
  }

  // SONUÇ
  if (gs.screen === "result") {
    return `${topbar("🎉 Tedavi Tamam!","${patient.name} çok mutlu!", {back:"home"})}${animCSS}
      <div class="content">
        ${scoreBar}
        <div class="card p5" style="text-align:center;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border:2px solid #66BB6A;animation:fadeInUp 0.5s ease-out;">
          <div style="font-size:80px;animation:bounce 1s ease-in-out infinite;">${patient.emoji}</div>
          <div style="font-size:40px;margin:8px 0;">😊✨</div>
          <p class="name" style="font-size:22px;color:#2E7D32;">${patient.name} çok mutlu!</p>
          <div style="background:white;border-radius:12px;padding:12px;margin:16px 0;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <p style="font-size:14px;color:#455A64;margin:0;">💬 "Teşekkürler Doktor! Artık dişim ağrımıyor!"</p>
          </div>
          <div style="display:flex;justify-content:center;gap:20px;margin:16px 0;">
            <div style="text-align:center;"><div style="font-size:28px;">⭐</div><div style="font-size:13px;font-weight:600;color:#E65100;">+1 Yıldız</div></div>
            <div style="text-align:center;"><div style="font-size:28px;">🎯</div><div style="font-size:13px;font-weight:600;color:#1A237E;">+20 Puan</div></div>
          </div>
          <button class="btn-primary" style="font-size:18px;padding:18px;background:linear-gradient(135deg,#2E7D32,#43A047);border-radius:16px;box-shadow:0 4px 15px rgba(46,125,50,0.3);" data-action="game-next">
            ${gs.patientIndex < GAME_PATIENTS.length - 1 ? '➡️ Sıradaki Hasta' : '🏆 Sonuçları Gör'}
          </button>
        </div>
      </div>`;
  }

  return "";
}

/* ============ GÜLÜŞÜNÜ TASARLA - Magic Hour AI ============ */
const MAGIC_HOUR_API_KEY = "mhk_live_f1grAFyq18bjWKCovOXuO9aQ62xAT8qavlRCQ0G61Kuy3FHmiNl2uwT8Y83JyWDHdHJwROiqt1mEO31I";

function renderSmile() {
  return `${topbar("Gülüşünü Tasarla","Yapay zeka ile Hollywood gülüşünü tasarla!", {back:"home"})}
    <div class="content">
      <div class="card p4" style="text-align:center;">
        <div style="font-size:60px;margin-bottom:12px;">✨</div>
        <p class="name" style="font-size:18px;margin-bottom:8px;">Hollywood Gülüş Tasarımı</p>
        <p class="desc" style="margin-bottom:16px;">Fotoğrafını yükle, AI ile yeni gülüşünü gör!</p>
        
        <div style="background:#f0f9ff;border:2px solid #38bdf8;border-radius:12px;padding:16px;margin-bottom:16px;">
          <p style="font-size:14px;color:#0c4a6e;margin:0;">
            <strong>🎯 Nasıl Kullanılır:</strong><br>
            1. Fotoğrafını yükle (yüzün net görünsün)<br>
            2. "Liberty" smile engine'i seç (ücretsiz)<br>
            3. Hollywood gülüşünü gör ve indir!
          </p>
        </div>
        
        <div style="border:2px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:16px;">
          <iframe 
            src="https://denta.bot/ai-smile-simulator" 
            width="100%" 
            height="900px"
            style="border:none;"
            allow="camera; microphone">
          </iframe>
        </div>
        
        <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:12px;">
          <p style="font-size:13px;color:#78350f;margin:0;">
            💡 <strong>İpucu:</strong> "Liberty" smile engine ücretsizdir. Fotoğrafını yükle, Hollywood gülüşünü gör, indir ve kliniğimize getir!
          </p>
        </div>
      </div>
    </div>`;
}

function initSmile() {
  const upload = document.getElementById("smile-upload");
  const fileInput = document.getElementById("smile-file");
  const preview = document.getElementById("smile-preview");
  const img = document.getElementById("smile-img");
  const intensity = document.getElementById("smile-intensity");
  const intensityVal = document.getElementById("smile-intensity-val");
  const generateBtn = document.getElementById("smile-generate");
  const loading = document.getElementById("smile-loading");
  const result = document.getElementById("smile-result");
  const resultImg = document.getElementById("smile-result-img");
  const downloadLink = document.getElementById("smile-download");
  const retryBtn = document.getElementById("smile-retry");
  const status = document.getElementById("smile-status");
  
  let imageBase64 = null;
  
  upload.onclick = () => fileInput.click();
  
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imageBase64 = ev.target.result.split(",")[1];
      img.src = ev.target.result;
      upload.style.display = "none";
      preview.style.display = "block";
      result.style.display = "none";
      status.textContent = "";
    };
    reader.readAsDataURL(file);
  };
  
  intensity.oninput = () => {
    intensityVal.textContent = intensity.value + "%";
  };
  
  generateBtn.onclick = async () => {
    if (!imageBase64) return;
    preview.style.display = "none";
    loading.style.display = "block";
    result.style.display = "none";
    status.textContent = "";
    
    try {
      const res = await fetch("https://dincdis-worker.erdinc47klinik.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "smile",
          imageBase64: imageBase64,
          smileIntensity: parseInt(intensity.value) / 100
        })
      });
      const data = await res.json();
      loading.style.display = "none";
      
      if (data.imageUrl) {
        resultImg.src = data.imageUrl;
        downloadLink.href = data.imageUrl;
        result.style.display = "block";
        status.textContent = "✅ Gülüşün tasarlandı!";
      } else if (data.jobId) {
        status.textContent = "⏳ İşleniyor... Biraz bekle ve tekrar dene.";
        preview.style.display = "block";
      } else {
        throw new Error(data.error || "Bilinmeyen hata");
      }
    } catch (err) {
      loading.style.display = "none";
      preview.style.display = "block";
      status.textContent = "❌ Hata: " + err.message;
    }
  };
  
  retryBtn.onclick = () => {
    result.style.display = "none";
    preview.style.display = "block";
    status.textContent = "";
  };
}
