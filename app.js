// Xasan Mochkichiri — sahifa mantig'i
(() => {
  const C = CONFIG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const som = n => Math.round(n).toLocaleString('ru-RU').replace(/[ ,]/g, ' ') + " so'm";
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200); };
  const hasG = window.gsap && window.ScrollTrigger;
  const mobile = matchMedia('(max-width:1100px)').matches;
  if (!hasG) document.documentElement.classList.add('no-gsap'); else gsap.registerPlugin(ScrollTrigger);

  $$('[data-price]').forEach(e => e.textContent = som(C.setPrice));
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- Ish vaqti ---------- */
  const hhmm = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  $('#hoursTxt').textContent = hhmm(C.open) + '–' + hhmm(C.close);
  $('#hoursTxt2').textContent = hhmm(C.open) + ' – ' + hhmm(C.close);
  const nowT = () => { const d = new Date(); const t = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 5 * 36e5); return t.getHours() * 60 + t.getMinutes(); };
  const isOpen = () => { const m = nowT(); return C.close < C.open ? (m >= C.open || m < C.close) : (m >= C.open && m < C.close); };
  function status() {
    const o = isOpen(), m = nowT(), left = o ? (C.close - m + 1440) % 1440 : (C.open - m + 1440) % 1440;
    const s = $('#status'); s.className = 'status ' + (o ? 'open' : 'closed'); s.querySelector('b').textContent = o ? 'Hozir ochiq' : 'Hozir yopiq';
    $('#status2').textContent = o ? `Ochiq · yopilishiga ${Math.floor(left / 60)} s ${left % 60} daq` : `Yopiq · ${Math.floor(left / 60)} s ${left % 60} daqdan keyin ochiladi`;
    $('#closedNote').textContent = o ? '' : `Hozir yopiq — buyurtmangiz ${hhmm(C.open)} da birinchilardan bo'lib qabul qilinadi.`;
  }
  status(); setInterval(status, 30000);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    lenis = window.lenis = new Lenis({ lerp: .09, smoothWheel: true });
    if (hasG) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const el = $(id); if (!el) return;
    e.preventDefault(); lenis ? lenis.scrollTo(el, { offset: -10, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  }));
  const burger = $('#burger');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o); lenis && (o ? lenis.stop() : lenis.start()); };
  burger.onclick = () => setMenu(!document.body.classList.contains('menu-open'));
  $$('#mnav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  const nav = $('#nav'), fab = $('#fab');
  addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 60);
    const ord = $('#buyurtma').getBoundingClientRect();
    fab.classList.toggle('on', scrollY > innerHeight * .9 && !(ord.top < innerHeight && ord.bottom > 0));
  }, { passive: true });

  /* ---------- SET: nuqtalar ---------- */
  const list = $('#setList'), spots = $('#spots');
  SET_ITEMS.forEach((it, i) => {
    const li = document.createElement('li'); li.innerHTML = `<i>✓</i>${it.name}<small>${it.note}</small>`; list.appendChild(li);
    const s = document.createElement('div'); s.className = 'spot'; s.style.left = it.x + '%'; s.style.top = it.y + '%'; s.innerHTML = `<b>${it.name}</b>`; spots.appendChild(s);
    const hl = () => { $$('.spot').forEach(x => x.classList.remove('cur')); s.classList.add('cur'); };
    li.addEventListener('mouseenter', hl); s.addEventListener('mouseenter', hl);
  });
  const setOn = n => { $$('#setList li').forEach((l, i) => { l.classList.toggle('on', i < n); l.classList.toggle('cur', i === n - 1); }); $$('.spot').forEach((s, i) => { s.classList.toggle('on', i < n); s.classList.toggle('cur', i === n - 1); }); };
  if (hasG && !mobile && innerHeight >= 720) {
    ScrollTrigger.create({ trigger: '.set-pin', start: 'top top', end: '+=' + (SET_ITEMS.length * 22) + '%', pin: true,
      onUpdate: st => setOn(Math.min(SET_ITEMS.length, Math.ceil(st.progress * (SET_ITEMS.length + .3)))) });
  } else if (mobile) {
    // telefon: rasm yuqorida yopishib turadi, har bir qator ekran o'rtasidan o'tganda nuqta yonadi
    const lis = $$('#setList li');
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setOn(lis.indexOf(e.target) + 1); }), { rootMargin: '-60% 0px -35% 0px' });
    lis.forEach(l => sio.observe(l));
  } else {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { let n = 0; const iv = setInterval(() => { setOn(++n); if (n >= SET_ITEMS.length) clearInterval(iv); }, 280); o.disconnect(); } }), { threshold: .4 }).observe($('.set-img'));
  }

  /* ---------- TARKIB: kamera masalliqlar ustidan o'tadi ---------- */
  const tr = $('#ingrTrack'), cap = $('#ingrCap'), NI = INGR.length;
  INGR.forEach(g => { const li = document.createElement('li'); li.innerHTML = `<b>${g.name}</b>${g.note}`; $('#ingrList').appendChild(li); });
  const sw = $('#ingrSwipe'), dots = $('#ingrDots');
  INGR.forEach((g, i) => {
    const c = document.createElement('div'); c.className = 'ic' + (i ? '' : ' on');
    c.style.backgroundImage = 'url(assets/img/ingr.webp)';
    c.style.backgroundPosition = Math.max(0, Math.min(100, (7 * g.x / 100 - .5) / 6 * 100)) + '% 50%';
    c.innerHTML = `<div><small>${String(i + 1).padStart(2, '0')} / ${NI}</small><b>${g.name}</b><span>${g.note}</span></div>`;
    sw.appendChild(c); dots.appendChild(document.createElement('i'));
  });
  dots.firstChild.classList.add('on');
  const cio2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const i = $$('.ic').indexOf(e.target);
    $$('.ic').forEach((c, j) => c.classList.toggle('on', j === i)); $$('i', dots).forEach((d, j) => d.classList.toggle('on', j === i)); } }), { root: sw, threshold: .6 });
  $$('.ic').forEach(c => cio2.observe(c));
  let lastI = -1;
  const showIngr = i => { if (i === lastI) return; lastI = i; const g = INGR[i];
    $('#icN').textContent = String(i + 1).padStart(2, '0') + ' / ' + NI; $('#icT').textContent = g.name; $('#icP').textContent = g.note; };
  if (hasG && !matchMedia('(max-width:640px)').matches) {
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    ScrollTrigger.create({ trigger: '.ingr-pin', start: 'top top', end: '+=' + NI * 45 + '%', pin: true, scrub: true,
      onUpdate: st => {
        const p = st.progress, z = ss(0, .1, p), W = tr.offsetWidth, L = (innerWidth - W) / 2;
        const pos = Math.min(NI - 1, Math.max(0, (p - .1) / .88 * (NI - 1)));
        const i0 = Math.floor(pos), f = ss(0, 1, pos - i0), x = INGR[i0].x + ((INGR[Math.min(NI - 1, i0 + 1)].x - INGR[i0].x) * f);
        const sc = 1 + 1.5 * z, tx = (innerWidth / 2 - L - W * x / 100 * sc) * z;
        gsap.set(tr, { x: tx, scale: sc });
        cap.classList.toggle('on', z > .6); showIngr(Math.round(pos));
        $('#icBar').style.width = (p * 100) + '%';
      } });
  }

  /* ---------- JARAYON ---------- */
  const steps = $('#steps'), phone = $('#phoneIn');
  STEPS.forEach((s, i) => {
    const d = document.createElement('article'); d.className = 'step' + (i ? '' : ' on');
    d.innerHTML = `<span class="k">${s.k}</span><span class="t">${s.t}</span><h3>${s.h}</h3><p>${s.p}</p><div class="mvid hv" style="--poster:url(assets/${s.v}.jpg)"><video muted loop playsinline preload="none" poster="assets/${s.v}.jpg" data-src="assets/${s.v}.mp4"></video></div>`;
    steps.appendChild(d);
    const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; v.poster = `assets/${s.v}.jpg`; v.dataset.src = `assets/${s.v}.mp4`;
    if (!i) { v.classList.add('on'); phone.style.setProperty('--poster', `url(assets/${s.v}.jpg)`); } phone.appendChild(v);
  });
  const pv = $$('video', phone);
  const play = v => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); };
  const showStep = i => {
    $$('.step').forEach((s, j) => s.classList.toggle('on', j === i));
    pv.forEach((v, j) => { v.classList.toggle('on', j === i); j === i ? play(v) : v.pause(); });
    phone.style.setProperty('--poster', `url(assets/${STEPS[i].v}.jpg)`);
  };
  // telefon karuseli: tablar, strelkalar, progress
  const tabs = $('#stepTabs'), stepEls = $$('.step', steps);
  STEPS.forEach((s, i) => { const b = document.createElement('button'); b.innerHTML = `<small>${s.k}</small>${s.t}`; b.onclick = () => goStep(i); tabs.appendChild(b); });
  const sbar = document.createElement('div'); sbar.className = 'wrap step-bar';
  sbar.innerHTML = `<span class="swipe-hint">← surib ko'ring</span><div class="prog"><i></i></div><div class="arr"><button aria-label="Oldingi">←</button><button aria-label="Keyingi">→</button></div>`;
  $('.steps-wrap').after(sbar);
  const [prevB, nextB] = $$('.arr button', sbar);
  let curStep = 0;
  function goStep(i) { i = Math.max(0, Math.min(STEPS.length - 1, i)); steps.scrollTo({ left: stepEls[i].offsetLeft - parseFloat(getComputedStyle(steps).scrollPaddingLeft || 0), behavior: 'smooth' }); }
  prevB.onclick = () => goStep(curStep - 1); nextB.onclick = () => goStep(curStep + 1);
  function markStep(i) {
    curStep = i;
    stepEls.forEach((s, j) => s.classList.toggle('on', j === i));
    $$('button', tabs).forEach((b, j) => b.classList.toggle('on', j === i));
    const tb = $$('button', tabs)[i]; tabs.scrollTo({ left: tb.offsetLeft - 28, behavior: 'smooth' });
    $('.prog i', sbar).style.width = ((i + 1) / STEPS.length * 100) + '%';
    prevB.disabled = i === 0; nextB.disabled = i === STEPS.length - 1;
    if (i > 0) $('.swipe-hint', sbar).style.visibility = 'hidden';
    $$('.mvid video', steps).forEach((v, j) => { if (j === i && isVisible(steps)) play(v); else v.pause(); });
  }
  const isVisible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  if (mobile) {
    // eng yaqin kartani scroll holatidan aniqlaymiz
    let raf = 0;
    steps.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const x = steps.scrollLeft + 30; let best = 0, bd = 1e9;
      stepEls.forEach((el, j) => { const d = Math.abs(el.offsetLeft - x); if (d < bd) { bd = d; best = j; } });
      if (best !== curStep) markStep(best);
    }); }, { passive: true });
    markStep(0);
    // bo'lim ekranga kirganda faqat faol karta videosi o'ynaydi
    new IntersectionObserver(es => es.forEach(e => { $$('.mvid video', steps).forEach((v, j) => { if (e.isIntersecting && j === curStep) play(v); else v.pause(); }); }), { threshold: .3 }).observe(steps);
  }
  const stepIO = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const i = $$('.step').indexOf(e.target);
    if (!mobile) showStep(i); }), { rootMargin: '-45% 0px -45% 0px' });
  $$('.step').forEach(s => stepIO.observe(s));

  // ekranda ko'ringan videolar o'z-o'zidan aylanadi
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) play(v); else v.pause(); }), { threshold: .35 });
  $$(mobile ? '[data-auto]' : '.mvid video,[data-auto]').forEach(v => { if (!v.dataset.src) v.dataset.src = v.getAttribute('src'); vio.observe(v); });
  const phoneSec = $('.screen');
  new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) pv.forEach(v => v.pause()); else { const a = pv.find(v => v.classList.contains('on')); a && play(a); } })).observe(phoneSec);

  document.addEventListener('visibilitychange', () => { if (document.hidden) $$('video').forEach(v => v.pause()); });

  /* ---------- RAQAMLAR ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.count, f = el.dataset.fmt, t0 = performance.now(); cio.unobserve(el);
    (function st(t) { const k = Math.min(1, (t - t0) / 2000), v = Math.round(to * (1 - Math.pow(1 - k, 4)));
      el.textContent = f === 'm' ? (v >= 1e6 ? '1M' : Math.round(v / 1e3) + 'K') : f === 'k' ? v.toLocaleString('ru-RU').replace(/[ ,]/g, ' ') : v;
      if (k < 1) requestAnimationFrame(st); })(t0);
  }), { threshold: .6 });
  $$('[data-count]').forEach(e => cio.observe(e));

  /* ---------- IQTIBOSLAR ---------- */
  const qr = $('#qRot'), qd = $('#qDots'); let qi = 0;
  QUOTES.forEach((q, i) => { const p = document.createElement('p'); p.textContent = q; qr.appendChild(p); const b = document.createElement('button'); b.setAttribute('aria-label', 'Iqtibos ' + (i + 1)); b.onclick = () => showQ(i, true); qd.appendChild(b); });
  let qt; const showQ = (i, user) => { qi = i; $$('p', qr).forEach((p, j) => p.classList.toggle('on', j === i)); $$('button', qd).forEach((b, j) => b.classList.toggle('on', j === i)); clearTimeout(qt); qt = setTimeout(() => showQ((qi + 1) % QUOTES.length), user ? 7000 : 4200); };
  showQ(0);

  /* ---------- AKSIYA ---------- */
  const end = new Date(C.promoUntil).getTime();
  const cdB = $$('#cd b');
  (function cd() { let s = Math.max(0, Math.floor((end - Date.now()) / 1000)); const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    cdB.forEach((b, i) => b.textContent = String(v[i]).padStart(2, '0')); if (s <= 0) $('#aksiya').style.display = 'none'; else setTimeout(cd, 1000); })();

  /* ---------- VIDEOLAR ---------- */
  const reels = $('#reels');
  REELS.forEach(r => {
    const el = document.createElement('div'); el.className = 'reel hv'; el.style.setProperty('--poster', `url(assets/${r.f}.jpg)`);
    el.innerHTML = `<img src="assets/${r.f}.jpg" alt="${r.t}" loading="lazy"><video muted loop playsinline preload="none" data-src="assets/${r.f}.mp4"></video><div class="m"><b>${r.t}</b><span>♥ ${r.l}</span></div>`;
    el.onclick = () => openVid(r.f, r.c); reels.appendChild(el); vio.observe($('video', el));
  });
  $$('.good-vids figure').forEach(f => f.onclick = () => openVid(f.dataset.v, (REELS.find(r => r.f === f.dataset.v) || {}).c));
  function openVid(f, c) { const v = $('#lbv'); v.src = `assets/${f}.mp4`; $('#lbig').href = c ? `https://www.instagram.com/reel/${c}/` : C.instagram; openM('#lb'); v.play().catch(() => {}); }

  /* ---------- MODAL ---------- */
  function openM(id) { $(id).classList.add('on'); lenis && lenis.stop(); }
  function closeM() { $$('.modal').forEach(m => m.classList.remove('on')); $('#lbv').pause(); lenis && lenis.start(); }
  $$('[data-close]').forEach(b => b.onclick = closeM);
  $$('.modal').forEach(m => m.addEventListener('click', e => e.target === m && closeM()));
  addEventListener('keydown', e => e.key === 'Escape' && closeM());

  /* ---------- BUYURTMA ---------- */
  const F = $('#orderForm'); let qty = 2, geo = '';
  const mode = () => F.querySelector('[name=mode]:checked').value;
  const whole = () => mode().startsWith('Butun');
  function upd() {
    $('#qty').textContent = qty;
    $('#addrRow').hidden = mode() !== 'Dostavka';
    $('#eventRow').hidden = !whole(); $('#qtyRow').hidden = whole();
    $('#totLbl').textContent = whole() ? 'Narx' : `Jami (${qty} set)`;
    $('#total').textContent = whole() ? 'Kelishiladi' : som(qty * C.setPrice);
  }
  $$('.stepper button').forEach(b => b.onclick = () => { qty = Math.max(1, Math.min(99, qty + +b.dataset.d)); upd(); });
  $$('[name=mode]').forEach(r => r.onchange = upd);
  F.phone.addEventListener('input', e => {
    let d = e.target.value.replace(/\D/g, ''); if (!d.startsWith('998')) d = '998' + d; d = d.slice(0, 12);
    e.target.value = '+' + [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean).join(' ');
  });
  $('#geoBtn').onclick = () => {
    if (!navigator.geolocation) return toast('Joylashuv mavjud emas');
    $('#geoBtn').textContent = '⏳';
    navigator.geolocation.getCurrentPosition(p => { geo = `https://maps.google.com/?q=${p.coords.latitude.toFixed(6)},${p.coords.longitude.toFixed(6)}`; $('#geoBtn').textContent = '✓ Olindi'; },
      () => { $('#geoBtn').textContent = '📍 Joylashuv'; toast('Ruxsat berilmadi'); }, { enableHighAccuracy: true, timeout: 10000 });
  };
  try { const u = JSON.parse(localStorage.getItem('xm_user') || '{}'); ['name', 'phone', 'address'].forEach(k => u[k] && (F[k].value = u[k])); } catch (e) {}
  let text = '';
  F.addEventListener('submit', async e => {
    e.preventDefault(); $$('.bad', F).forEach(x => x.classList.remove('bad'));
    const bad = [];
    if (F.name.value.trim().length < 2) { bad.push('ism'); F.name.classList.add('bad'); }
    if (F.phone.value.replace(/\D/g, '').length !== 12) { bad.push('telefon'); F.phone.classList.add('bad'); }
    if (mode() === 'Dostavka' && F.address.value.trim().length < 4 && !geo) { bad.push('manzil'); F.address.classList.add('bad'); }
    if (whole() && !F.date.value) { bad.push('sana'); F.date.classList.add('bad'); }
    if (bad.length) { $('#err').textContent = 'Iltimos, to\'ldiring: ' + bad.join(', '); return; }
    $('#err').textContent = '';
    localStorage.setItem('xm_user', JSON.stringify({ name: F.name.value, phone: F.phone.value, address: F.address.value }));
    const no = '#' + String(Date.now()).slice(-5);
    text = [
      `🔥 Xasan Mochkichiri — ${whole() ? "qozon so'rovi" : 'buyurtma'} ${no}`,
      whole() ? `🍲 Butun qozon · sana: ${F.date.value} · mehmonlar: ${F.guests.value || '—'}` : `🍲 Moshkichiri set × ${qty} = ${som(qty * C.setPrice)}`,
      `📦 ${mode()}`,
      mode() === 'Dostavka' ? `📍 ${F.address.value.trim()}${geo ? '\n🗺 ' + geo : ''}` : '',
      `👤 ${F.name.value.trim()}, ${F.phone.value}`,
      F.note.value.trim() ? `📝 ${F.note.value.trim()}` : '',
    ].filter(Boolean).join('\n');
    let sent = false;
    if (C.orderEndpoint) try { sent = (await fetch(C.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ no, text }) })).ok; } catch (e) {}
    $('#doneTitle').textContent = sent ? 'Qabul qilindi!' : (whole() ? "So'rov tayyor!" : 'Buyurtma tayyor!');
    $('#doneMsg').textContent = sent ? 'Admin tez orada qo\'ng\'iroq qiladi. Hurmatdasiz!' : 'Oxirgi qadam — matnni Telegram orqali yuboring yoki qo\'ng\'iroq qiling:';
    $('#oText').textContent = text;
    $('#tgSend').style.display = sent ? 'none' : '';
    $('#tgSend').href = 'https://t.me/share/url?url=' + encodeURIComponent(C.instagram) + '&text=' + encodeURIComponent(text);
    openM('#done');
  });
  $('#copyBtn').onclick = async () => { try { await navigator.clipboard.writeText(text); toast('Nusxalandi ✓'); } catch (e) { toast('Nusxalab bo\'lmadi'); } };
  upd();

  /* ---------- XARITA ---------- */
  $('#mapFrame').src = `https://maps.google.com/maps?q=${encodeURIComponent(C.mapQuery)}&z=15&output=embed`;
  $('#routeBtn').href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(C.mapQuery)}`;

  /* ---------- Animatsiyalar ---------- */
  if (hasG) {
    $$('.head,.set-copy,.promo-copy,.promo-vid,.good-copy,.good-vids,.o-copy,.o-form,.contact-in>div,.q-in').forEach(el => el.classList.add('rv'));
    ScrollTrigger.batch('.rv', { start: 'top 88%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: mobile ? .9 : 1.2, ease: 'expo.out', stagger: .1, overwrite: true }) });
    gsap.to('.q-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.quotes', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.o-bg', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.order', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.set-img', { scale: .9, rotate: -2, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.set', start: 'top 70%' } });
  }

  /* ---------- Yuklash ---------- */
  let pr = 0; const bar = $('#ldbar'); const it = setInterval(() => { pr = Math.min(90, pr + Math.random() * 16); bar.style.width = pr + '%'; }, 140);
  const done = () => { clearInterval(it); bar.style.width = '100%'; setTimeout(() => { $('#loader').classList.add('out'); document.body.classList.add('ready'); hasG && ScrollTrigger.refresh(); }, 350); };
  addEventListener('scene-ready', done, { once: true }); setTimeout(done, 6000);
})();
