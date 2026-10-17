/* =========================================================
   DİNÇ DİŞ KLİNİK — Firebase bağlantısı
   Bu dosya bir ES module'dür (index.html'de type="module" ile
   yüklenir). Firebase Authentication (Google + admin e-posta/şifre)
   ve Firestore (gerçek zamanlı senkron veri) burada kurulur ve
   window.fb üzerinden app.js'in kullanımına açılır.
========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp,
  doc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIEzhkIrj7l53G3GyaXo5XA8qwcsC74hU",
  authDomain: "erdinc-dis-klinik.firebaseapp.com",
  projectId: "erdinc-dis-klinik",
  storageBucket: "erdinc-dis-klinik.firebasestorage.app",
  messagingSenderId: "479869343454",
  appId: "1:479869343454:web:d183fba13ee4469b43944f",
  measurementId: "G-NYE38HPZZ8"
};

/* ÖNEMLİ: Yönetici panelini yalnızca bu e-postaya kilitliyoruz.
   Firebase konsolunda Authentication > Users kısmından bu e-posta
   ile bir kullanıcı oluşturman gerekiyor (şifreyi orada belirlersin). */
const ADMIN_EMAIL = "erdinc47klinik@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/* ---------------- AUTH ---------------- */

async function signInGoogle() {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return { ok: true, user: res.user };
  } catch (err) {
    console.error("Google giriş hatası:", err);
    return { ok: false, error: err.message };
  }
}

async function adminSignIn(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res.user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      return { ok: false, error: "Bu hesap yönetici olarak tanımlı değil." };
    }
    return { ok: true, user: res.user };
  } catch (err) {
    return { ok: false, error: "Giriş başarısız: kullanıcı adı ya da şifre hatalı." };
  }
}

function signOutUser() { return signOut(auth); }

function onAuthChange(cb) {
  onAuthStateChanged(auth, (user) => {
    cb(user ? { uid: user.uid, name: user.displayName || user.email, email: user.email, isAdmin: user.email === ADMIN_EMAIL } : null);
  });
}

/* ---------------- FIRESTORE: canlı koleksiyonlar ---------------- */
/* Her fonksiyon bir onSnapshot aboneliği kurar ve her değişiklikte
   cb(listesi) çağırır — yani bir kullanıcı yorum eklediğinde TÜM
   kullanıcıların ekranı anında güncellenir. */

function subscribe(colName, cb, max=100) {
  const q = query(collection(db, colName), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    cb(items.slice(0, max));
  }, (err) => { console.error(`${colName} dinleme hatası:`, err); cb([]); });
}

function addItem(colName, data) {
  return addDoc(collection(db, colName), { ...data, createdAt: serverTimestamp() });
}

/* Basit anahtar->deger haritaları (id -> {url}) — hizmet videoları ve
   ürün görselleri için. Herkes okuyabilir, sadece admin yazar (bkz.
   Firestore güvenlik kuralları). */
function subscribeMap(colName, cb) {
  return onSnapshot(collection(db, colName), (snap) => {
    const map = {};
    snap.forEach(d => { map[d.id] = d.data().url || ""; });
    cb(map);
  }, (err) => { console.error(`${colName} dinleme hatası:`, err); cb({}); });
}

function setMapValue(colName, id, url) {
  return setDoc(doc(db, colName, id), { url, updatedAt: serverTimestamp() });
}

function replyToReview(reviewId, replyText) {
  return updateDoc(doc(db, "reviews", reviewId), { adminReply: replyText, adminReplyAt: serverTimestamp() });
}

function deleteItem(colName, id) {
  return deleteDoc(doc(db, colName, id));
}

function addToBlockedUsers(uid) {
  return setDoc(doc(db, "blocked_users", uid), { uid, blockedAt: serverTimestamp() });
}

function removeFromBlockedUsers(uid) {
  return deleteDoc(doc(db, "blocked_users", uid));
}

function subscribeBlockedUsers(cb) {
  return onSnapshot(collection(db, "blocked_users"), (snap) => {
    const blocked = [];
    snap.forEach(d => { blocked.push(d.id); });
    cb(blocked);
  }, (err) => { console.error("blocked_users dinleme hatası:", err); cb([]); });
}

