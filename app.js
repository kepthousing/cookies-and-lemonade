/* Cookies & Lemonade — local, no-build interactive website. */
(() => {
  'use strict';
  const config = window.BAKERY_CONFIG || {};
  const money = (n) => `${config.currencySymbol || '$'}${Number(n).toFixed(2)}`;
  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = document.getElementById('toast');
  let toastTimer;

  // Cookie names and descriptions from the business menu. Individual-cookie pricing was not supplied,
  // so the page only prices the box options shown in the business information.
  const FLAVORS = [
    { id: 'chocolate-chip', name: 'Chocolate Chip', description: 'The classic: soft, chewy, and loaded with chocolate chips.', detail: 'A familiar favorite made for a cozy afternoon or a box shared with friends.', badge: 'The classic', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=82', alt: 'Golden chocolate chip cookies' },
    { id: 'oatmeal-raisin', name: 'Oatmeal Raisin', description: 'Warm spices, real oats, and sweet raisins.', detail: 'A soft, homey cookie with a little chew and a comforting hint of spice.', badge: 'Cozy favorite', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=82', alt: 'A rustic batch of homemade cookies' },
    { id: 'red-velvet', name: 'Red Velvet', description: 'A rich, decadent favorite with a hint of cocoa.', detail: 'A cocoa-kissed cookie that brings a little extra color to an assorted box.', badge: 'A little indulgence', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=82', alt: 'Rich chocolate baked treats' },
    { id: 'sugar-cookie', name: 'Sugar Cookie', description: 'Buttery, soft, and perfectly sweet with a hint of vanilla.', detail: 'A cheerful vanilla favorite, just right for gifting and celebrations.', badge: 'Sweet & simple', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=82', alt: 'Colorful sweet bakery treats' }
  ];

  // Only the published listed prices from the supplied business info are used here.
  const OFFERS = [
    { id: 'dozen-box', kind: 'box', name: 'Dozen Box', price: 40, short: '12 cookies', detail: '12 cookies · mix and match flavors', badge: 'A dozen to share', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=850&q=82', alt: 'A stack of chocolate chip cookies' },
    { id: 'gift-box', kind: 'box', name: 'Gift Box', price: 45, short: '12 cookies · ribbon & card', detail: '12 cookies with ribbon and a card', badge: 'Ready to gift', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=850&q=82', alt: 'A collection of homemade cookies' },
    { id: 'party-box', kind: 'box', name: 'Party Box', price: 76, short: '24 cookies', detail: '24 cookies · about $3.17 each', badge: 'For the get-together', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=850&q=82', alt: 'A batch of chocolate cookies ready to share' },
    { id: 'crowd-box', kind: 'box', name: 'Crowd Box', price: 144, short: '48 cookies', detail: '48 cookies · $3.00 each', badge: 'For a bigger bunch', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=850&q=82', alt: 'A table of assorted sweet treats' },
    { id: 'sample-box', kind: 'sample', name: 'Sample Box', price: null, short: 'A small tasting selection', detail: 'Selection, availability, and price confirmed by inquiry', badge: 'A little taste', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=850&q=82', alt: 'A small stack of homemade chocolate chip cookies' },
    { id: 'original-lemonade', kind: 'lemonade', name: 'Original Lemonade', price: 12, short: '1 gallon', detail: 'A fresh classic · $12 per gallon', badge: 'The original', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=500&q=82', alt: 'A refreshing citrus drink' },
    { id: 'cucumber-lemonade', kind: 'lemonade', name: 'Cucumber Lemonade', price: 14, short: '1 gallon', detail: 'Fresh cucumber and lemon · $14 per gallon', badge: 'Cool & fresh', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=500&q=82', alt: 'A fresh fruit drink' },
    { id: 'strawberry-lemonade', kind: 'lemonade', name: 'Strawberry Lemonade', price: 14, short: '1 gallon', detail: 'Strawberry and lemon · $14 per gallon', badge: 'Fruity favorite', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=500&q=82', alt: 'A summer drink with citrus' },
    { id: 'peach-lemonade', kind: 'lemonade', name: 'Peach Lemonade', price: 14, short: '1 gallon', detail: 'Peach and lemon · $14 per gallon', badge: 'Peachy keen', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=500&q=82', alt: 'A refreshing summer drink' }
  ];
  const cart = Object.create(null);
  const selectedFlavors = new Set();
  const productGrid = document.getElementById('product-grid');
  const lemonadeGrid = document.getElementById('lemonade-grid');
  const boxGrid = document.getElementById('box-grid');
  const orderSummary = document.getElementById('order-summary');
  const orderTotal = document.getElementById('order-total');
  const flavorSummary = document.getElementById('flavor-summary');
  const orderForm = document.getElementById('order-form');
  const orderResult = document.getElementById('order-result');
  const orderDraft = document.getElementById('order-draft');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  function configureSocial(id, url, label) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url && /^https?:\/\//i.test(url)) {
      el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; el.removeAttribute('aria-disabled');
    } else {
      el.href = '#contact'; el.setAttribute('aria-disabled', 'true');
      el.addEventListener('click', (event) => { event.preventDefault(); showToast(`Add your ${label} URL in config.js to connect this link.`); });
    }
  }

  function applyConfig() {
    const name = (config.bakeryName || 'Cookies & Lemonade').trim();
    const tagline = (config.tagline || 'Homemade Cookies • Fresh Lemonade').trim();
    document.querySelectorAll('[data-bakery-name]').forEach((el) => { el.textContent = name; });
    document.querySelectorAll('[data-tagline]').forEach((el) => { el.textContent = tagline; });
    document.querySelectorAll('[data-location]').forEach((el) => { el.textContent = config.location || 'Add your service area in config.js'; });
    document.querySelectorAll('[data-email]').forEach((el) => {
      if (config.email) { el.textContent = config.email; el.href = `mailto:${config.email}`; }
      else { el.textContent = 'Add your email in config.js'; el.href = '#contact'; }
    });
    document.querySelectorAll('[data-phone]').forEach((el) => {
      if (config.phoneDisplay) { el.textContent = config.phoneDisplay; el.href = `tel:${config.phoneLink || config.phoneDisplay.replace(/[^+\d]/g, '')}`; }
      else { el.textContent = 'Add your phone in config.js'; el.removeAttribute('href'); }
    });
    document.title = `${name} — Little batches, fresh sips`;
    document.getElementById('current-year').textContent = String(new Date().getFullYear());
    configureSocial('instagram-link', config.instagramUrl, 'Instagram');
    configureSocial('tiktok-link', config.tiktokUrl, 'TikTok');
    document.querySelectorAll('.js-order-link').forEach((link) => {
      if (config.orderUrl && /^https?:\/\//i.test(config.orderUrl)) { link.href = config.orderUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else { link.href = '#order'; link.removeAttribute('target'); link.removeAttribute('rel'); }
    });
  }

  function renderFlavors() {
    productGrid.innerHTML = FLAVORS.map((f, index) => `
      <article class="product-card reveal" data-card-id="${f.id}">
        <div class="product-image-wrap"><img src="${f.image}" alt="${esc(f.alt)}" loading="lazy"><span class="product-ribbon">${esc(f.badge)}</span></div>
        <div class="product-meta"><div class="product-topline"><h3>${esc(f.name)}</h3><span class="product-price">Box menu</span></div><p class="product-description">${esc(f.description)}</p>
          <button class="details-toggle" type="button" aria-expanded="false" aria-controls="detail-${f.id}" data-details="${f.id}"><span>Peek inside</span><span aria-hidden="true">＋</span></button>
          <div class="product-details" id="detail-${f.id}" hidden><p>${esc(f.detail)}</p></div></div>
        <div class="product-footer"><button class="add-button flavor-select" type="button" data-flavor="${f.id}" aria-pressed="false">Choose flavor <span aria-hidden="true">♡</span></button><span class="product-quantity" data-flavor-selected="${f.id}" hidden>In your mix</span></div>
      </article>`).join('');
    observeReveals(productGrid);
    bindImageFallbacks(productGrid);
  }

  function renderLemonade() {
    const lemonOffers = OFFERS.filter((o) => o.kind === 'lemonade');
    lemonadeGrid.innerHTML = lemonOffers.map((o) => `
      <article class="lemonade-card reveal"><img src="${o.image}" alt="${esc(o.alt)}" loading="lazy"><div class="lemonade-card-copy"><h3>${esc(o.name)}</h3><p>${esc(o.short)}</p><strong>${money(o.price)} <small>/ gallon</small></strong><button class="add-button" type="button" data-offer="${o.id}">Add gallon <span aria-hidden="true">＋</span></button></div></article>`).join('');
    observeReveals(lemonadeGrid);
    bindImageFallbacks(lemonadeGrid);
  }

  function renderBoxes() {
    const boxOffers = OFFERS.filter((o) => o.kind === 'box');
    boxGrid.innerHTML = boxOffers.map((o) => `
      <article class="box-card reveal"><div class="box-photo"><img src="${o.image}" alt="${esc(o.alt)}" loading="lazy"><span>${esc(o.badge)}</span></div><h3>${esc(o.name)}</h3><p>${esc(o.short)}</p><div class="box-card-bottom"><strong>${money(o.price)}</strong><button class="button button-primary button-small" type="button" data-offer="${o.id}">Add box <span aria-hidden="true">＋</span></button></div><p class="box-detail">${esc(o.detail)}</p></article>`).join('');
    observeReveals(boxGrid);
    bindImageFallbacks(boxGrid);
  }

  function offerById(id) { return OFFERS.find((o) => o.id === id); }
  function setQuantity(id, quantity) {
    const offer = offerById(id); if (!offer) return;
    const next = Math.max(0, Math.min(99, Number(quantity) || 0));
    if (next) cart[id] = next; else delete cart[id];
    updateCart();
  }
  function addOffer(id) {
    const offer = offerById(id); if (!offer) return;
    setQuantity(id, (cart[id] || 0) + 1);
    showToast(`${offer.name} added to your inquiry ♡`);
    if (offer.kind === 'box' || offer.kind === 'sample') document.getElementById('order-summary').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  function updateCart() {
    const chosen = OFFERS.filter((o) => cart[o.id] > 0);
    if (!chosen.length) {
      orderSummary.innerHTML = '<p class="empty-basket">Your order is waiting for something sweet. Add a cookie box or a gallon of lemonade above.</p>';
    } else {
      orderSummary.innerHTML = chosen.map((o) => `
        <div class="summary-item"><div><div class="summary-item-name">${esc(o.name)}</div><div class="summary-item-price">${o.price == null ? `Price confirmed by inquiry · ${esc(o.short)}` : `${money(o.price)} each · ${esc(o.short)}`}</div></div>
        <div class="quantity-control" aria-label="Quantity of ${esc(o.name)}"><button type="button" data-decrease="${o.id}" aria-label="Remove one ${esc(o.name)}">−</button><output>${cart[o.id]}</output><button type="button" data-increase="${o.id}" aria-label="Add one ${esc(o.name)}">+</button></div><div class="summary-line-total">${o.price == null ? 'Quote' : money(o.price * cart[o.id])}</div></div>`).join('');
    }
    const subtotal = chosen.reduce((sum, o) => sum + (o.price == null ? 0 : o.price * cart[o.id]), 0);
    orderTotal.textContent = money(subtotal);
    flavorSummary.hidden = selectedFlavors.size === 0;
    flavorSummary.innerHTML = selectedFlavors.size ? `<strong>Flavor preferences</strong><p>${FLAVORS.filter((f) => selectedFlavors.has(f.id)).map((f) => esc(f.name)).join(', ')}</p>` : '';
    chosen.forEach((o) => { const trigger = document.querySelector(`[data-offer="${o.id}"]`); if (trigger) { trigger.setAttribute('aria-label', `${o.name} selected ${cart[o.id]} time${cart[o.id] === 1 ? '' : 's'}`); } });
    orderSummary.querySelectorAll('[data-increase]').forEach((btn) => btn.addEventListener('click', () => setQuantity(btn.dataset.increase, (cart[btn.dataset.increase] || 0) + 1)));
    orderSummary.querySelectorAll('[data-decrease]').forEach((btn) => btn.addEventListener('click', () => setQuantity(btn.dataset.decrease, (cart[btn.dataset.decrease] || 0) - 1)));
  }

  function setupProductInteractions() {
    document.body.addEventListener('click', (event) => {
      const offerButton = event.target.closest('[data-offer]');
      if (offerButton) { addOffer(offerButton.dataset.offer); return; }
      const flavorButton = event.target.closest('[data-flavor]');
      if (flavorButton) {
        const id = flavorButton.dataset.flavor;
        if (selectedFlavors.has(id)) selectedFlavors.delete(id); else selectedFlavors.add(id);
        const selected = selectedFlavors.has(id);
        flavorButton.setAttribute('aria-pressed', String(selected));
        flavorButton.classList.toggle('is-selected', selected);
        flavorButton.innerHTML = selected ? 'Flavor selected <span aria-hidden="true">✓</span>' : 'Choose flavor <span aria-hidden="true">♡</span>';
        const count = document.querySelector(`[data-flavor-selected="${id}"]`); if (count) count.hidden = !selected;
        updateCart();
        showToast(`${selected ? 'Added' : 'Removed'} ${FLAVORS.find((f) => f.id === id).name} ${selected ? 'to' : 'from'} your flavor preferences.`);
        return;
      }
      const detailsButton = event.target.closest('[data-details]');
      if (detailsButton) {
        const panel = document.getElementById(`detail-${detailsButton.dataset.details}`);
        const open = detailsButton.getAttribute('aria-expanded') !== 'true';
        detailsButton.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
        detailsButton.querySelector('span:first-child').textContent = open ? 'A little less' : 'Peek inside';
        return;
      }
      const galleryButton = event.target.closest('[data-image]');
      if (galleryButton && galleryButton.classList.contains('gallery-tile')) openLightbox(galleryButton.dataset.image, galleryButton.dataset.caption || '', galleryButton.querySelector('img')?.alt || '');
    });
  }

  function buildOrderDraft(formData) {
    const chosen = OFFERS.filter((o) => cart[o.id] > 0);
    const subtotal = chosen.reduce((sum, o) => sum + (o.price == null ? 0 : o.price * cart[o.id]), 0);
    const picked = chosen.length ? chosen.map((o) => o.price == null ? `- ${o.name} × ${cart[o.id]} — price to be confirmed by inquiry` : `- ${o.name} × ${cart[o.id]} — ${money(o.price * cart[o.id])}`).join('\n') : '- No listed-price items selected yet; please discuss a quote.';
    const flavors = FLAVORS.filter((f) => selectedFlavors.has(f.id)).map((f) => f.name).join(', ') || 'Not specified yet';
    return [
      `Order inquiry — ${config.bakeryName || 'Cookies & Lemonade'}`,
      '',
      `Name: ${formData.get('name') || ''}`,
      `Phone: ${formData.get('phone') || ''}`,
      `Email: ${formData.get('email') || 'Not provided'}`,
      `Type of order: ${formData.get('orderType') || 'Not selected'}`,
      `Date needed: ${formData.get('date') || 'To be discussed'}`,
      `Pickup / delivery details: ${formData.get('service') || 'To be discussed'}`,
      '', 'ITEMS REQUESTED', picked,
      '', `Cookie flavor preferences: ${flavors}`,
      `Listed-price subtotal: ${money(subtotal)}`,
      '(Prices are the listed menu prices only. Availability, delivery details, taxes, catering/custom quotes, and payment are confirmed separately.)',
      '', `Additional details: ${formData.get('notes') || 'None added'}`,
      '', 'Please let me know availability and next steps. Thank you!'
    ].join('\n');
  }

  function setupOrderForm() {
    const dateInput = document.getElementById('pickup-date');
    const now = new Date();
    dateInput.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(orderForm);
      orderDraft.value = buildOrderDraft(formData);
      orderForm.hidden = true; orderResult.hidden = false;
      document.getElementById('result-message').textContent = 'Review the inquiry below, then copy it or open a prefilled email draft. Nothing has been sent yet.';
      orderResult.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    });
    document.getElementById('copy-order').addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(orderDraft.value);
        else { orderDraft.focus(); orderDraft.select(); document.execCommand('copy'); }
        showToast('Inquiry copied. Nothing has been sent.');
      } catch (err) { orderDraft.focus(); orderDraft.select(); showToast('Inquiry selected — use Copy to save it.'); }
    });
    document.getElementById('open-email').addEventListener('click', () => {
      if (!config.email) { showToast('Add your business email in config.js first.'); return; }
      const subject = `Cookies & Lemonade order inquiry from ${document.getElementById('customer-name').value}`;
      window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderDraft.value)}`;
    });
    document.getElementById('edit-order').addEventListener('click', () => {
      orderResult.hidden = true; orderForm.hidden = false;
      orderForm.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  function bindImageFallbacks(root = document) {
    root.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', () => {
        if (!img.src.endsWith('cookie-placeholder.svg')) { img.src = 'assets/cookie-placeholder.svg'; img.classList.add('is-fallback'); }
      }, { once: true });
    });
  }

  function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-nav');
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation menu'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu'); nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { close(); closeLightbox(); } });
    document.addEventListener('click', (event) => { if (window.innerWidth <= 760 && nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) close(); });
  }

  function observeReveals(root = document) {
    const nodes = root.querySelectorAll('.reveal:not([data-reveal-bound])');
    if (!nodes.length) return;
    nodes.forEach((n) => n.setAttribute('data-reveal-bound', 'true'));
    if (reducedMotion() || !('IntersectionObserver' in window)) { nodes.forEach((n) => n.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries, obs) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } }), { rootMargin: '0px 0px -45px 0px', threshold: 0.07 });
    nodes.forEach((n) => observer.observe(n));
  }

  function setupParallax() {
    const art = document.querySelector('[data-parallax]');
    if (!art || reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    art.addEventListener('pointermove', (event) => {
      const rect = art.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5;
      art.style.setProperty('--parallax-x', `${(x * 7).toFixed(1)}px`); art.style.setProperty('--parallax-y', `${(y * 7).toFixed(1)}px`);
    });
    art.addEventListener('pointerleave', () => { art.style.setProperty('--parallax-x', '0px'); art.style.setProperty('--parallax-y', '0px'); });
  }

  const lightbox = document.getElementById('lightbox');
  function openLightbox(src, caption, alt) {
    document.getElementById('lightbox-image').src = src; document.getElementById('lightbox-image').alt = alt || caption;
    document.getElementById('lightbox-caption').textContent = caption;
    lightbox.hidden = false; document.body.classList.add('lightbox-open'); document.querySelector('.lightbox-close').focus();
  }
  function closeLightbox() { if (!lightbox || lightbox.hidden) return; lightbox.hidden = true; document.body.classList.remove('lightbox-open'); document.getElementById('lightbox-image').src = ''; }
  function setupLightbox() {
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  }

  function init() {
    document.documentElement.classList.add('js-ready');
    applyConfig(); renderFlavors(); renderLemonade(); renderBoxes(); bindImageFallbacks();
    updateCart(); setupProductInteractions(); setupOrderForm(); setupMobileMenu(); setupParallax(); setupLightbox(); observeReveals();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
