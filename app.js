(() => {
  'use strict';

  const WHATSAPP_NUMBER = '919846117875';
  const GST_NO = '322600029741ESJ';
  const UPI_ID = 'travyn@upi';
  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const COLORS = ['Black', 'White', 'Red', 'Beige', 'Lavender', 'Navy Blue'];

  const starterCategories = [
    { id: 'oversized', name: 'Oversized T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop' },
    { id: 'blackdrop', name: 'Black Drop', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop' },
    { id: 'streetwear', name: 'Streetwear Essentials', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop' }
  ];

  const starterHome = {
    eyebrow: 'Kerala Premium Streetwear',
    title: 'Oversized tees with a luxury black & white identity.',
    description: 'Mobile-first ecommerce demo for Travyn with product panels, admin controls, cart, GST bill format, UPI note and WhatsApp order integration.',
    primaryButton: 'Shop Now',
    secondaryButton: 'Admin Login',
    image: '',
    brandText: 'TRAVYN',
    smallText: 'OVERSIZED DROP'
  };

  const starterSeo = {
    title: 'TRAVYN | Premium Oversized Streetwear',
    description: 'Shop Travyn premium oversized t-shirts in Kerala with GST invoice, UPI payment and WhatsApp checkout.',
    keywords: 'Travyn, oversized t shirt Kerala, premium streetwear India, GST invoice tshirt, Travyn.in',
    canonical: 'https://travyn.in/'
  };

  const starterProducts = [
    { id: 1, name: 'TRAVYN Core Oversized Tee', price: 649, category: 'oversized', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop'], description: 'Premium heavy cotton oversized t-shirt with clean luxury streetwear fitting.' },
    { id: 2, name: 'TRAVYN Black Drop Tee', price: 799, category: 'blackdrop', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop'], description: 'Dark premium tee for a minimal black streetwear outfit.' },
    { id: 3, name: 'TRAVYN Minimal White Tee', price: 699, category: 'streetwear', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop'], description: 'Minimal white oversized t-shirt for daily premium styling.' }
  ];

  const $ = (id) => document.getElementById(id);
  const fallbackImage = 'https://via.placeholder.com/900x1100/111111/ffffff?text=TRAVYN';
  let heroContent = load('travyn_home_content_fixed', starterHome);
  let seoContent = load('travyn_seo_content_fixed', starterSeo);
  let categories = load('travyn_categories_fixed', starterCategories);
  let products = load('travyn_products_fixed', starterProducts);
  let cart = load('travyn_cart_fixed', []);
  let orders = load('travyn_orders_fixed', []);
  let reviews = load('travyn_reviews_fixed', []);
  let users = load('travyn_users_fixed', []);
  let notifications = load('travyn_notifications_fixed', []);
  let currentUser = load('travyn_current_user_fixed', null);
  let pendingUserAction = null;
  let visitors = Number(localStorage.getItem('travyn_visitors_fixed') || 0);
  let currentProduct = null;
  let selectedSize = 'L';
  let selectedColor = 'Black';
  let selectedQty = 1;
  let adminToken = localStorage.getItem('travyn_admin_token') || '';
  let isAdminSession = false;
  let lastRemoteUpdatedAt = '';

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function getStoreData() {
    return { heroContent, seoContent, categories, products, orders, reviews, users, notifications, visitors, updatedAt: new Date().toISOString() };
  }

  function applyStoreData(data = {}) {
    heroContent = data.heroContent || heroContent || starterHome;
    seoContent = data.seoContent || seoContent || starterSeo;
    categories = Array.isArray(data.categories) ? data.categories : categories;
    products = Array.isArray(data.products) ? data.products : products;
    orders = Array.isArray(data.orders) ? data.orders : orders;
    reviews = Array.isArray(data.reviews) ? data.reviews : reviews;
    users = Array.isArray(data.users) ? data.users : users;
    notifications = Array.isArray(data.notifications) ? data.notifications : notifications;
    visitors = Number(data.visitors ?? visitors ?? 0);
    if (data.updatedAt) lastRemoteUpdatedAt = data.updatedAt;
    localOnlyPersist();
  }

  function localOnlyPersist() {
    localStorage.setItem('travyn_home_content_fixed', JSON.stringify(heroContent));
    localStorage.setItem('travyn_seo_content_fixed', JSON.stringify(seoContent));
    localStorage.setItem('travyn_categories_fixed', JSON.stringify(categories));
    localStorage.setItem('travyn_products_fixed', JSON.stringify(products));
    localStorage.setItem('travyn_orders_fixed', JSON.stringify(orders));
    localStorage.setItem('travyn_reviews_fixed', JSON.stringify(reviews));
    localStorage.setItem('travyn_visitors_fixed', String(visitors));
    localStorage.setItem('travyn_users_fixed', JSON.stringify(users));
    localStorage.setItem('travyn_notifications_fixed', JSON.stringify(notifications));
    localStorage.setItem('travyn_current_user_fixed', JSON.stringify(currentUser));
    localStorage.setItem('travyn_cart_fixed', JSON.stringify(cart));
  }

  async function persist() {
    localOnlyPersist();
    if (!isAdminSession || !adminToken) return;
    try {
      const res = await fetch('/api/admin/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(getStoreData())
      });
      if (res.status === 401) {
        adminToken = '';
        isAdminSession = false;
        localStorage.removeItem('travyn_admin_token');
        throw new Error('Admin session expired. Please login again.');
      }
      if (!res.ok) throw new Error((await res.json()).error || 'Database save failed');
      const saved = await res.json();
      if (saved.updatedAt) lastRemoteUpdatedAt = saved.updatedAt;
    } catch (error) {
      console.warn('MongoDB save failed:', error.message);
      if (isAdminSession) showToast(error.message);
    }
  }

  async function loadRemoteStore() {
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load MongoDB store');
      const data = await res.json();
      if (data && data.updatedAt && data.updatedAt !== lastRemoteUpdatedAt) {
        applyStoreData(data);
        renderHomeContent(); applySeoContent(); renderCategories(); renderProducts(); renderHomeReviews(); renderAdmin(); renderCart(); updateCartCount(); updateUserButton();
        if (currentProduct) renderProductReviews(currentProduct.id);
      }
    } catch (error) {
      console.warn('MongoDB load failed:', error.message);
    }
  }

  async function pollRemoteStore() {
    if (document.hidden) return;
    await loadRemoteStore();
  }

  async function loginAdminRemote(username, password) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.error || 'Wrong username or password');
    adminToken = data.token;
    isAdminSession = true;
    localStorage.setItem('travyn_admin_token', adminToken);
    await loadRemoteStore();
  }


  function showToast(message) {
    const text = String(message || 'Done');
    let toast = document.getElementById('travynToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'travynToast';
      toast.style.position = 'fixed';
      toast.style.right = '22px';
      toast.style.bottom = '22px';
      toast.style.zIndex = '99999';
      toast.style.maxWidth = '360px';
      toast.style.padding = '14px 18px';
      toast.style.borderRadius = '18px';
      toast.style.background = '#fff';
      toast.style.color = '#000';
      toast.style.border = '1px solid rgba(255,255,255,.25)';
      toast.style.boxShadow = '0 20px 60px rgba(0,0,0,.45)';
      toast.style.fontWeight = '800';
      toast.style.transition = 'opacity .25s ease, transform .25s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(window.__travynToastTimer);
    window.__travynToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2800);
  }

  function money(amount) { return '₹' + Math.round(Number(amount || 0)).toLocaleString('en-IN'); }
  function productColors(product) { return (product.colors && product.colors.length ? product.colors : COLORS).filter(Boolean); }
  function discountAmount(product) { return Math.max(0, Number(product.discount || 0)); }
  function finalPrice(product) { return Math.max(0, Number(product.price || 0) - discountAmount(product)); }
  function shippingAmount(product) { return Math.max(0, Number(product.shipping || 0)); }
  function stockAmount(product) { return Number(product.stock ?? 50); }
  function slug(text) { return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'category'; }
  function getImages(product) { return [product.image, ...(product.images || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i); }
  function normColorName(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function colorImageMap(product) {
    const map = {};
    if (!product) return map;
    if (product.colorImages && typeof product.colorImages === 'object') {
      Object.keys(product.colorImages).forEach(key => { if (product.colorImages[key]) map[normColorName(key)] = product.colorImages[key]; });
    }
    if (!Object.keys(map).length) {
      const colors = productColors(product);
      const imgs = getImages(product);
      colors.forEach((color, index) => { if (imgs[index]) map[normColorName(color)] = imgs[index]; });
    }
    return map;
  }
  function imageForColor(product, color) {
    const map = colorImageMap(product);
    return map[normColorName(color)] || product?.image || getImages(product)[0] || fallbackImage;
  }
  function parseColorImages(value) {
    const map = {};
    String(value || '').split(',').map(x => x.trim()).filter(Boolean).forEach(pair => {
      const parts = pair.split('=');
      if (parts.length >= 2) {
        const key = parts.shift().trim();
        const url = parts.join('=').trim();
        if (key && url) map[key] = url;
      }
    });
    return map;
  }
  function colorImagesToText(product) {
    return Object.entries(product?.colorImages || {}).map(([color, url]) => `${color}=${url}`).join(', ');
  }
  function safeText(text) { return String(text || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c])); }
  function shortText(text, limit = 155) { const value = String(text || 'Premium Travyn product.'); return value.length > limit ? value.slice(0, limit).trim() + '...' : value; }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadImageToCloudinary(file) {
    if (!file) return '';
    if (!file.type || !file.type.startsWith('image/')) throw new Error('Please select an image file');
    const fd = new FormData();
    fd.append('image', file);
    const uploadEndpoint = location.protocol === 'file:' ? 'http://localhost:3000/api/upload' : '/api/upload';
    try {
      const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) return data.url;
      throw new Error(data.error || 'Cloudinary upload failed');
    } catch (error) {
      console.warn('Cloudinary upload unavailable, using local browser image:', error.message);
      showToast('Image saved locally for preview. For real Cloudinary upload run START-WEBSITE.bat and open http://localhost:3000');
      return await fileToDataURL(file);
    }
  }

  async function uploadMultipleImages(files) {
    const urls = [];
    for (const file of Array.from(files || [])) urls.push(await uploadImageToCloudinary(file));
    return urls;
  }


  function renderHomeContent() {
    if ($('heroEyebrowText')) $('heroEyebrowText').textContent = heroContent.eyebrow || starterHome.eyebrow;
    if ($('heroTitleText')) $('heroTitleText').textContent = heroContent.title || starterHome.title;
    if ($('heroDescriptionText')) $('heroDescriptionText').textContent = heroContent.description || starterHome.description;
    const primary = document.querySelector('.hero .btn.primary');
    const secondary = $('heroAdminLoginBtn');
    if (primary) primary.textContent = heroContent.primaryButton || starterHome.primaryButton;
    if (secondary) secondary.textContent = heroContent.secondaryButton || starterHome.secondaryButton;
    if ($('heroImageBrandText')) $('heroImageBrandText').textContent = heroContent.brandText || starterHome.brandText;
    if ($('heroImageSmallText')) $('heroImageSmallText').textContent = heroContent.smallText || starterHome.smallText;
    const img = $('heroImagePreview');
    if (img) {
      if (heroContent.image) { img.src = heroContent.image; img.classList.remove('hidden'); $('heroMockShirt')?.classList.add('has-image'); }
      else { img.removeAttribute('src'); img.classList.add('hidden'); $('heroMockShirt')?.classList.remove('has-image'); }
    }
    fillHomeEditor();
  }

  function applySeoContent() {
    document.title = seoContent.title || starterSeo.title;
    const desc = document.querySelector('meta[name="description"]');
    const keys = document.querySelector('meta[name="keywords"]');
    const canonical = document.getElementById('canonicalLink');
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDescription');
    if (desc) desc.setAttribute('content', seoContent.description || starterSeo.description);
    if (keys) keys.setAttribute('content', seoContent.keywords || starterSeo.keywords);
    if (canonical) canonical.setAttribute('href', seoContent.canonical || starterSeo.canonical);
    if (ogTitle) ogTitle.setAttribute('content', seoContent.title || starterSeo.title);
    if (ogDesc) ogDesc.setAttribute('content', seoContent.description || starterSeo.description);
    fillSeoEditor();
  }

  function fillSeoEditor() {
    if ($('seoTitleInput')) $('seoTitleInput').value = seoContent.title || '';
    if ($('seoDescriptionInput')) $('seoDescriptionInput').value = seoContent.description || '';
    if ($('seoKeywordsInput')) $('seoKeywordsInput').value = seoContent.keywords || '';
    if ($('seoCanonicalInput')) $('seoCanonicalInput').value = seoContent.canonical || '';
    if ($('seoPreviewTitle')) $('seoPreviewTitle').textContent = seoContent.title || starterSeo.title;
    if ($('seoPreviewUrl')) $('seoPreviewUrl').textContent = seoContent.canonical || starterSeo.canonical;
    if ($('seoPreviewDescription')) $('seoPreviewDescription').textContent = seoContent.description || starterSeo.description;
  }

  function saveSeoContent() {
    seoContent = {
      title: $('seoTitleInput')?.value.trim() || starterSeo.title,
      description: $('seoDescriptionInput')?.value.trim() || starterSeo.description,
      keywords: $('seoKeywordsInput')?.value.trim() || starterSeo.keywords,
      canonical: $('seoCanonicalInput')?.value.trim() || starterSeo.canonical
    };
    persist(); applySeoContent(); alert('SEO setup saved. This panel is visible only to admin.');
  }

  function resetSeoContent() {
    if (!confirm('Reset SEO settings?')) return;
    seoContent = { ...starterSeo };
    persist(); applySeoContent();
  }

  function fillHomeEditor() {
    if ($('homeEyebrowInput')) $('homeEyebrowInput').value = heroContent.eyebrow || '';
    if ($('homeTitleInput')) $('homeTitleInput').value = heroContent.title || '';
    if ($('homeDescriptionInput')) $('homeDescriptionInput').value = heroContent.description || '';
    if ($('homePrimaryButtonInput')) $('homePrimaryButtonInput').value = heroContent.primaryButton || '';
    if ($('homeSecondaryButtonInput')) $('homeSecondaryButtonInput').value = heroContent.secondaryButton || '';
    if ($('homeImageUrlInput')) $('homeImageUrlInput').value = heroContent.image && !String(heroContent.image).startsWith('data:') ? heroContent.image : '';
  }

  function saveHomeContent() {
    heroContent = {
      ...heroContent,
      eyebrow: $('homeEyebrowInput')?.value.trim() || starterHome.eyebrow,
      title: $('homeTitleInput')?.value.trim() || starterHome.title,
      description: $('homeDescriptionInput')?.value.trim() || starterHome.description,
      primaryButton: $('homePrimaryButtonInput')?.value.trim() || starterHome.primaryButton,
      secondaryButton: $('homeSecondaryButtonInput')?.value.trim() || starterHome.secondaryButton,
      image: $('homeImageUrlInput')?.value.trim() || heroContent.image || ''
    };
    persist(); renderHomeContent(); alert('Homepage updated successfully.');
  }

  function resetHomeContent() {
    if (!confirm('Reset homepage hero to default?')) return;
    heroContent = { ...starterHome };
    persist(); renderHomeContent();
  }

  async function handleHomeImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      heroContent.image = await uploadImageToCloudinary(file);
      if ($('homeImageUrlInput')) $('homeImageUrlInput').value = heroContent.image;
      persist(); renderHomeContent();
      alert('Hero image uploaded to Cloudinary.');
    } catch (err) {
      alert(err.message);
    }
  }


  function updateUserButton() {
    const btn = $('openUserLoginBtn');
    if (btn) btn.textContent = currentUser ? (currentUser.name || 'My Account') : 'User Login';
    updateNotificationBadge();
  }

  function userNotifications() {
    if (!currentUser) return [];
    return notifications.filter(n => !n.userId || String(n.userId) === String(currentUser.id));
  }

  function unreadNotifications() {
    return userNotifications().filter(n => !(n.readBy || []).includes(String(currentUser?.id))).length;
  }

  function updateNotificationBadge() {
    const badge = $('userNotificationBadge');
    if (!badge) return;
    const count = unreadNotifications();
    badge.textContent = count;
    badge.classList.toggle('hidden-badge', count === 0);
  }

  function isUserLoggedIn() { return !!(currentUser && (currentUser.phone || currentUser.email)); }

  function openUserAuth(reason = 'Please login or register to continue.', afterLogin = null) {
    pendingUserAction = afterLogin;
    if ($('userAuthNote')) $('userAuthNote').textContent = reason;
    $('userAuthOverlay')?.classList.remove('hidden');
    $('userAuthOverlay')?.setAttribute('aria-hidden', 'false');
    showUserLogin();
  }

  function closeUserAuth() {
    $('userAuthOverlay')?.classList.add('hidden');
    $('userAuthOverlay')?.setAttribute('aria-hidden', 'true');
  }

  function showUserLogin() {
    $('userLoginForm')?.classList.remove('hidden');
    $('userRegisterForm')?.classList.add('hidden');
    $('showUserLoginBtn')?.classList.add('active');
    $('showUserRegisterBtn')?.classList.remove('active');
    if ($('userAuthTitle')) $('userAuthTitle').textContent = 'User Login';
  }

  function showUserRegister() {
    $('userLoginForm')?.classList.add('hidden');
    $('userRegisterForm')?.classList.remove('hidden');
    $('showUserLoginBtn')?.classList.remove('active');
    $('showUserRegisterBtn')?.classList.add('active');
    if ($('userAuthTitle')) $('userAuthTitle').textContent = 'Create Account';
  }

  function finishUserLogin(user) {
    currentUser = { id: user.id, name: user.name, phone: user.phone, email: user.email, address: user.address || '', pin: user.pin || '' };
    persist();
    updateUserButton();
    closeUserAuth();
    const action = pendingUserAction;
    pendingUserAction = null;
    if (typeof action === 'function') action();
  }

  function userLogin() {
    const loginId = $('loginUserPhone')?.value.trim().toLowerCase();
    const pass = $('loginUserPassword')?.value || '';
    const user = users.find(u => (String(u.phone || '').toLowerCase() === loginId || String(u.email || '').toLowerCase() === loginId) && u.password === pass);
    if (!user) { alert('Account not found. Please register first or check password.'); return; }
    finishUserLogin(user);
  }

  function userRegister() {
    const name = $('registerUserName')?.value.trim();
    const phone = $('registerUserPhone')?.value.trim();
    const email = $('registerUserEmail')?.value.trim().toLowerCase();
    const address = $('registerUserAddress')?.value.trim();
    const pin = $('registerUserPin')?.value.trim();
    const pass = $('registerUserPassword')?.value || '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !phone || !email || !emailOk || !address || !pin || pass.length < 4) { alert('Enter name, phone number, valid email, full address, pin code and minimum 4 character password.'); return; }
    if (users.some(u => String(u.phone || '').toLowerCase() === phone.toLowerCase() || String(u.email || '').toLowerCase() === email)) { alert('This phone number or email already exists. Please login.'); showUserLogin(); return; }
    const user = { id: Date.now(), name, phone, email, address, pin, password: pass, createdAt: new Date().toLocaleString('en-IN') };
    users.unshift(user);
    finishUserLogin(user);
  }

  function requireUser(reason, action) {
    if (isUserLoggedIn()) { action(); return; }
    openUserAuth(reason, action);
  }

  function renderCategories() {
    $('categoryGrid').innerHTML = categories.map(cat => `
      <button class="category-card" data-category-jump="${cat.id}" style="background-image:url('${cat.image || fallbackImage}')">
        <h3>${cat.name}</h3>
      </button>
    `).join('');

    $('categoryFilter').innerHTML = '<option value="all">All Products</option>' + categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    $('productCategory').innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  }

  function renderProducts() {
    const filter = $('categoryFilter').value || 'all';
    const visibleProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    $('productGrid').innerHTML = visibleProducts.length ? visibleProducts.map(product => `
      <article class="product-card">
        <img src="${product.image || fallbackImage}" alt="${product.name}" onerror="this.src='${fallbackImage}'">
        <div class="product-body">
          <p class="eyebrow">TRAVYN</p>
          <h3>${product.name}</h3>
          <div class="card-desc-box" data-card-desc-box="${product.id}">
            <p class="muted card-product-desc" data-card-desc="${product.id}" data-full-desc="${safeText(product.description)}" data-short-desc="${safeText(shortText(product.description))}">${safeText(shortText(product.description))}</p>
            ${String(product.description || '').length > 155 ? `<button class="card-read-more" data-card-read-more="${product.id}" type="button">Read More</button>` : ''}
          </div>
          <h2>${discountAmount(product) ? `<span class=\"old-price\">${money(product.price)}</span> ${money(finalPrice(product))}` : money(product.price)}</h2>
          <p class="product-meta-line">Stock: ${stockAmount(product) || 'Out'} · Shipping: ${shippingAmount(product) ? money(shippingAmount(product)) : 'Free'}${discountAmount(product) ? ` · Discount ${money(discountAmount(product))}` : ''}</p>
          <div class="actions">
            <button class="btn primary" data-view-product="${product.id}">View Product</button>
            <button class="btn secondary" data-quick-cart="${product.id}">Add Cart</button>
          </div>
        </div>
      </article>
    `).join('') : '<p class="muted">No products in this category.</p>';
    updateCartCount();
  }



  function findFullCurrentUser() {
    if (!currentUser) return null;
    return users.find(u => String(u.id) === String(currentUser.id)) || users.find(u => (u.email && u.email === currentUser.email) || (u.phone && u.phone === currentUser.phone)) || currentUser;
  }

  function openProfile() {
    if (!isUserLoggedIn()) { openUserAuth('Please login or register to open your profile.'); return; }
    renderProfile();
    $('profileDrawer')?.classList.remove('hidden');
    switchProfileTab('profileEditTab');
  }

  function closeProfile() { $('profileDrawer')?.classList.add('hidden'); }

  function switchProfileTab(tabId) {
    document.querySelectorAll('.profile-tab-panel').forEach(panel => panel.classList.add('hidden'));
    const panel = $(tabId);
    if (panel) panel.classList.remove('hidden');
    document.querySelectorAll('[data-profile-tab]').forEach(btn => {
      const active = btn.dataset.profileTab === tabId;
      btn.classList.toggle('active', active);
      btn.classList.toggle('profile-inner-active', active && btn.closest('.profile-inner-menu'));
    });
    renderProfile();
  }

  function renderProfile() {
    const user = findFullCurrentUser();
    if (!user) return;
    if ($('profileAvatar')) $('profileAvatar').textContent = safeText((user.name || 'U').slice(0, 1).toUpperCase());
    if ($('profileAvatarLarge')) $('profileAvatarLarge').textContent = safeText((user.name || 'U').slice(0, 1).toUpperCase());
    if ($('profileNameText')) $('profileNameText').textContent = user.name || 'Customer';
    if ($('profileEmailText')) $('profileEmailText').textContent = user.email || 'No email';
    if ($('profilePhoneText')) $('profilePhoneText').textContent = user.phone || 'No phone';
    if ($('profileNameInput')) $('profileNameInput').value = user.name || '';
    if ($('profilePhoneInput')) $('profilePhoneInput').value = user.phone || '';
    if ($('profileEmailInput')) $('profileEmailInput').value = user.email || '';
    if ($('profileAddressInput')) $('profileAddressInput').value = user.address || '';
    if ($('profilePinInput')) $('profilePinInput').value = user.pin || '';
    if ($('profileDetailName')) $('profileDetailName').textContent = user.name || '-';
    if ($('profileDetailPhone')) $('profileDetailPhone').textContent = user.phone || '-';
    if ($('profileDetailEmail')) $('profileDetailEmail').textContent = user.email || '-';
    if ($('profileDetailAddress')) $('profileDetailAddress').textContent = user.address || '-';
    if ($('profileDetailPin')) $('profileDetailPin').textContent = user.pin || '-';
    if ($('profileNotificationList')) $('profileNotificationList').innerHTML = userNotifications().length ? userNotifications().map(n => `<div class="profile-order-card"><b>${safeText(n.title || 'Travyn update')}</b><p class="muted small">${safeText(n.message || '')}</p><small>${safeText(n.date || '')}</small></div>`).join('') : '<p class="muted">No notifications yet.</p>';

    if ($('profileCartList')) $('profileCartList').innerHTML = cart.length ? cart.map(item => `
      <div class="profile-product-row">
        <img src="${item.image || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="${safeText(item.name)}">
        <div><b>${safeText(item.name)}</b><p class="muted small">${safeText(item.size)} / ${safeText(item.color)} · Qty ${item.qty}</p><span>${money(Number(item.price) * Number(item.qty || 1))}</span></div>
      </div>
    `).join('') : '<p class="muted">No carted products yet.</p>';

    const myOrders = orders.filter(order => String(order.userId || '') === String(user.id || '') || (user.email && order.email === user.email) || (user.phone && order.phone === user.phone));
    if ($('profilePurchasedList')) $('profilePurchasedList').innerHTML = myOrders.length ? myOrders.map(order => `
      <div class="profile-order-card">
        <b>Order #${String(order.id).slice(-6)} · ${money(order.total || 0)}</b>
        <p class="muted small">${safeText(order.date || '')} · ${safeText(order.address || user.address || '')} · PIN ${safeText(order.pin || user.pin || '-')}</p>
        ${(order.items || []).map(item => `<div class="profile-product-row mini"><img src="${item.image || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="${safeText(item.name)}"><div><b>${safeText(item.name)}</b><p class="muted small">${safeText(item.size)} / ${safeText(item.color)} · Qty ${item.qty}</p></div></div>`).join('')}
      </div>
    `).join('') : '<p class="muted">No purchased products yet.</p>';
  }

  function saveProfile() {
    if (!isUserLoggedIn()) return;
    const name = $('profileNameInput')?.value.trim();
    const phone = $('profilePhoneInput')?.value.trim();
    const email = $('profileEmailInput')?.value.trim().toLowerCase();
    const address = $('profileAddressInput')?.value.trim();
    const pin = $('profilePinInput')?.value.trim();
    if (!name || !phone || !email || !address || !pin) { alert('Please fill name, address, phone, email and pin code.'); return; }
    const index = users.findIndex(u => String(u.id) === String(currentUser.id));
    if (index >= 0) users[index] = { ...users[index], name, phone, email, address, pin };
    currentUser = { ...(currentUser || {}), id: users[index]?.id || currentUser.id, name, phone, email, address, pin };
    persist(); updateUserButton(); renderProfile(); renderAdmin(); alert('Profile updated.');
  }

  function renderUserNotifications() {
    if (!$('userNotificationList')) return;
    if (!isUserLoggedIn()) {
      $('userNotificationList').innerHTML = '<p class="muted">Login to see your offers and new product alerts.</p>';
      updateNotificationBadge();
      return;
    }
    const list = userNotifications();
    $('userNotificationList').innerHTML = list.length ? list.map(n => `
      <article class="notification-card ${!(n.readBy || []).includes(String(currentUser.id)) ? 'unread' : ''}">
        <span>${n.type === 'offer' ? '🔥 OFFER' : n.type === 'new-product' ? '🛍 NEW PRODUCT' : '✨ DROP'}</span>
        <h4>${safeText(n.title)}</h4>
        <p>${safeText(n.message)}</p>
        <small>${safeText(n.date || '')}</small>
        ${n.link ? `<a href="${safeText(n.link)}" class="small-link">Open</a>` : ''}
      </article>
    `).join('') : '<p class="muted">No notifications yet.</p>';
    notifications = notifications.map(n => ({...n, readBy: Array.from(new Set([...(n.readBy || []), String(currentUser.id)]))}));
    persist();
    updateNotificationBadge();
  }

  function openNotifications() {
    if (!isUserLoggedIn()) { openUserAuth('Please login or register to see offer notifications.'); return; }
    $('notificationDrawer')?.classList.remove('hidden');
    renderUserNotifications();
  }

  function closeNotifications() { $('notificationDrawer')?.classList.add('hidden'); }

  function clearUserNotifications() {
    if (!currentUser) return;
    notifications = notifications.filter(n => n.userId && String(n.userId) !== String(currentUser.id));
    persist();
    renderUserNotifications();
    renderAdmin();
  }

  function sendBrowserNotification(title, message) {
    if (!$('notifyBrowserPopup')?.checked) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') new Notification(title, { body: message, icon: '' });
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') new Notification(title, { body: message, icon: '' });
      });
    }
  }



  function storeUrl() {
    return location.origin && location.origin !== 'null' ? location.origin + location.pathname : 'https://travyn.in';
  }

  function buildNotificationMessage(title, message, link) {
    const url = link && link.startsWith('http') ? link : storeUrl() + (link || '#shop');
    return `TRAVYN UPDATE\n\n${title}\n${message}\n\nShop now: ${url}`;
  }

  async function emailAllUsers(title, message, link) {
    const emailUsers = users.filter(u => u.email);
    const emails = emailUsers.map(u => u.email);
    if (!emails.length) { alert('No registered user email found.'); return false; }
    const body = buildNotificationMessage(title, message, link);

    // Real email sending needs the included Node.js backend.
    // Start it with: npm install && npm start, then open http://localhost:3000
    try {
      const res = await fetch('/api/send-notification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, subject: title, message: body })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Email failed');
      alert(`Email sent successfully to ${data.sent} registered user(s).`);
      return true;
    } catch (err) {
      console.warn('Backend email failed. Opening mail app fallback:', err);
      window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
      alert('Email server is not running or SMTP is not configured. I opened your email app as fallback. For automatic sending, run the included Node server and add SMTP details in .env.');
      return false;
    }
  }

  function whatsappUser(phone, title, message, link) {
    if (!phone) { alert('This user has no phone number.'); return; }
    const cleanPhone = String(phone).replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    const body = buildNotificationMessage(title, message, link);
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(body)}`, '_blank');
  }

  function whatsappAllUsers(title, message, link) {
    const phoneUsers = users.filter(u => u.phone);
    if (!phoneUsers.length) { alert('No registered user phone number found.'); return false; }
    phoneUsers.forEach((u, index) => setTimeout(() => whatsappUser(u.phone, title, message, link), index * 850));
    return true;
  }

  async function sendNotificationToRegisteredUsers(title, message, link) {
    let sentWhatsApp = false;
    let sentEmail = false;
    if ($('notifySendWhatsApp')?.checked) sentWhatsApp = whatsappAllUsers(title, message, link);
    if ($('notifySendEmail')?.checked) sentEmail = await emailAllUsers(title, message, link);
    if (sentWhatsApp || sentEmail) {
      alert('Notification process completed. WhatsApp chats may open separately; email sends automatically when backend SMTP is configured.');
    }
  }

  function latestNotice() { return notifications[0] || null; }

  function createNotification(type, title, message, link = '#shop', showPopup = true, autoSend = false) {
    if (!title || !message) { alert('Add notification title and message'); return; }
    const notice = { id: Date.now(), type, title, message, link, date: new Date().toLocaleString('en-IN'), readBy: [] };
    notifications.unshift(notice);
    persist();
    renderAdmin();
    updateNotificationBadge();
    if (showPopup && isUserLoggedIn()) sendBrowserNotification(title, message);
    if ($('lastShareActions')) { $('lastShareActions').classList.remove('hidden'); $('lastShareActions').dataset.title = title; $('lastShareActions').dataset.message = message; $('lastShareActions').dataset.link = link; }
    if (autoSend) sendNotificationToRegisteredUsers(title, message, link);
    else alert('Notification saved. Use WhatsApp All / Email All to send it to registered users.');
  }

  function sendAdminNotification() {
    createNotification($('notifyType')?.value || 'offer', $('notifyTitle')?.value.trim(), $('notifyMessage')?.value.trim(), $('notifyLink')?.value.trim() || '#shop', true, true);
    if ($('notifyTitle')) $('notifyTitle').value = '';
    if ($('notifyMessage')) $('notifyMessage').value = '';
  }

  function sendNewProductTemplate() {
    const product = products[0];
    const title = product ? `New Product: ${product.name}` : 'New Travyn Product Live';
    const message = product ? `${product.name} is now available at ${money(finalPrice(product))}. Tap to shop now.` : 'A new Travyn product is now live. Tap to shop now.';
    createNotification('new-product', title, message, '#shop', true, true);
  }

  function renderAdmin() {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const itemsSold = orders.reduce((sum, order) => sum + (order.items || []).reduce((n, item) => n + Number(item.qty || 1), 0), 0);
    const conversion = visitors ? ((orders.length / visitors) * 100).toFixed(1) + '%' : '0%';
    const avgOrder = orders.length ? money(revenue / orders.length) : money(0);
    const latest = orders[0]?.date || reviews[0]?.date || 'No activity';
    if ($('statVisitors')) $('statVisitors').textContent = visitors;
    if ($('statProducts')) $('statProducts').textContent = products.length;
    if ($('statCategories')) $('statCategories').textContent = categories.length;
    if ($('statOrders')) $('statOrders').textContent = orders.length;
    if ($('statItemsSold')) $('statItemsSold').textContent = itemsSold;
    if ($('statSellingStatus')) $('statSellingStatus').textContent = revenue > 0 ? 'Active' : 'No Sales';
    if ($('statRevenue')) $('statRevenue').textContent = money(revenue) + ' revenue';
    if ($('statReviews')) $('statReviews').textContent = reviews.length;
    if ($('statConversion')) $('statConversion').textContent = conversion;
    if ($('statAvgOrder')) $('statAvgOrder').textContent = avgOrder;
    if ($('statLatestActivity')) $('statLatestActivity').textContent = latest;
    $('adminProductList').innerHTML = products.map(product => `
      <div class="admin-row">
        <img src="${product.image || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="${product.name}">
        <div><b>${product.name}</b><p class="muted small">${discountAmount(product) ? money(finalPrice(product)) + ' sale · MRP ' + money(product.price) : money(product.price)} · Stock ${stockAmount(product)} · Ship ${shippingAmount(product) ? money(shippingAmount(product)) : 'Free'} · ${productColors(product).join(', ')}</p></div>
        <div class="mini-actions"><button data-edit-product="${product.id}">Edit</button><button data-delete-product="${product.id}">Delete</button></div>
      </div>
    `).join('');
    $('adminCategoryList').innerHTML = categories.map(cat => `
      <div class="admin-row">
        <img src="${cat.image || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="${cat.name}">
        <div><b>${cat.name}</b><p class="muted small">${cat.id}</p></div>
        <div class="mini-actions"><button data-delete-category="${cat.id}">Delete</button></div>
      </div>
    `).join('');
    $('adminOrderList').innerHTML = orders.length ? orders.map(order => `
      <div class="admin-row">
        <div></div>
        <div><b>${order.name || 'Customer'} · ${order.phone || 'No phone'}</b><p class="muted small">${order.email || 'No email'} · ${order.date} · ${money(order.total)} · ${order.items.length} item(s)</p><p class="small">${order.address || ''} · PIN: ${order.pin || '-'}</p></div>
        <div class="mini-actions"><button data-delete-order="${order.id}">Delete</button></div>
      </div>
    `).join('') : '<p class="muted">No orders yet.</p>';
    if ($('adminReviewList')) $('adminReviewList').innerHTML = reviews.length ? reviews.map(review => {
      const product = products.find(p => String(p.id) === String(review.productId));
      return `<div class="admin-row">
        <img src="${review.photo || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="Review">
        <div><b>${review.name || 'Customer'} · ${'★'.repeat(Number(review.rating || 5))}</b><p class="muted small">${product ? product.name : 'Product removed'} · ${review.date}</p><p class="small">${review.text || ''}</p></div>
        <div class="mini-actions"><button data-delete-review="${review.id}">Delete</button></div>
      </div>`;
    }).join('') : '<p class="muted">No photo reviews yet.</p>';
    if ($('adminUserList')) $('adminUserList').innerHTML = users.length ? users.map(user => `
      <div class="admin-row user-detail-row">
        <div class="user-avatar">${safeText((user.name || 'U').slice(0,1).toUpperCase())}</div>
        <div><b>${safeText(user.name || 'Customer')}</b><p class="muted small">Phone: ${safeText(user.phone || '-')} · Email: ${safeText(user.email || '-')}</p><p class="small">Address: ${safeText(user.address || '-')} · PIN: ${safeText(user.pin || '-')}</p><p class="small">Registered: ${safeText(user.createdAt || '-')}</p></div>
        <div class="mini-actions"><button data-whatsapp-user="${user.id}">WhatsApp</button><button data-email-user="${user.id}">Email</button><button data-delete-user="${user.id}">Delete</button></div>
      </div>
    `).join('') : '<p class="muted">No registered users yet.</p>';
    if ($('adminNotificationList')) $('adminNotificationList').innerHTML = notifications.length ? notifications.map(n => `
      <div class="admin-row notification-admin-row">
        <div class="notice-icon">${n.type === 'offer' ? '🔥' : n.type === 'new-product' ? '🛍' : '✨'}</div>
        <div><b>${safeText(n.title)}</b><p class="muted small">${safeText(n.type)} · ${safeText(n.date || '')}</p><p class="small">${safeText(n.message)}</p></div>
        <div class="mini-actions"><button data-whatsapp-notice="${n.id}">WhatsApp All</button><button data-email-notice="${n.id}">Email All</button><button data-delete-notification="${n.id}">Delete</button></div>
      </div>
    `).join('') : '<p class="muted">No notifications sent yet.</p>'; 
  }

  function renderProductReviews(productId) {
    if (!$('productReviews')) return;
    const productReviews = reviews.filter(r => String(r.productId) === String(productId));
    $('productReviews').innerHTML = productReviews.length ? productReviews.map(r => `
      <article class="photo-review-card">
        <img src="${r.photo || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="Customer review">
        <div><b>${safeText(r.name || 'Customer')}</b><span>${'★'.repeat(Number(r.rating || 5))}</span><p>${safeText(r.text || '')}</p><small class="muted">Registered customer feedback</small></div>
      </article>
    `).join('') : '<p class="muted small">No photo reviews yet for this product.</p>';
  }


  function renderHomeReviews() {
    const grid = $('homepageReviewGrid');
    if (!grid) return;
    const latestReviews = reviews.slice(0, 12);
    if (!latestReviews.length) {
      grid.innerHTML = `
        <article>“Premium fitting and cloth feels heavy.”<b>— Adhil</b></article>
        <article>“The black/white website look is very clean.”<b>— Nihal</b></article>
        <article>“WhatsApp checkout is easy for customers.”<b>— Arjun</b></article>`;
    } else {
      grid.innerHTML = latestReviews.map(r => {
        const product = products.find(p => String(p.id) === String(r.productId));
        const stars = '★'.repeat(Number(r.rating || 5));
        return `<article class="customer-feedback-card">
          ${r.photo ? `<img src="${r.photo}" onerror="this.style.display='none'" alt="Customer feedback photo">` : ''}
          <p>“${safeText(r.text || 'Premium quality and perfect oversized fit.')}”</p>
          <span>${stars}</span>
          <small class="muted">${product ? safeText(product.name) : 'Travyn Customer Feedback'}</small>
          <b>— ${safeText(r.name || 'Customer')}</b>
        </article>`;
      }).join('');
    }

    const productSelect = $('homeReviewProduct');
    if (productSelect) {
      productSelect.innerHTML = '<option value="general">General Travyn Review</option>' + products.map(p => `<option value="${p.id}">${safeText(p.name)}</option>`).join('');
    }
  }

  function submitHomeReview() {
    if (!isUserLoggedIn()) { openUserAuth('Please login or register to add your review.', () => submitHomeReview()); return; }
    const fileInput = $('homeReviewPhoto');
    const file = fileInput?.files?.[0];
    const text = $('homeReviewText')?.value.trim();
    if (!text) { showToast('Please write your review first.'); return; }
    const save = (photoData) => {
      const review = {
        id: Date.now(),
        productId: $('homeReviewProduct')?.value || 'general',
        userId: currentUser?.id || '',
        name: currentUser?.name || 'Travyn Customer',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        photo: photoData || '',
        rating: $('homeReviewRating')?.value || '5',
        text,
        date: new Date().toLocaleString('en-IN')
      };
      reviews.unshift(review);
      if ($('homeReviewText')) $('homeReviewText').value = '';
      if (fileInput) fileInput.value = '';
      persist();
      renderHomeReviews();
      if (currentProduct) renderProductReviews(currentProduct.id);
      renderAdmin();
      showToast('Review added. Admin can manage it in Customer Feedback.');
    };
    if (file) { const reader = new FileReader(); reader.onload = () => save(reader.result); reader.readAsDataURL(file); }
    else save('');
  }

  function submitUserReview() {
    if (!isUserLoggedIn()) { openUserAuth('Please login or register to submit a photo review.', () => submitUserReview()); return; }
    if (!currentProduct) { alert('Open a product first'); return; }
    const fileInput = $('userReviewPhoto');
    const file = fileInput?.files?.[0];
    const save = (photoData) => {
      const review = {
        id: Date.now(),
        productId: currentProduct.id,
        userId: currentUser?.id || '',
        name: currentUser?.name || 'Travyn Customer',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        photo: photoData || fallbackImage,
        rating: $('userReviewRating')?.value || '5',
        text: $('userReviewText')?.value.trim() || 'Premium quality and perfect oversized fit.',
        date: new Date().toLocaleString('en-IN')
      };
      reviews.unshift(review);
      ['userReviewText'].forEach(id => { if ($(id)) $(id).value = ''; });
      if (fileInput) fileInput.value = '';
      persist();
      renderProductReviews(currentProduct.id);
      renderHomeReviews();
      renderAdmin();
      showToast('Thank you! Your customer feedback is added. Admin can manage it.');
    };
    if (file) {
      uploadImageToCloudinary(file).then(save).catch(err => alert(err.message));
    } else {
      save(fallbackImage);
    }
  }


  function setProductDescription(text) {
    const desc = $('modalProductDescription');
    const btn = $('readMoreDescBtn');
    if (!desc || !btn) return;
    desc.textContent = text || 'Premium Travyn product.';
    desc.classList.add('collapsed');
    btn.textContent = 'Read More';
    requestAnimationFrame(() => {
      const needsReadMore = desc.scrollHeight > desc.clientHeight + 4 || (text || '').length > 140;
      btn.classList.toggle('hidden', !needsReadMore);
    });
  }

  function toggleDescription() {
    const desc = $('modalProductDescription');
    const btn = $('readMoreDescBtn');
    if (!desc || !btn) return;
    const isCollapsed = desc.classList.toggle('collapsed');
    btn.textContent = isCollapsed ? 'Read More' : 'Show Less';
  }

  function openProduct(id) {
    currentProduct = products.find(p => String(p.id) === String(id));
    if (!currentProduct) return;
    selectedSize = 'L'; selectedColor = productColors(currentProduct)[0] || 'Black'; selectedQty = 1;
    $('modalProductName').textContent = currentProduct.name;
    setProductDescription(currentProduct.description);
    $('modalProductPrice').innerHTML = discountAmount(currentProduct) ? `<span class="old-price">${money(currentProduct.price)}</span> ${money(finalPrice(currentProduct))}` : money(currentProduct.price);
    const stockNote = document.getElementById('stockNote');
    if (stockNote) stockNote.textContent = `Stock: ${stockAmount(currentProduct) || 'Out of stock'} · Shipping: ${shippingAmount(currentProduct) ? money(shippingAmount(currentProduct)) : 'Free delivery'}`;
    renderGallery(currentProduct);
    renderOptions();
    renderProductReviews(currentProduct.id);
    $('productModal').classList.remove('hidden');
    $('productModal').setAttribute('aria-hidden', 'false');
  }

  function renderGallery(product) {
    const images = getImages(product);
    const selectedImage = imageForColor(product, selectedColor);
    $('modalMainImage').src = selectedImage || fallbackImage;
    const gallery = [selectedImage, ...images].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    $('thumbRow').innerHTML = gallery.map((img, index) => `<img src="${img}" class="${img === selectedImage || index === 0 ? 'active' : ''}" data-thumb="${img}" onerror="this.src='${fallbackImage}'">`).join('');
  }

  function renderOptions() {
    $('sizeOptions').innerHTML = SIZES.map(size => `<button class="chip ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</button>`).join('');
    $('colorOptions').innerHTML = productColors(currentProduct || {}).map(color => `<button class="chip ${color === selectedColor ? 'active' : ''}" data-color="${color}">${color}</button>`).join('');
    $('qtyValue').textContent = selectedQty;
  }

  function closeProduct() { $('productModal').classList.add('hidden'); $('productModal').setAttribute('aria-hidden', 'true'); }
  function fillCheckoutFromUser() {
    const user = findFullCurrentUser();
    if (!user) return;
    if ($('customerName') && !$('customerName').value) $('customerName').value = user.name || '';
    if ($('customerPhone') && !$('customerPhone').value) $('customerPhone').value = user.phone || '';
    if ($('customerEmail') && !$('customerEmail').value) $('customerEmail').value = user.email || '';
    if ($('customerAddress') && !$('customerAddress').value) $('customerAddress').value = user.address || '';
    if ($('customerPin') && !$('customerPin').value) $('customerPin').value = user.pin || '';
  }
  function openCart() { $('cartDrawer').classList.remove('hidden'); fillCheckoutFromUser(); renderCart(); }
  function closeCart() { $('cartDrawer').classList.add('hidden'); }
  function updateCartCount() { $('cartCount').textContent = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0); }

  function addToCart(product = currentProduct, open = true) {
    if (!product) return;
    if (stockAmount(product) <= 0) { alert('This product is out of stock'); return; }
    const existing = cart.find(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);
    if (existing) existing.qty += selectedQty;
    else cart.push({ id: product.id, name: product.name, price: finalPrice(product), mrp: Number(product.price), discount: discountAmount(product), shipping: shippingAmount(product), image: imageForColor(product, selectedColor), size: selectedSize, color: selectedColor, qty: selectedQty });
    persist(); updateCartCount();
    if (open) { closeProduct(); openCart(); }
  }

  function renderCart() {
    $('cartItems').innerHTML = cart.length ? cart.map((item, index) => `
      <div class="cart-row">
        <img src="${item.image || fallbackImage}" onerror="this.src='${fallbackImage}'" alt="${item.name}">
        <div><b>${item.name}</b><p class="muted small">${item.size} / ${item.color} · Qty ${item.qty} · Shipping ${item.shipping ? money(item.shipping) : 'Free'}</p><b>${money(item.price * item.qty)}</b></div>
        <button data-remove-cart="${index}">Remove</button>
      </div>
    `).join('') : '<p class="muted">Cart is empty.</p>';
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty || 1), 0);
    const shipping = cart.reduce((sum, item) => sum + Number(item.shipping || 0), 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst + shipping;
    $('subtotalAmount').textContent = money(subtotal);
    $('gstAmount').textContent = money(gst);
    const shipEl = document.getElementById('shippingAmount'); if (shipEl) shipEl.textContent = money(shipping);
    $('totalAmount').textContent = money(total);
  }

  function checkout() {
    if (!cart.length) { alert('Cart is empty'); return; }
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty || 1), 0);
    const shipping = cart.reduce((sum, item) => sum + Number(item.shipping || 0), 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst + shipping;
    const order = { id: Date.now(), date: new Date().toLocaleString('en-IN'), name: $('customerName').value.trim() || currentUser?.name || '', phone: $('customerPhone').value.trim() || currentUser?.phone || '', email: $('customerEmail')?.value.trim() || currentUser?.email || '', address: $('customerAddress').value.trim() || currentUser?.address || '', pin: $('customerPin')?.value.trim() || currentUser?.pin || '', userId: currentUser?.id || '', items: [...cart], subtotal, gst, shipping, total };
    orders.unshift(order);
    persist(); renderAdmin(); renderProfile();
    const lines = cart.map((item, i) => `${i + 1}. ${item.name} | ${item.size}/${item.color} | Qty ${item.qty} | ${money(item.price * item.qty)}`).join('\n');
    const message = `TRAVYN ORDER\n\nName: ${order.name || '-'}\nPhone: ${order.phone || '-'}\nEmail: ${order.email || '-'}\nAddress: ${order.address || '-'}\nPin Code: ${order.pin || '-'}\n\n${lines}\n\nSubtotal: ${money(subtotal)}\nGST 5%: ${money(gst)}\nShipping: ${money(shipping)}\nTotal: ${money(total)}\n\nGST No: ${GST_NO}\nUPI ID: ${UPI_ID}\nPlease attach payment screenshot.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  }

  function openAdminLogin() {
    $('adminUsername').value = '';
    $('adminPassword').value = '';
    $('adminLoginOverlay').classList.remove('hidden');
    $('adminLoginOverlay').setAttribute('aria-hidden', 'false');
    setTimeout(() => $('adminUsername').focus(), 80);
  }

  function closeAdminLogin() {
    $('adminLoginOverlay').classList.add('hidden');
    $('adminLoginOverlay').setAttribute('aria-hidden', 'true');
  }

  function showAdminDashboard() {
    closeAdminLogin();
    $('adminDashboard').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderAdmin();
  }

  function hideAdminDashboard() {
    $('adminDashboard').classList.add('hidden');
  }

  async function login() {
    const username = $('adminUsername').value.trim();
    const password = $('adminPassword').value;
    try {
      await loginAdminRemote(username, password);
      showAdminDashboard();
    } catch (error) {
      alert(error.message || 'Wrong username or password');
    }
  }

  function clearProductForm() {
    ['productId','productName','productPrice','productDiscount','productStock','productShipping','productColors','productImage','productImages','productColorImages','productDescription','productImageFile','productImagesFile'].forEach(id => $(id) && ($(id).value = ''));
    if (categories[0]) $('productCategory').value = categories[0].id;
  }

  async function saveProduct() {
    const name = $('productName').value.trim();
    const price = Number($('productPrice').value);
    if (!name || !price) { alert('Add product name and price'); return; }
    let mainImage = $('productImage').value.trim();
    let moreImages = $('productImages').value.split(',').map(x => x.trim()).filter(Boolean);
    try {
      const mainFile = $('productImageFile')?.files?.[0];
      const moreFiles = $('productImagesFile')?.files;
      if (mainFile) mainImage = await uploadImageToCloudinary(mainFile);
      if (moreFiles && moreFiles.length) moreImages = moreImages.concat(await uploadMultipleImages(moreFiles));
    } catch (err) { alert(err.message); return; }
    const data = { id: $('productId').value ? Number($('productId').value) : Date.now(), name, price, discount: Number($('productDiscount').value || 0), stock: Number($('productStock').value || 0), shipping: Number($('productShipping').value || 0), colors: $('productColors').value.split(',').map(x => x.trim()).filter(Boolean), colorImages: parseColorImages($('productColorImages')?.value || ''), category: $('productCategory').value, image: mainImage || fallbackImage, images: moreImages, description: $('productDescription').value.trim() || 'Premium Travyn product.' };
    const index = products.findIndex(p => String(p.id) === String(data.id));
    const isNewProduct = index < 0;
    if (index >= 0) products[index] = data; else products.unshift(data);
    if (isNewProduct) notifications.unshift({ id: Date.now() + 7, type: 'new-product', title: `New Product: ${data.name}`, message: `${data.name} is now available at ${money(finalPrice(data))}. Tap to shop now.`, link: '#shop', date: new Date().toLocaleString('en-IN'), readBy: [] });
    persist(); clearProductForm(); renderCategories(); renderProducts(); renderAdmin(); updateNotificationBadge();
  }

  function editProduct(id) {
    const product = products.find(p => String(p.id) === String(id));
    if (!product) return;
    $('productId').value = product.id; $('productName').value = product.name; $('productPrice').value = product.price; $('productDiscount').value = product.discount || 0; $('productStock').value = product.stock || 0; $('productShipping').value = product.shipping || 0; $('productColors').value = productColors(product).join(', '); $('productCategory').value = product.category; $('productImage').value = product.image; $('productImages').value = (product.images || []).join(', '); if ($('productColorImages')) $('productColorImages').value = colorImagesToText(product); $('productDescription').value = product.description;
    document.querySelector('[data-tab="productsPanel"]').click();
  }

  function deleteProduct(id) {
    products = products.filter(p => String(p.id) !== String(id));
    cart = cart.filter(i => String(i.id) !== String(id));
    persist(); renderProducts(); renderAdmin(); renderCart();
  }

  async function saveCategory() {
    const name = $('categoryName').value.trim();
    if (!name) { alert('Add category name'); return; }
    let image = $('categoryImage').value.trim();
    try {
      const file = $('categoryImageFile')?.files?.[0];
      if (file) image = await uploadImageToCloudinary(file);
    } catch (err) { alert(err.message); return; }
    categories.push({ id: slug(name) + '-' + Date.now().toString().slice(-4), name, image: image || fallbackImage });
    $('categoryName').value = ''; $('categoryImage').value = ''; if ($('categoryImageFile')) $('categoryImageFile').value = '';
    persist(); renderCategories(); renderProducts(); renderAdmin();
  }

  function deleteCategory(id) {
    if (products.some(p => p.category === id)) { alert('Delete or move products from this category first'); return; }
    categories = categories.filter(c => c.id !== id);
    persist(); renderCategories(); renderAdmin();
  }

  function bindEvents() {
    $('saveHomeContentBtn')?.addEventListener('click', saveHomeContent);
    $('resetHomeContentBtn')?.addEventListener('click', resetHomeContent);
    $('homeImageFileInput')?.addEventListener('change', handleHomeImageUpload);
    $('saveSeoBtn')?.addEventListener('click', saveSeoContent);
    $('resetSeoBtn')?.addEventListener('click', resetSeoContent);
    ['seoTitleInput','seoDescriptionInput','seoKeywordsInput','seoCanonicalInput'].forEach(id => $(id)?.addEventListener('input', () => {
      const temp = { title: $('seoTitleInput')?.value || starterSeo.title, description: $('seoDescriptionInput')?.value || starterSeo.description, canonical: $('seoCanonicalInput')?.value || starterSeo.canonical };
      if ($('seoPreviewTitle')) $('seoPreviewTitle').textContent = temp.title;
      if ($('seoPreviewUrl')) $('seoPreviewUrl').textContent = temp.canonical;
      if ($('seoPreviewDescription')) $('seoPreviewDescription').textContent = temp.description;
    }));
    $('cartOpenBtn').addEventListener('click', openCart);
    $('openUserLoginBtn')?.addEventListener('click', () => { if (isUserLoggedIn()) { if (confirm('Logout current user?')) { currentUser = null; persist(); updateUserButton(); closeNotifications(); } } else openUserAuth('Login or register to shop on Travyn.'); });
    $('openUserNotificationsBtn')?.addEventListener('click', openNotifications);
    $('openUserProfileBtn')?.addEventListener('click', openProfile);
    $('closeProfileBtn')?.addEventListener('click', closeProfile);
    $('saveProfileBtn')?.addEventListener('click', saveProfile);
    $('closeNotificationsBtn')?.addEventListener('click', closeNotifications);
    $('clearUserNotificationsBtn')?.addEventListener('click', clearUserNotifications);
    $('sendNotificationBtn')?.addEventListener('click', sendAdminNotification);
    $('emailAllUsersBtn')?.addEventListener('click', () => { const box = $('lastShareActions'); emailAllUsers(box?.dataset.title || $('notifyTitle')?.value || 'Travyn Offer', box?.dataset.message || $('notifyMessage')?.value || 'New offer is live on Travyn.', box?.dataset.link || $('notifyLink')?.value || '#shop'); });
    $('whatsappAllUsersBtn')?.addEventListener('click', () => { const box = $('lastShareActions'); whatsappAllUsers(box?.dataset.title || $('notifyTitle')?.value || 'Travyn Offer', box?.dataset.message || $('notifyMessage')?.value || 'New offer is live on Travyn.', box?.dataset.link || $('notifyLink')?.value || '#shop'); });
    $('sendNewProductTemplateBtn')?.addEventListener('click', sendNewProductTemplate);
    $('closeUserAuthBtn')?.addEventListener('click', closeUserAuth);
    $('showUserLoginBtn')?.addEventListener('click', showUserLogin);
    $('showUserRegisterBtn')?.addEventListener('click', showUserRegister);
    $('userLoginSubmitBtn')?.addEventListener('click', userLogin);
    $('userRegisterSubmitBtn')?.addEventListener('click', userRegister);
    $('loginUserPassword')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') userLogin(); });
    $('registerUserPassword')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') userRegister(); });
    $('closeCartBtn').addEventListener('click', closeCart);
    $('closeProductBtn').addEventListener('click', closeProduct);
    $('categoryFilter').addEventListener('change', renderProducts);
    ['openAdminLoginBtn','heroAdminLoginBtn','teaserAdminLoginBtn'].forEach(id => $(id)?.addEventListener('click', openAdminLogin));
    $('closeAdminLoginBtn').addEventListener('click', closeAdminLogin);
    $('closeAdminDashboardBtn').addEventListener('click', hideAdminDashboard);
    $('loginBtn').addEventListener('click', login);
    $('adminPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });
    $('logoutBtn').addEventListener('click', () => { hideAdminDashboard(); openAdminLogin(); });
    $('saveProductBtn').addEventListener('click', saveProduct);
    $('clearProductBtn').addEventListener('click', clearProductForm);
    $('saveCategoryBtn').addEventListener('click', saveCategory);
    $('submitUserReviewBtn')?.addEventListener('click', submitUserReview);
    $('submitHomeReviewBtn')?.addEventListener('click', submitHomeReview);
    $('readMoreDescBtn')?.addEventListener('click', toggleDescription);
    $('addToCartBtn').addEventListener('click', () => requireUser('Please login or register to add product to cart.', () => addToCart(currentProduct, true)));
    $('buyNowBtn').addEventListener('click', () => requireUser('Please login or register to buy this product.', () => { addToCart(currentProduct, false); closeProduct(); openCart(); }));
    $('checkoutBtn').addEventListener('click', () => requireUser('Please login or register before checkout.', checkout));
    $('qtyMinus').addEventListener('click', () => { selectedQty = Math.max(1, selectedQty - 1); renderOptions(); });
    $('qtyPlus').addEventListener('click', () => { selectedQty += 1; renderOptions(); });

    document.body.addEventListener('click', (event) => {
      const target = event.target.closest('button, img');
      if (!target) return;
      const viewId = target.dataset.viewProduct;
      const quickId = target.dataset.quickCart;
      const removeIndex = target.dataset.removeCart;
      const editId = target.dataset.editProduct;
      const deleteId = target.dataset.deleteProduct;
      const deleteCatId = target.dataset.deleteCategory;
      const deleteOrderId = target.dataset.deleteOrder;
      const deleteReviewId = target.dataset.deleteReview;
      const deleteNotificationId = target.dataset.deleteNotification;
      const size = target.dataset.size;
      const color = target.dataset.color;
      const thumb = target.dataset.thumb;
      const tab = target.dataset.tab;
      const catJump = target.dataset.categoryJump;
      const cardReadMoreId = target.dataset.cardReadMore;
      const profileTabId = target.dataset.profileTab;

      if (profileTabId) { switchProfileTab(profileTabId); return; }
      if (cardReadMoreId) {
        const desc = document.querySelector(`[data-card-desc="${cardReadMoreId}"]`);
        if (desc) {
          const expanded = desc.classList.toggle('expanded');
          desc.textContent = expanded ? desc.dataset.fullDesc : desc.dataset.shortDesc;
          target.textContent = expanded ? 'Show Less' : 'Read More';
        }
      }
      if (viewId) requireUser('Please login or register to view product details.', () => openProduct(viewId));
      if (quickId) requireUser('Please login or register to add product to cart.', () => { const product = products.find(p => String(p.id) === String(quickId)); selectedSize = 'L'; selectedColor = productColors(product || {})[0] || 'Black'; selectedQty = 1; addToCart(product, true); });
      if (removeIndex !== undefined) { cart.splice(Number(removeIndex), 1); persist(); renderCart(); updateCartCount(); }
      if (editId) editProduct(editId);
      if (deleteId && confirm('Delete this product?')) deleteProduct(deleteId);
      if (deleteCatId && confirm('Delete this category?')) deleteCategory(deleteCatId);
      if (deleteOrderId) { orders = orders.filter(o => String(o.id) !== String(deleteOrderId)); persist(); renderAdmin(); }
      if (deleteReviewId) { reviews = reviews.filter(r => String(r.id) !== String(deleteReviewId)); persist(); renderHomeReviews(); renderAdmin(); if (currentProduct) renderProductReviews(currentProduct.id); }
      if (deleteNotificationId) { notifications = notifications.filter(n => String(n.id) !== String(deleteNotificationId)); persist(); renderAdmin(); updateNotificationBadge(); }
      const deleteUserId = target.dataset.deleteUser;
      const whatsappNoticeId = target.dataset.whatsappNotice;
      const emailNoticeId = target.dataset.emailNotice;
      const whatsappUserId = target.dataset.whatsappUser;
      const emailUserId = target.dataset.emailUser;
      if (whatsappNoticeId) { const n = notifications.find(x => String(x.id) === String(whatsappNoticeId)); if (n) whatsappAllUsers(n.title, n.message, n.link); }
      if (emailNoticeId) { const n = notifications.find(x => String(x.id) === String(emailNoticeId)); if (n) emailAllUsers(n.title, n.message, n.link); }
      if (whatsappUserId) { const u = users.find(x => String(x.id) === String(whatsappUserId)); const n = latestNotice(); if (u) whatsappUser(u.phone, n?.title || 'Travyn Offer', n?.message || 'New offer is live on Travyn.', n?.link || '#shop'); }
      if (emailUserId) { const u = users.find(x => String(x.id) === String(emailUserId)); const n = latestNotice(); if (u?.email) window.location.href = `mailto:${encodeURIComponent(u.email)}?subject=${encodeURIComponent(n?.title || 'Travyn Offer')}&body=${encodeURIComponent(buildNotificationMessage(n?.title || 'Travyn Offer', n?.message || 'New offer is live on Travyn.', n?.link || '#shop'))}`; }
      if (deleteUserId) { users = users.filter(u => String(u.id) !== String(deleteUserId)); if (currentUser && String(currentUser.id) === String(deleteUserId)) currentUser = null; persist(); renderAdmin(); updateUserButton(); }
      if (size) { selectedSize = size; renderOptions(); }
      if (color) { selectedColor = color; renderOptions(); renderGallery(currentProduct); }
      if (thumb) { $('modalMainImage').src = thumb; document.querySelectorAll('#thumbRow img').forEach(img => img.classList.toggle('active', img.dataset.thumb === thumb)); }
      if (tab) { document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active')); target.classList.add('active'); document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.add('hidden')); $(tab).classList.remove('hidden'); }
      if (catJump) { $('categoryFilter').value = catJump; renderProducts(); location.hash = '#shop'; }
    });

    $('productModal').addEventListener('click', (event) => { if (event.target.id === 'productModal') closeProduct(); });
    $('cartDrawer').addEventListener('click', (event) => { if (event.target.id === 'cartDrawer') closeCart(); });
    $('notificationDrawer')?.addEventListener('click', (event) => { if (event.target.id === 'notificationDrawer') closeNotifications(); });
    $('profileDrawer')?.addEventListener('click', (event) => { if (event.target.id === 'profileDrawer') closeProfile(); });
    $('adminLoginOverlay').addEventListener('click', (event) => { if (event.target.id === 'adminLoginOverlay') closeAdminLogin(); });
    $('userAuthOverlay')?.addEventListener('click', (event) => { if (event.target.id === 'userAuthOverlay') closeUserAuth(); });
  }

  async function init() {
    await loadFirebaseFirst();
    if (!sessionStorage.getItem('travyn_visit_counted')) { visitors += 1; sessionStorage.setItem('travyn_visit_counted', 'yes'); persist(); }
    renderHomeContent(); applySeoContent(); renderCategories(); renderProducts(); renderHomeReviews(); renderAdmin(); renderCart(); clearProductForm(); bindEvents(); updateCartCount(); updateUserButton();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