function setSocialMedia(id, url) {
  return setDoc(doc(db, "social_media", id), { url, updatedAt: serverTimestamp() });
}

function subscribeSocialMedia(cb) {
  return onSnapshot(collection(db, "social_media"), (snap) => {
    const social = {};
    snap.forEach(d => { social[d.id] = d.data().url || ""; });
    cb(social);
  }, (err) => { console.error("social_media dinleme hatası:", err); cb({}); });
}

/* ---------------- KULLANICI PROFİLLERİ ---------------- */
function saveUserProfile(uid, profile) {
  return setDoc(doc(db, "user_profiles", uid), { ...profile, updatedAt: serverTimestamp() });
}

function loadUserProfile(uid) {
  return getDocs(query(collection(db, "user_profiles"), where("__name__", "==", uid))).then(snap => {
    if (!snap.empty) {
      const data = snap.docs[0].data();
      delete data.updatedAt;
      return data;
    }
    return null;
  });
}

function saveBrushStreak(uid, data) {
  return setDoc(doc(db, "brush_streaks", uid), { ...data, updatedAt: serverTimestamp() });
}

function loadBrushStreak(uid) {
  return getDocs(query(collection(db, "brush_streaks"), where("__name__", "==", uid))).then(snap => {
    if (!snap.empty) return snap.docs[0].data();
    return null;
  });
}

/* Yönetici: brushing video URL kaydet/oku */
function setBrushingVideo(url) {
  return setDoc(doc(db, "settings", "brushing_video"), { url, updatedAt: serverTimestamp() });
}

/* ---------------- KLİNİK GÖRSELLERİ (doktor foto, logo, splash) ---------------- */
function setClinicSetting(key, value) {
  return setDoc(doc(db, "settings", key), { url: value, updatedAt: serverTimestamp() });
}

function subscribeClinicSetting(key, cb) {
  return onSnapshot(doc(db, "settings", key), (d) => {
    cb(d.exists() ? (d.data().url || "") : "");
  }, (err) => { console.error(`clinic_setting ${key} dinleme hatası:`, err); cb(""); });
}

function subscribeBrushingVideo(cb) {
  return onSnapshot(doc(db, "settings", "brushing_video"), (d) => {
    cb(d.exists() ? (d.data().url || "") : "");
  }, (err) => { console.error("brushing_video dinleme hatası:", err); cb(""); });
}

/* ---------------- SAĞLIK İPUÇLARI ---------------- */
function subscribeHealthTips(cb) {
  return onSnapshot(collection(db, "health_tips"), (snap) => {
    const tips = [];
    snap.forEach(d => tips.push({ id: d.id, ...d.data() }));
    cb(tips);
  }, (err) => { console.error("health_tips dinleme hatası:", err); cb([]); });
}

function addHealthTip(text) {
  return addDoc(collection(db, "health_tips"), { text, createdAt: serverTimestamp() });
}

function deleteHealthTip(id) {
  return deleteDoc(doc(db, "health_tips", id));
}

/* ---------------- DUYURULAR ---------------- */
function subscribeAnnouncements(cb) {
  return onSnapshot(query(collection(db, "announcements"), orderBy("createdAt", "desc")), (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    cb(items);
  }, (err) => { console.error("announcements dinleme hatası:", err); cb([]); });
}

function addAnnouncement(data) {
  return addDoc(collection(db, "announcements"), { ...data, createdAt: data.createdAt || new Date().toISOString() });
}

function deleteAnnouncement(id) {
  return deleteDoc(doc(db, "announcements", id));
}

/* ---------------- MUHASEBE ---------------- */
function addAccountingEntry(data) {
  const col = data.type === "income" ? "accounting_incomes" : "accounting_expenses";
  return addDoc(collection(db, col), { ...data, createdAt: data.createdAt || new Date().toISOString() });
}

function subscribeAccounting(type, cb) {
  const col = type === "income" ? "accounting_incomes" : "accounting_expenses";
  return onSnapshot(query(collection(db, col), orderBy("createdAt", "desc")), (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    cb(items);
  }, (err) => { console.error(col + " dinleme hatası:", err); cb([]); });
}

