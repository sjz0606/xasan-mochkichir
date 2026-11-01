// ============================================================
//  Xasan Mochkichiri — sozlamalar (faqat shu faylni tahrirlang)
// ============================================================
window.CONFIG = {
  setPrice: 65000,            // 1 to'liq set narxi (videoda e'lon qilingan), so'm
  phoneDelivery: '+998937775151',
  phoneAdmin: '+998935488585',
  telegram: 'https://t.me/Xasan_Mochkichir',
  instagram: 'https://www.instagram.com/xasan_mochkichir/',
  youtube: 'https://www.youtube.com/channel/UCS-nCowdfnje1qI4iEgyHlg',
  mapQuery: 'Xasan Mochkichir',
  // Ish vaqti (Instagram bio bo'yicha). Videolarda 05:00–13:00 ham aytilgan — aniqlashtiring.
  open: 17 * 60, close: 1 * 60,
  // Buyurtmalar uchun server (Telegram botga uzatadi). Bo'sh — Telegram/qo'ng'iroq orqali.
  orderEndpoint: '',
  // Aksiya: 1 milliard qamrov → 5 qozon bepul
  promoUntil: '2026-11-15T23:59:00+05:00',
};

// To'liq set tarkibi — rasm ustidagi nuqtalar (x, y — foizda)
window.SET_ITEMS = [
  { id: 'mosh', x: 50, y: 50, name: 'Moshkichiri', note: "Mosh, guruch, dumba — qozondan issiq holda, lagan to'la" },
  { id: 'gosht', x: 55, y: 40, name: "Semiz mol go'shti", note: "Shu kuni so'yilgan buqa, katta bo'laklarda ustiga" },
  { id: 'non', x: 15, y: 70, name: 'Tandir non', note: 'Issiq, naqshli patir non' },
  { id: 'choy', x: 12, y: 18, name: "Ko'k choy", note: 'Choynakda, paxta gulli piyolalar bilan' },
  { id: 'salat', x: 73.5, y: 19, name: 'Achchiq-chuchuk', note: 'Pomidor, piyoz, achchiq qalampir' },
  { id: 'limon', x: 83, y: 45, name: 'Limon', note: "Yog'li taomdan keyin — tetiklik" },
  { id: 'navot', x: 83, y: 75, name: 'Navot', note: 'Choy bilan shirin yakun' },
  { id: 'xizmat', x: 68, y: 72, name: "Xizmat ko'rsatish", note: 'Obsluga ham narx ichida — ustama yo\'q' },
];

// Tarkib (ingredients rasmidagi tartib bo'yicha, x — foizda)
window.INGR = [
  { x: 9, name: 'Mosh', note: "Taomning yuragi — yorilguncha qaynatiladi" },
  { x: 23, name: 'Guruch', note: 'Moshdan keyin solinadi, kovlab-kovlab pishadi' },
  { x: 36.5, name: "Mol go'shti", note: '977 kg lik buqa — kilosi 75 000 so\'mdan olingan' },
  { x: 47, name: 'Dumba', note: "Ta'm va to'qlik beradi" },
  { x: 56.5, name: 'Qazi', note: 'Bayramona ta\'m uchun' },
  { x: 68, name: 'Piyoz', note: 'Halqa-halqa qilib qizarguncha qovuriladi' },
  { x: 76, name: 'Sabzi', note: 'Shirinlik va rang' },
  { x: 83, name: 'Zira va sarimsoq', note: 'Xushbo\'y ziravorlar' },
  { x: 89, name: 'Qalampir', note: 'Ozgina achchiqlik' },
  { x: 94.5, name: 'Tuz', note: "Tuzi qozonda rostlanadi" },
];

// Jarayon: haqiqiy videolar (assets/vXX.mp4)
window.STEPS = [
  { v: 'v04', k: '01', t: 'Bozor', h: '977 kg lik buqa', p: "Xasan aka buqani o'zi tanlaydi. Tarozida 977 kg chiqdi — kilosi 75 000 so'mdan. Otaxonga esa yaxlitlab 80 million berdi: «Nabiralaringizning to'yiga»." },
  { v: 'v22', k: '02', t: 'Qassob', h: "Go'shtning rangiga 100% javob", p: "Har kuni yangi go'sht. Bo'yin go'shti — 12 kilo 300 gramm, tarozida, kamerada. Muzlatgich yo'q." },
  { v: 'v29', k: '03', t: 'Qozon', h: "O'tin olovi, ulkan qozon", p: "Mosh, guruch, semiz go'sht, dumba, qazi va qovurilgan piyoz — g'isht o'choqda soatlab." },
  { v: 'v20', k: '04', t: 'Dasturxon', h: '«5 qozon tugadi — 6-si ochildi!»', p: "Bismillah bilan qozon ochiladi. Odam ko'p — qozon ham ko'p. Hurmatdasizlar!" },
];

window.QUOTES = [
  'Hurmatdasizlar!',
  "Yomon kuninglarda emas, yaxshi kuninglarda xizmatda bo'lay.",
  "Mening obunachilarim eng zo'riga loyiq.",
  "Go'shtning rangiga 100% javob beraman.",
  "Bugungisini yeb ko'rmasalaring bo'lmaydi.",
  "Hasadning bog'i hech qachon ko'karmaydi.",
];

window.REELS = [
  { f: 'v20', t: '6-qozon ochildi', l: '77K', c: 'DepNvB6h-b7' },
  { f: 'v29', t: 'Qozon qaynayapti', l: '64K', c: 'DfADcA_hz1A' },
  { f: 'v04', t: '977 kg buqa', l: '197K', c: 'Deon1sYBW5t' },
  { f: 'v38', t: '1 million sharafiga', l: '45K', c: 'DfHNNLpBQlL' },
  { f: 'v17', t: "Go'sht saralanmoqda", l: '90K', c: 'Deq4bzGo0E7' },
  { f: 'v26', t: 'Har kuni yangi', l: '69K', c: 'DfEsYGABa_c' },
  { f: 'v12', t: "Obunachilarga eng zo'ri", l: '104K', c: 'De1AJEeBUoB' },
  { f: 'v00', t: "Lafz qildimmi — oldim", l: '310K', c: '' },
];
