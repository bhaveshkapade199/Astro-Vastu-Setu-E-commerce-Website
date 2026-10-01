// ============================================
// ASTRO VASTU SETU - Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  renderFeaturedProducts();
  initBackToTop();
});

// ---- RENDER FEATURED PRODUCTS ----
function renderFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 6);
  container.innerHTML = featured.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  const wl = getWishlist();
  const isWishlisted = wl.includes(p.id);
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <div class="product-emoji" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:64px;">${p.emoji}</div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="handleWishlist(${p.id}, this)" title="Add to Wishlist">
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
        <button class="btn-add-cart" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
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
  // Simulate login
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
