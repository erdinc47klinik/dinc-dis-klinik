/* Sürüm numarasını HER değişiklikte artır — eski önbellek otomatik silinir. */
const CACHE_VERSION = "v3";
const CACHE_NAME = "dincdis-" + CACHE_VERSION;
const ASSETS = [
  "./index.html", "./app.js", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./doctor-photo.jpg", "./clinic-hero.jpg", "./whitening-before-after.jpg",
  "./treatment-process.jpg", "./info-toothache.jpg",
  "./screenshot-1-home.png", "./screenshot-2-services.png", "./screenshot-3-booking.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((err) => console.error("Önbellekleme hatası:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Tüm açık sekmelere "yeni sürüm yüklendi" mesajı gönder.
        return self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((client) => client.postMessage({ type: "NURDIS_UPDATED", version: CACHE_VERSION }));
        });
      })
  );
});

/* ÖNEMLİ: index.html ve app.js için ÖNCE AĞ, olmazsa önbellek (network-first).
   Önceki sürümde önbellek önce kontrol ediliyordu; bu da güncelleme
   yayınlansa bile kullanıcıların hep eski app.js'i görmesine, bazen de
   yarım/bozuk bir karışıma (index.html yeni, app.js eski gibi) yol açıp
   "uygulama düzgün yüklenemedi" hatasına neden oluyordu. */
const NETWORK_FIRST = ["index.html", "app.js", "firebase-init.js", "manifest.json"];

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isNetworkFirst = NETWORK_FIRST.some((f) => url.pathname.endsWith(f)) || url.pathname === "/" || url.pathname.endsWith("/DincDis-site/");

  if (isNetworkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Görseller ve diğer statik dosyalar: önce önbellek, sonra ağ (hızlı açılış).
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
