// ============================================
// ASTRO VASTU SETU - Main JS
// ============================================

const API_BASE = 'http://localhost:3000/api';

// Global products list (populated async from backend)
let SITE_PRODUCTS = [];

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initBackToTop();
  // Load all products from backend API (fixes add/delete not reflecting)
  loadSiteProducts().then(() => {
    renderFeaturedProducts();
  });
});

// ---- FETCH PRODUCTS FROM BACKEND ----
async function loadSiteProducts() {
  try {
    const res = await fetch(`${API_BASE}/products?_t=${Date.now()}`);
    if (res.ok) {
      SITE_PRODUCTS = await res.json();
    } else {
      SITE_PRODUCTS = DEFAULT_PRODUCTS;
    }
  } catch (e) {
    console.warn('Backend not reachable, using defaults.', e);
    SITE_PRODUCTS = DEFAULT_PRODUCTS;
  }
  return SITE_PRODUCTS;
}

// ---- RENDER FEATURED PRODUCTS ----
function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  // Show all products (not just featured) so new products always appear
  const list = SITE_PRODUCTS.length > 0 ? SITE_PRODUCTS : DEFAULT_PRODUCTS;
  const featured = list.filter(p => p.isFeatured);
  const display = featured.length > 0 ? featured.slice(0, 6) : list.slice(0, 6);
  container.innerHTML = display.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  const wl = getWishlist();
  const isWishlisted = wl.includes(p.id);
  const resolvedImg = (typeof getProductImageUrl === 'function') ? getProductImageUrl(p.image) : (p.image || '');
  const defaultImg = (typeof BACKEND_API_BASE !== 'undefined') 
    ? BACKEND_API_BASE.replace('/api', '') + '/uploads/bracelet-default.jpeg'
    : 'http://localhost:5000/uploads/bracelet-default.jpeg';
  return `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
      <div class="product-img-wrap">
        <img src="${resolvedImg || defaultImg}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${defaultImg}'">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); handleWishlist(${p.id}, this)" title="Add to Wishlist">
          ${isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-pricing">
          <span class="price-current">₹${p.price}</span>
          <span class="price-mrp">₹${p.mrp}</span>
          <span class="price-discount">${p.discount}% OFF</span>
        </div>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </div>
  `;
}

function handleWishlist(id, btn) {
  const added = toggleWishlist(id);
  btn.innerHTML = added ? '❤️' : '🤍';
  btn.classList.toggle('active', added);
}

// ---- TOAST NOTIFICATIONS ----
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ---- BACK TO TOP ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
}

// ---- FAQ TOGGLE ----
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ---- MOBILE MENU ----
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- LOGIN MODAL ----
function openLoginModal() {
  const user = JSON.parse(localStorage.getItem('avs_user') || 'null');
  if (user) {
    location.href = 'account.html';
    return;
  }
  document.getElementById('loginOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  document.getElementById('loginOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
}

function doLogin() {
  const user = { name: 'Customer', email: 'customer@email.com' };
  localStorage.setItem('avs_user', JSON.stringify(user));
  closeLoginModal();
  showToast('✅ Logged in successfully!', 'success');
  setTimeout(() => location.href = 'account.html', 1000);
}

function doSignup() {
  const user = { name: 'New User', email: 'newuser@email.com' };
  localStorage.setItem('avs_user', JSON.stringify(user));
  closeLoginModal();
  showToast('✅ Account created successfully!', 'success');
  setTimeout(() => location.href = 'account.html', 1000);
}

// ---- SEARCH ----
function doSearch() {
  const q = document.getElementById('searchInput')?.value?.trim();
  if (q) location.href = `shop.html?search=${encodeURIComponent(q)}`;
}

document.getElementById('searchInput')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') doSearch();
});

// ---- NEWSLETTER ----
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('✅ Subscribed successfully! Thank you.', 'success');
  e.target.reset();
}

// ---- Close modal on overlay click ----
document.getElementById('loginOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeLoginModal();
});

// ---- SPECIAL BRACELET MODAL ----
function openSpecialBraceletModal() {
  location.href = 'find-my-bracelet.html';
}

function closeSpecialBraceletModal() {
  const modal = document.getElementById('specialBraceletModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

async function submitSpecialBracelet(e) {
  e.preventDefault();
  const name = document.getElementById('sb_name').value.trim();
  const age = document.getElementById('sb_age') ? document.getElementById('sb_age').value : '';
  const dob = document.getElementById('sb_dob').value;
  const mobile = document.getElementById('sb_mobile') ? document.getElementById('sb_mobile').value.trim() : '9876543210';
  const city = document.getElementById('sb_city') ? document.getElementById('sb_city').value.trim() : 'India';
  const gotra = document.getElementById('sb_gotra') ? document.getElementById('sb_gotra').value.trim() : '';
  const rashi = document.getElementById('sb_rashi') ? document.getElementById('sb_rashi').value : '';
  const nakshatra = document.getElementById('sb_nakshatra') ? document.getElementById('sb_nakshatra').value.trim() : '';
  const kundali = document.getElementById('sb_kundali') ? document.getElementById('sb_kundali').value.trim() : '';
  const wish = document.getElementById('sb_wish') ? document.getElementById('sb_wish').value.trim() : 'Astrological Healing & Prosperity';

  const apiBase = window.BACKEND_API_BASE || 'http://localhost:5000/api';
  let requestId = 'SPB-' + Math.floor(100000 + Math.random() * 900000);

  const payload = {
    personDetails: {
      fullName: name,
      gender: 'Male',
      dob: dob || new Date().toISOString().split('T')[0],
      birthTime: '',
      birthPlace: city,
      rashi: rashi,
      nakshatra: nakshatra,
      gotra: gotra
    },
    customization: {
      wristSize: '7.0 Inches (Standard)',
      beadSize: '8mm',
      primaryPurpose: wish || 'Planetary Healing & Prosperity',
      preferredStones: ['Kundli Recommended Stones'],
      specialConcerns: `Age: ${age}. Kundali / Birth Info: ${kundali}`
    },
    customer: {
      name: name,
      mobile: mobile,
      whatsapp: mobile,
      address: `${city}, India`,
      city: city,
      state: 'India',
      pincode: '400001'
    },
    pricing: {
      finalPrice: 51
    }
  };

  try {
    const res = await fetch(`${apiBase}/special-bracelets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.requestId) requestId = data.requestId;
    }
  } catch (err) {
    console.warn('Could not post to MongoDB backend:', err);
  }

  showToast(`✨ Special bracelet request (${requestId}) saved! Opening WhatsApp...`, 'gold');

  const msg = `Hello Astro Vastu Setu! 🙏\nI want to order a Special Personalized Bracelet (Request ID: ${requestId}).\n\nMy Details:\nName: ${name}\nAge: ${age}\nDate of Birth: ${dob}\nGotra: ${gotra}\nRashi: ${rashi}\nNakshatra: ${nakshatra}\nCity: ${city}\nKundali Info: ${kundali}\nSpecial Wish: ${wish}`;
  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
  
  closeSpecialBraceletModal();
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);
}