/* ---------------- TEDAVİLER (admin ekler, kullanıcı görür) ---------------- */
function subscribeTreatments(cb) {
  return onSnapshot(query(collection(db, "treatments"), orderBy("date", "desc")), (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    cb(items);
  }, (err) => { console.error("treatments dinleme hatası:", err); cb([]); });
}

function addTreatment(data) {
  return addDoc(collection(db, "treatments"), { ...data, createdAt: serverTimestamp() });
}

function deleteTreatment(id) {
  return deleteDoc(doc(db, "treatments", id));
}

/* ---------------- window.fb üzerinden dışa aç ---------------- */

window.fb = {
  ready: true,
  signInGoogle, adminSignIn, signOutUser, onAuthChange,
  subscribeReviews: (cb) => subscribe("reviews", cb),
  addReview: (data) => addItem("reviews", data),
  subscribeProducts: (cb) => subscribe("products_custom", cb),
  addProduct: (data) => addItem("products_custom", data),
  subscribeAppointments: (cb) => subscribe("appointments", cb),
  addAppointment: (data) => addItem("appointments", data),
  subscribeOrders: (cb) => subscribe("orders", cb),
  addOrder: (data) => addItem("orders", data),
  addMessage: (data) => addItem("messages", data),
  subscribeServiceVideos: (cb) => subscribeMap("service_videos", cb),
  setServiceVideo: (id, url) => setMapValue("service_videos", id, url),
  subscribeProductImages: (cb) => subscribeMap("product_images", cb),
  setProductImage: (id, url) => setMapValue("product_images", id, url),
  subscribeDeviceVideos: (cb) => subscribeMap("device_videos", cb),
  setDeviceVideo: (id, url) => setMapValue("device_videos", id, url),
  replyToReview: (id, text) => replyToReview(id, text),
  deleteReview: (id) => deleteItem("reviews", id),
  addToBlockedUsers: (uid) => addToBlockedUsers(uid),
  removeFromBlockedUsers: (uid) => removeFromBlockedUsers(uid),
  subscribeBlockedUsers: (cb) => subscribeBlockedUsers(cb),
  setSocialMedia: (id, url) => setSocialMedia(id, url),
  subscribeSocialMedia: (cb) => subscribeSocialMedia(cb),
  // Profil sistemi
  saveUserProfile: (uid, profile) => saveUserProfile(uid, profile),
  loadUserProfile: (uid) => loadUserProfile(uid),
  saveBrushStreak: (uid, data) => saveBrushStreak(uid, data),
  loadBrushStreak: (uid) => loadBrushStreak(uid),
  setBrushingVideo: (url) => setBrushingVideo(url),
  subscribeBrushingVideo: (cb) => subscribeBrushingVideo(cb),
  setClinicSetting: (key, value) => setClinicSetting(key, value),
  subscribeClinicSetting: (key, cb) => subscribeClinicSetting(key, cb),
  subscribeHealthTips: (cb) => subscribeHealthTips(cb),
  addHealthTip: (text) => addHealthTip(text),
  subscribeAnnouncements: (cb) => subscribeAnnouncements(cb),
  addAnnouncement: (data) => addAnnouncement(data),
  deleteAnnouncement: (id) => deleteAnnouncement(id),
  addAccountingEntry: (data) => addAccountingEntry(data),
  subscribeAccountingIncomes: (cb) => subscribeAccounting("income", cb),
  subscribeAccountingExpenses: (cb) => subscribeAccounting("expense", cb),
  saveAccountingData: (data) => setDoc(doc(db, "settings", "accounting"), data),
  loadAccountingData: () => getDoc(doc(db, "settings", "accounting")),
  deleteHealthTip: (id) => deleteHealthTip(id),
  subscribeTreatments: (cb) => subscribeTreatments(cb),
  addTreatment: (data) => addTreatment(data),
  deleteTreatment: (id) => deleteTreatment(id),
};

window.dispatchEvent(new Event("fb-ready"));
