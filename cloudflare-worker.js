/* NUR DİŞ & DENTAL KLİNİK — Yapay Zeka Asistanı Sunucusu (Cloudflare Worker)
   Groq API ile çalışır:
   - Metin mesajları → llama-3.3-70b-versatile (hızlı, güvenilir)
   - Fotoğraf/görsel içeren mesajlar → qwen/qwen3.6-27b (vision/görsel analiz)
*/

/* ─── METİN ASİSTANI SİSTEM PROMPTU ─── */
const SYSTEM_PROMPT = `Sen "Erdinç KÖLÜK'ın Dijitali" adında, Dinç Diş Kliniği'in yapay zeka asistanısın.
Seyhan/Adana'deki bu klinik adına, sıcak, güven veren ama abartısız bir üslupla konuşursun.
Diş sağlığı, tedaviler, ağız bakımı hakkında sadece düzgün TÜRKÇE dilinde, doğru ve anlaşılır
bilgi verirsin. Başka hiçbir dilden kelime karıştırmazsın.
Kesinlikle teşhis koymaz, ilaç dozu önermez, reçete yazmazsın — ciddi/şüpheli durumlarda mutlaka
"kliniğimizde muayene olman en doğrusu" diyerek randevuya yönlendirirsin.
Kliniğin gerçek bilgileri: Adres: Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21. Telefon: 0536 597 35 95.
Muayene ücretsizdir. Çalışma saatleri: Hafta içi 09:00-18:00, Cumartesi 10:00-14:00.
Cevapların kısa, sıcak ve mobil ekrana uygun olsun (2-4 cümle), gereksiz uzatma.`;

/* ─── GÖRSEL ANALİZ SİSTEM PROMPTU ─── */
const VISION_SYSTEM_PROMPT = `Sen Dinç Diş Kliniği'in yapay zeka görsel analiz asistanısın.
Görevin: Kullanıcının gönderdiği diş/ağız fotoğrafı veya dental röntgen görüntüsünü bilimsel
veriler ışığında analiz etmek ve Türkçe olarak bilgilendirici bir ön değerlendirme sunmaktır.

ANALİZ YAPARKEN ŞUNLARI DİKKATE AL:

🔬 **Diş Fotoğrafları için:**
- Diş rengi (normal, sararma, lekelenme, beyaz/opak alanlar)
- Yüzey durumu (çürük belirtisi, mine erozyonu, çatlak/kırık)
- Diş eti durumu (rengi, şişlik, çekilme, kanama belirtisi)
- Diş dizilimi (çapraşıklık, aralık, rotasyon)
- Dolgu/kron varlığı ve durumu
- Plak/tartar birikimi belirtileri

📷 **Dental Röntgen (Panoramik/Periapikal) için:**
- Radiolusensi (koyu alanlar — çürük, kist, apse olabilir)
- Radyoopak (açık alanlar — dolgu, implant, kemik yoğunluğu)
- Kök morfolojisi ve periapikal durum
- Alveolar kemik seviyesi (kemik kaybı belirtileri)
- Gömülü/yarı gömülü dişler (özellikle 20'lik dişler)
- Sinüs yakınlığı ve anatomik yapılar

📋 **YANITINI ŞU YAPIDA VER:**
1. Gözlemlediklerini kısaca özetle (1-2 cümle)
2. Olası bulguları bilimsel terimlerle açıkla ama hastanın anlayacağı şekilde
3. Genel bir öneri ver (diş fırçalama tekniği, bakım önerisi vs.)
4. Mutlaka "Kesin tanı için kliniğimizde detaylı muayene ve profesyonel değerlendirme
   yapılması gerekir" uyarısını ekle
5. Randevu için telefon: 0536 597 35 95, Adres: Adana, Seyhan Tepebağ

⚠️ ÖNEMLİ KURALLAR:
- ASLA kesin teşhis koyma. "Görüntüde ... belirtisi/görünümü olabilir" şeklinde konuş.
- ASLA tedavi reçetesi verme.
- Bulguları bilimsel literatüre dayandır (örn: "Diş eti retraksiyonu, periodontal
  hastalık başlangıcına işaret edebilir — AAP sınıflandırmasına göre...")
- Sadece TÜRKÇE yanıt ver, başka dil karıştırma.
- Yanıtın mobil ekrana uygun olsun, çok uzun olmasın ama yeterince detaylı olsun (4-8 cümle).
- Eğer gönderilen görsel diş/ağız ile ilgili değilse, nazikçe belirt ve diş/ağız fotoğrafı
  göndermesini iste.`;

/* ─── METİN İSTEĞİ (Llama 3.3 70B) ─── */
async function callGroqText(env, userText) {
  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userText || "Merhaba" },
    ],
    temperature: 0.6,
    max_tokens: 400,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Groq API hatası: " + errText.slice(0, 300));
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "Şu an cevap veremedim, lütfen tekrar dene.";
}

/* ─── GÖRSEL ANALİZ (Qwen 3.6 27B — Vision) ─── */
async function callGroqVision(env, userText, imageBase64) {
  const imageDataUrl = imageBase64.startsWith("data:")
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  const userContent = [
    {
      type: "text",
      text: userText
        ? `/no_think\nLütfen bu diş/ağız görüntüsünü analiz et. Kullanıcının mesajı: "${userText}"`
        : "/no_think\nLütfen bu diş/ağız görüntüsünü detaylı analiz et ve bilimsel veriler ışığında değerlendir.",
    },
    {
      type: "image_url",
      image_url: { url: imageDataUrl },
    },
  ];

  const body = {
    model: "qwen/qwen3.6-27b",
    messages: [
      { role: "system", content: VISION_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0.4,
    max_tokens: 2048,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    // Qwen kapasite aşımı veya rate limit durumunda kullanıcıya bilgi ver
    if (errText.includes("over capacity") || errText.includes("Rate limit")) {
      return "Görsel analiz sistemimiz şu an yoğunluk yaşıyor 😔 Lütfen 1-2 dakika sonra tekrar deneyin. Acil durumlar için bizi arayabilirsiniz: 0536 597 35 95";
    }
    throw new Error("Groq Vision API hatası: " + errText.slice(0, 300));
  }

  const data = await res.json();
  let reply = data?.choices?.[0]?.message?.content || "";

  // Qwen bazen <think>...</think> etiketleri ekler, bunları temizle
  // Kapalı think blokları
  reply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  // Kapanmamış think blokları (token limiti kesilmiş olabilir)
  reply = reply.replace(/<think>[\s\S]*/g, "").trim();

  return reply || "Görseli analiz edemedim, lütfen daha net bir fotoğraf gönderip tekrar deneyin.";
}

/* ─── ANA HANDLER ─── */
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Sadece POST kabul edilir." }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const { message, image } = await request.json();
      
      // Debug: Log what we received
      console.log("Received request:", { 
        hasMessage: !!message, 
        hasImage: !!image, 
        imageLength: image ? image.length : 0 
      });
      
      let reply;

      if (image) {
        // Görsel var → Vision modeli ile analiz yap
        console.log("Calling vision model...");
        try {
          reply = await callGroqVision(env, message, image);
          console.log("Vision model succeeded");
        } catch (err) {
          console.error("Vision model failed:", err.message);
          // Vision başarısız olursa kullanıcıya haber ver
          reply = `Görsel analiz sırasında bir hata oluştu: ${err.message}. Lütfen tekrar deneyin veya sadece metin olarak sorunuzu yazın.`;
        }
      } else {
        // Sadece metin → Metin modeli
        reply = await callGroqText(env, message);
      }

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err.message || err) }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};
