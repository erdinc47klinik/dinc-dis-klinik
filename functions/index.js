const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

admin.initializeApp();

const GEMINI_API_KEY = "AIzaSyAgWqZcXlTFjz5Sg5kkFf_-aUUNJO_-bkA";
const MODEL = "gemini-1.5-flash";

/* ========== AI CHATBOT: Erdinç KÖLÜK'ın Dijitali ========== */

exports.chatWithAI = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const userMessage = data.message;

    if (!userMessage || userMessage.trim().length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Mesaj boş olamaz"
      );
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userMessage
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
            topP: 0.95,
            topK: 40
          },
          systemInstruction: {
            parts: [
              {
                text: `Sen Erdinç KÖLÜK'ın Dijital Asistanı'sın. Dinç Diş Kliniği'in yapay zeka chatbot'usun.

🦷 KİMLİK:
- Adın: "Erdinç KÖLÜK'ın Dijitali"
- Klinik: Dinç Diş Kliniği
- Lokasyon: Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21
- Doktor: Erdinç KÖLÜK (10 yıllık deneyime sahip implant ve çene cerrahisi uzmanı)

📋 GOREVLERİN:
1. Diş ağrısı, belirtiler ve tedaviler hakkında soru yanıtla
2. Hizmetler, fiyatlandırma ve randevu hakkında bilgi ver
3. Türkçe'de samimi, yardımcı ve profesyonel ol
4. TIBBİ TAVSİYE değil, GENEL BİLGİ ver
5. Ciddi durumlar için hastaya doktor görmesini öner

🦷 HİZMETLER:
- Diş Muayenesi & Kontrol (500₺)
- Diş Temizliği (900₺)
- Dolgu (700-1500₺)
- Kanal Tedavisi (2500-4000₺)
- Diş Çekimi (800-2000₺)
- Diş Beyazlatma (3000₺)
- İmplant (12000-18000₺)
- Zirkonyum Kaplama (4500-7000₺/diş)
- Şeffaf Plak (Muayene sonrası)
- Ortodonti (Muayene sonrası)
- Köprü (4000-9000₺/diş)

⏰ ÇALIŞMA SAATLERİ:
- Hafta içi: 09:00 - 18:00
- Cumartesi: 10:00 - 14:00
- Pazar: Kapalı

📞 İLETİŞİM:
- Telefon: 0505 105 03 02
- E-posta: erdinc47klinik@gmail.com
- Adres: Adana, Seyhan, Tepebağ Mah. Nalbant Halil Sok. No:21

💡 DİKKAT:
- Ağır ağrı, şişlik, ateş → ACİL MUAYENE gerekir
- Hamile, diyabet, kalp hastalığı varsa mutlaka söyle
- Sigara ve alkol iyileşmeyi yavaşlatır

🎯 YANIT STİLİ:
- Kısa ve net cevaplar (3-4 cümle)
- Gerekirse madde madde listele
- Emoji kullan (ama abartma)
- Her cevabın sonuna "Başka sorun varsa sorabilirsin! 😊" ekle
- Randevu hakkında soru olursa: "Randevu almak için 'Randevu Al' sekmesine tıkla!"

ÖNEMLI: Sadece diş sağlığı ile ilgili sorulara cevap ver. İlgisiz sorulara "Benim alanım diş sağlığı, bu konuda size yardımcı olamam ama diş hekimliği hakkında merak ettiğin bir şey varsa sorabilirsin! 😊" diye yanıt ver.`
              }
            ]
          }
        }
      );

      const aiReply = response.data.candidates[0].content.parts[0].text;

      return {
        success: true,
        reply: aiReply,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Gemini API Hatası:", error.response?.data || error.message);
      throw new functions.https.HttpsError(
        "internal",
        "AI yanıt veremedi. Lütfen birkaç saniye sonra tekrar dene."
      );
    }
  });

/* ========== DİŞ FOTOĞRAFI ANALİZİ ========== */

exports.analyzeToothPhoto = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const imageBase64 = data.imageBase64;
    const userMessage = data.message || "Bu dişte ne sorun var? Profesyonel bir diş hekimi önerisi ver.";

    if (!imageBase64) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Fotoğraf gerekli"
      );
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userMessage + "\n\n(Bu bir yapay zeka analizi olup, profesyonel bir diş hekiminin görüşü yerine geçmez. Lütfen mutlaka bir diş hekimine danış.)"
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 400
          }
        }
      );

      const analysis = response.data.candidates[0].content.parts[0].text;

      return {
        success: true,
        analysis: analysis,
        disclaimer: "⚠️ Bu yapay zeka tarafından verilen bir analiz olup, profesyonel tıbbi tavsiye değildir. Mutlaka bir diş hekimine danışın.",
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Resim Analiz Hatası:", error.message);
      throw new functions.https.HttpsError(
        "internal",
        "Fotoğraf analiz edilemedi"
      );
    }
  });

/* ========== YÖNETİCİ: KAMPANYALARı VALİDE ET ========== */

exports.validateCampaign = functions
  .region("europe-west1")
  .firestore.document("campaigns/{campaignId}")
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (!data) return;

    // Kampanya başlangıç ve bitiş tarihleri kontrol et
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        console.warn("Hatalı tarih: başlangıç tarihi bitiş tarihinden sonra");
      }
    }
  });

/* ========== YÖNETİCİ: BİLGİ MAKALELERİNİ İNDEKSLE ========== */

exports.indexInfoArticles = functions
  .region("europe-west1")
  .firestore.document("info_articles/{articleId}")
  .onCreate(async (snap, context) => {
    const article = snap.data();
    console.log(`Yeni bilgi makalesi eklendi: ${article.title}`);
    // İleride arama (search) eklemek için burada indeksleme yapılabilir
  });
