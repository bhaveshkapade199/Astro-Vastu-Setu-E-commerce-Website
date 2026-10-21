// =============================================================
// ASTRO VASTU SETU - ADMIN CONTROL CENTER JAVASCRIPT
// Full Mobile Responsiveness + Complete Auth (Login & Register)
// =============================================================

const API_BASE = window.location.origin.includes('localhost:')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

let token = localStorage.getItem('admin_token');
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem('admin_user') || 'null');
} catch (e) {
    currentUser = null;
}

let currentTab = 'products';
let productsData = [];
let categoriesData = [];
let ordersData = [];
let specialRequestsData = [];
let numerologyData = [];
let contactsData = [];
let reviewsData = [];

// Default Initial Admin Accounts (stored in localStorage)
const DEFAULT_ADMIN_USERS = [
    {
        id: 1,
        fullName: 'Master Admin',
        username: 'admin',
        email: 'admin@astrovastussetu.com',
        password: 'admin123',
        role: 'Master Admin',
        createdAt: new Date().toISOString()
    }
];

// Fallback Default Products (ensures admin panel is populated immediately)
const DEFAULT_ADMIN_PRODUCTS = [
    {
        id: 1,
        name: "7 Chakra Energy Bracelet",
        category: "bracelets",
        subcategory: "7chakra",
        emoji: "🌈",
        image: "../website/Images/bracelet-7chakra.jpeg",
        price: 699,
        mrp: 1049,
        discount: 33,
        rating: 4.8,
        reviews: 126,
        badge: "BESTSELLER",
        shortDesc: "Traditional 7 Chakra inspired bracelet designed for spiritual and wellness balance.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 2,
        name: "Citrine Wealth Bracelet",
        category: "bracelets",
        subcategory: "citrine",
        emoji: "💛",
        image: "../website/Images/bracelet-citrine.jpeg",
        price: 699,
        mrp: 1049,
        discount: 33,
        rating: 4.7,
        reviews: 124,
        badge: "PROSPERITY",
        shortDesc: "Natural Citrine stone traditionally associated with abundance, success and confidence.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        name: "Pyrite Golden Money Bracelet",
        category: "bracelets",
        subcategory: "pyrite",
        emoji: "✨",
        image: "../website/Images/bracelet-pyrite.jpeg",
        price: 799,
        mrp: 1199,
        discount: 33,
        rating: 4.9,
        reviews: 148,
        badge: "POPULAR",
        shortDesc: "Natural Golden Pyrite crystal stone, renowned as the Stone of Wealth & Opportunity.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 4,
        name: "Black Tourmaline Protection Bracelet",
        category: "bracelets",
        subcategory: "blacktourmaline",
        emoji: "🛡️",
        image: "../website/Images/bracelet-blacktourmaline.jpeg",
        price: 649,
        mrp: 999,
        discount: 35,
        rating: 4.8,
        reviews: 110,
        badge: "PROTECTION",
        shortDesc: "Ultimate negative energy shielding stone for peace of mind and aura purification.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 5,
        name: "Amethyst Spiritual Peace Bracelet",
        category: "bracelets",
        subcategory: "amethyst",
        emoji: "💜",
        image: "../website/Images/bracelet-amethyst.jpeg",
        price: 699,
        mrp: 1049,
        discount: 33,
        rating: 4.7,
        reviews: 95,
        badge: "TRANQUILITY",
        shortDesc: "Natural Purple Amethyst for stress relief, calm focus and spiritual meditation.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 6,
        name: "Tiger Eye Courage & Confidence Bracelet",
        category: "bracelets",
        subcategory: "tigereye",
        emoji: "🐯",
        image: "../website/Images/bracelet-tigereye.jpeg",
        price: 649,
        mrp: 999,
        discount: 35,
        rating: 4.8,
        reviews: 118,
        badge: "COURAGE",
        shortDesc: "Dynamic golden-brown chatoyant gem known for boosting will power and confidence.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 7,
        name: "Rose Quartz Love & Compassion Bracelet",
        category: "bracelets",
        subcategory: "rosequartz",
        emoji: "💖",
        image: "../website/Images/bracelet-rosequartz.jpeg",
        price: 649,
        mrp: 999,
        discount: 35,
        rating: 4.8,
        reviews: 104,
        badge: "RELATIONSHIPS",
        shortDesc: "Tender pink quartz associated with unconditional love, emotional healing and harmony.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 8,
        name: "Original 5 Mukhi Rudraksha Bracelet",
        category: "rudraksha",
        subcategory: "rudraksha",
        emoji: "📿",
        image: "../website/Images/bracelet-rudraksha.jpeg",
        price: 749,
        mrp: 1149,
        discount: 35,
        rating: 4.9,
        reviews: 162,
        badge: "SACRED",
        shortDesc: "Auspicious Nepal 5-Mukhi Rudraksha beads for Lord Shiva blessings and mental clarity.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 9,
        name: "Sampoorna Dhanyog Potli",
        category: "dhanyog",
        subcategory: "dhanyog",
        emoji: "💰",
        image: "../website/Images/bracelet-dhanyog.jpeg",
        price: 999,
        mrp: 1499,
        discount: 33,
        rating: 4.9,
        reviews: 86,
        badge: "LIMITED",
        shortDesc: "Consecrated Dhanyog prosperity bundle containing sacred Gomti Chakra, Cowrie and Pyrite.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 10,
        name: "Maha Lakshmi Diwali Pooja Potli",
        category: "lakshmipotli",
        subcategory: "lakshmipotli",
        emoji: "🪔",
        image: "../website/Images/bracelet-lakshmipotli.jpeg",
        price: 1199,
        mrp: 1799,
        discount: 33,
        rating: 4.9,
        reviews: 135,
        badge: "FESTIVE SPECIAL",
        shortDesc: "Premium energized Lakshmi Potli with auspicious Vedic items for home abundance.",
        inStock: true,
        isNew: false,
        isFeatured: true
    }
];

// Fallback Default Categories
const DEFAULT_ADMIN_CATEGORIES = [
    { _id: 'cat_1', name: 'Bracelets', slug: 'bracelets', icon: '💎', description: 'Healing crystal & gemstone bracelets' },
    { _id: 'cat_2', name: 'Rudraksha', slug: 'rudraksha', icon: '📿', description: 'Original energized spiritual Rudraksha' },
    { _id: 'cat_3', name: 'Dhanyog', slug: 'dhanyog', icon: '💰', description: 'Prosperity & wealth attracting remedies' },
    { _id: 'cat_4', name: 'Lakshmi Potli', slug: 'lakshmipotli', icon: '🪔', description: 'Auspicious blessed gift potlis' }
];

// =============================================================
// INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    initAdminUsers();
    setupAuth();
    setupMobileSidebar();
    setupEventListeners();

    if (token) {
        showAdminApp();
        refreshAllData();
    } else {
        showLoginModal();
    }
});

// Seed admin accounts if none exist
function initAdminUsers() {
    if (!localStorage.getItem('avs_admin_users')) {
        localStorage.setItem('avs_admin_users', JSON.stringify(DEFAULT_ADMIN_USERS));
    }
}

function getStoredAdminUsers() {
    try {
        const data = localStorage.getItem('avs_admin_users');
        return data ? JSON.parse(data) : DEFAULT_ADMIN_USERS;
    } catch (e) {
        return DEFAULT_ADMIN_USERS;
    }
}

function saveStoredAdminUsers(users) {
    localStorage.setItem('avs_admin_users', JSON.stringify(users));
}

// =============================================================
// AUTHENTICATION & ACCESS CONTROL
// =============================================================

function setupAuth() {
    const loginForm = document.getElementById('adminLoginForm');
    const registerForm = document.getElementById('adminRegisterForm');

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('loginSubmitBtn');
            const usernameInput = document.getElementById('adminUsername').value.trim();
            const passwordInput = document.getElementById('adminPassword').value.trim();
            const rememberMe = document.getElementById('rememberMe')?.checked ?? true;

            if (!usernameInput || !passwordInput) {
                showAuthAlert('Please enter both username and password.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            }

            let loginSuccess = false;
            let loggedUser = null;

            // Step 1: Try backend API if reachable
            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameInput, password: passwordInput })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.token) {
                        token = data.token;
                        loggedUser = data.user || {
                            username: usernameInput,
                            fullName: data.name || usernameInput,
                            role: data.role || 'Master Admin'
                        };
                        loginSuccess = true;
                    }
                }
            } catch (err) {
                // Backend not running, proceed to fallback local verification
                console.log('Backend not reached, checking local admin accounts...');
            }

            // Step 2: Fallback local accounts verification
            if (!loginSuccess) {
                const adminUsers = getStoredAdminUsers();
                const matchedUser = adminUsers.find(u => 
                    (u.username.toLowerCase() === usernameInput.toLowerCase() || 
                     (u.email && u.email.toLowerCase() === usernameInput.toLowerCase())) &&
                    u.password === passwordInput
                );

                if (matchedUser) {
                    token = 'avs_admin_token_' + Date.now();
                    loggedUser = {
                        id: matchedUser.id,
                        username: matchedUser.username,
                        fullName: matchedUser.fullName || matchedUser.username,
                        email: matchedUser.email,
                        role: matchedUser.role || 'Master Admin'
                    };
                    loginSuccess = true;
                }
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Admin Panel';
            }

            if (loginSuccess) {
                currentUser = loggedUser;
                if (rememberMe) {
                    localStorage.setItem('admin_token', token);
                    localStorage.setItem('admin_user', JSON.stringify(currentUser));
                } else {
                    sessionStorage.setItem('admin_token', token);
                    sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
                    localStorage.removeItem('admin_token');
                }

                showAuthAlert(`✓ Welcome back, ${currentUser.fullName || currentUser.username}! Loading admin panel...`, 'success');

                setTimeout(() => {
                    showAdminApp();
                    refreshAllData();
                }, 400);
            } else {
                showAuthAlert('Invalid credentials! Please check your username/password or use default: admin / admin123', 'error');
            }
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('registerSubmitBtn');
            const fullName = document.getElementById('regFullName').value.trim();
            const username = document.getElementById('regUsername').value.trim();
            const role = document.getElementById('regRole').value;
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const secretCode = document.getElementById('regSecretCode').value.trim();

            // Validation 1: Passkey security check
            if (secretCode.toUpperCase() !== 'ASTRO2026') {
                showAuthAlert('Invalid Admin Security Passkey! Registration is restricted to authorized staff (Passkey: ASTRO2026).', 'error');
                return;
            }

            // Validation 2: Password match
            if (password !== confirmPassword) {
                showAuthAlert('Passwords do not match! Please check and re-type.', 'error');
                return;
            }

            // Validation 3: Password length
            if (password.length < 6) {
                showAuthAlert('Password must be at least 6 characters long.', 'error');
                return;
            }

            const adminUsers = getStoredAdminUsers();

            // Validation 4: Duplicate username check
            if (adminUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                showAuthAlert(`Username "${username}" is already taken. Please choose another username.`, 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
            }

            const newAdmin = {
                id: Date.now(),
                fullName,
                username,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };

            // Optional API call if backend available
            try {
                await fetch(`${API_BASE}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAdmin)
                });
            } catch (err) {
                console.log('Backend register endpoint not active, storing locally.');
            }

            // Save in localStorage
            adminUsers.push(newAdmin);
            saveStoredAdminUsers(adminUsers);

            // Automatically log in as new user
            token = 'avs_admin_token_' + Date.now();
            currentUser = {
                id: newAdmin.id,
                username: newAdmin.username,
                fullName: newAdmin.fullName,
                email: newAdmin.email,
                role: newAdmin.role
            };

            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(currentUser));

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-check"></i> Register Admin Account';
            }

            showAuthAlert(`🎉 Admin account created successfully! Welcome, ${fullName}! Accessing dashboard...`, 'success');

            setTimeout(() => {
                showAdminApp();
                refreshAllData();
            }, 600);
        });
    }
}

// Switch between Login and Register tabs
function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabBtnLogin');
    const tabRegister = document.getElementById('tabBtnRegister');
    const loginForm = document.getElementById('adminLoginForm');
    const registerForm = document.getElementById('adminRegisterForm');
    const authAlert = document.getElementById('authAlert');

    if (authAlert) authAlert.style.display = 'none';

    if (tab === 'login') {
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (registerForm) registerForm.style.display = 'none';
    } else {
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
        if (registerForm) registerForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
    }
}

// Show alert banner on auth gateway
function showAuthAlert(msg, type = 'error') {
    const alertEl = document.getElementById('authAlert');
    if (!alertEl) return;
    alertEl.className = `auth-alert ${type}`;
    alertEl.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> <span>${msg}</span>`;
    alertEl.style.display = 'flex';
}

// Toggle password visibility (eye icon)
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
}

// Show admin panel after auth
function showAdminApp() {
    const gateway = document.getElementById('adminAuthGateway');
    if (gateway) gateway.classList.add('hidden');

    // Update admin user badge in top bar
    const nameEl = document.getElementById('currentAdminName');
    const badgeEl = document.getElementById('currentUserBadge');

    if (currentUser) {
        if (nameEl) nameEl.textContent = currentUser.fullName || currentUser.username;
        if (badgeEl) {
            badgeEl.title = `Role: ${currentUser.role || 'Admin'}`;
        }
    }
}

// Show login gateway
function showLoginModal() {
    const gateway = document.getElementById('adminAuthGateway');
    if (gateway) {
        gateway.classList.remove('hidden');
        switchAuthTab('login');
    }
}

// Logout Admin
function logout() {
    if (!confirm('Are you sure you want to log out of the admin panel?')) return;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    token = null;
    currentUser = null;

    // Close mobile sidebar if open
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';

    showLoginModal();
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// =============================================================
// MOBILE RESPONSIVENESS & SIDEBAR CONTROLS
// =============================================================

function setupMobileSidebar() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const topBarToggleBtn = document.getElementById('topBarToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('adminSidebar');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('show');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (topBarToggleBtn) topBarToggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Auto-close sidebar when clicking any navigation link on mobile
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                closeSidebar();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            closeProductModal();
            closeOrderDetailModal();
            closeSpecialDetailModal();
        }
    });

    // Auto adjust on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
            closeSidebar();
        }
    });
}

// =============================================================
// REFRESH ALL DATA & TABS
// =============================================================

async function refreshAllData() {
    await Promise.all([
        loadProducts(),
        loadCategories(),
        loadOrders(),
        loadSpecialRequests(),
        loadNumerologyReports(),
        loadContacts(),
        loadReviews()
    ]);
    updateDashboardStats();
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    const titles = {
        'dashboard': 'Dashboard Overview',
        'products': 'Product Management Catalog',
        'categories': 'Category Management (Dynamic)',
        'orders': 'Customer Website Orders',
        'special-bracelets': 'Special & Customized Bracelet Requests',
        'numerology': '₹51 Numerology Reports & Recommendations',
        'contacts': 'Customer Inquiries & Contact Messages',
        'reviews': 'Customer Product Feedback & Reviews'
    };
    
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-boxes"></i> ${titles[tabId] || 'Admin Panel'}`;
    }

    if (tabId === 'products') loadProducts();
    if (tabId === 'categories') loadCategories();
    if (tabId === 'orders') loadOrders();
    if (tabId === 'special-bracelets') loadSpecialRequests();
    if (tabId === 'numerology') loadNumerologyReports();
    if (tabId === 'contacts') loadContacts();
    if (tabId === 'reviews') loadReviews();
    if (tabId === 'dashboard') updateDashboardStats();
}

function setupEventListeners() {
    // Nav links
    document.querySelectorAll('.nav-link[data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(btn.dataset.tab);
        });
    });

    // Product image upload preview & support
    const fileInput = document.getElementById('productImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const statusEl = document.getElementById('uploadStatus');
            statusEl.style.color = '#0288d1';
            statusEl.textContent = 'Processing image...';

            // Try backend upload
            try {
                const formData = new FormData();
                formData.append('image', file);

                const res = await fetch(`${API_BASE}/products/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.imageUrl) {
                        document.getElementById('productImageUrl').value = data.imageUrl;
                        statusEl.style.color = 'green';
                        statusEl.textContent = '✓ Uploaded successfully!';
                        return;
                    }
                }
            } catch (err) {
                // Backend upload failed, fallback to local FileReader data URI
            }

            // Fallback: Read as base64 data URL
            const reader = new FileReader();
            reader.onload = function(evt) {
                document.getElementById('productImageUrl').value = evt.target.result;
                statusEl.style.color = 'green';
                statusEl.textContent = '✓ Image ready for save!';
            };
            reader.readAsDataURL(file);
        });
    }

    // Product Form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProduct();
        });
    }
}

// =============================================================
// 1. PRODUCTS MANAGEMENT
// =============================================================

async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
            productsData = await res.json();
            localStorage.setItem('avs_admin_products', JSON.stringify(productsData));
            renderProductsTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback to localStorage or default products
    }

    const saved = localStorage.getItem('avs_admin_products');
    if (saved) {
        try {
            productsData = JSON.parse(saved);
        } catch (e) {
            productsData = [...DEFAULT_ADMIN_PRODUCTS];
        }
    } else {
        productsData = [...DEFAULT_ADMIN_PRODUCTS];
        localStorage.setItem('avs_admin_products', JSON.stringify(productsData));
    }

    renderProductsTable();
    updateDashboardStats();
}

function renderProductsTable() {
    const tbody = document.querySelector('#productTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!productsData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No products found in catalog. Click "Add New Product" to create one.</td></tr>';
        return;
    }

    productsData.forEach(p => {
        const defImg = '../website/Images/bracelet-default.jpeg';
        let imgSrc = p.image || defImg;
        if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:') && !imgSrc.startsWith('../') && !imgSrc.startsWith('/')) {
            imgSrc = `../website/${imgSrc}`;
        }

        const visual = `<img src="${imgSrc}" class="product-img" onerror="this.src='${defImg}'" alt="${escapeHtml(p.name)}">`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td>${visual}</td>
            <td>
                <strong>${escapeHtml(p.name)}</strong>
                ${p.badge ? `<br><small style="color:var(--primary);font-weight:600;">🏷️ ${escapeHtml(p.badge)}</small>` : ''}
            </td>
            <td><span style="text-transform:capitalize;">${escapeHtml(p.category)}</span></td>
            <td><strong>₹${p.price}</strong> <span style="text-decoration:line-through;color:#999;font-size:12px;">₹${p.mrp || ''}</span></td>
            <td>
                <span class="status-pill ${p.inStock ? 'status-confirmed' : 'status-cancelled'}">
                    ${p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'flex';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('uploadStatus').textContent = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productInStock').checked = true;
    document.getElementById('productIsFeatured').checked = true;
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

function editProduct(id) {
    const p = productsData.find(x => x.id === id);
    if (!p) return;

    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name || '';
    document.getElementById('productCategory').value = p.category || 'bracelets';
    document.getElementById('productSubcategory').value = p.subcategory || '';
    document.getElementById('productPrice').value = p.price || 0;
    document.getElementById('productMrp').value = p.mrp || 0;
    document.getElementById('productDiscount').value = p.discount || 0;
    document.getElementById('productBadge').value = p.badge || '';
    document.getElementById('productEmoji').value = p.emoji || '';
    document.getElementById('productImageUrl').value = p.image || '';
    document.getElementById('productDesc').value = p.shortDesc || '';
    document.getElementById('productInStock').checked = Boolean(p.inStock);
    document.getElementById('productIsFeatured').checked = Boolean(p.isFeatured);
    document.getElementById('productIsNew').checked = Boolean(p.isNew || p.isNewProduct);
    document.getElementById('uploadStatus').textContent = '';

    document.getElementById('modalTitle').textContent = `Edit Product #${p.id}`;
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'flex';
}

async function saveProduct() {
    const idVal = document.getElementById('productId').value;
    const isEditing = Boolean(idVal);
    const existingId = isEditing ? Number(idVal) : (productsData.length ? Math.max(...productsData.map(p => Number(p.id) || 0)) + 1 : 1);

    const product = {
        id: existingId,
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value.trim(),
        price: Number(document.getElementById('productPrice').value) || 0,
        mrp: Number(document.getElementById('productMrp').value) || Number(document.getElementById('productPrice').value) || 0,
        discount: Number(document.getElementById('productDiscount').value) || 0,
        badge: document.getElementById('productBadge').value.trim(),
        emoji: document.getElementById('productEmoji').value.trim() || '💎',
        image: document.getElementById('productImageUrl').value.trim() || '../website/Images/bracelet-default.jpeg',
        shortDesc: document.getElementById('productDesc').value.trim(),
        inStock: document.getElementById('productInStock').checked,
        isFeatured: document.getElementById('productIsFeatured').checked,
        isNew: document.getElementById('productIsNew').checked
    };

    // Try API
    let apiSaved = false;
    try {
        const url = isEditing ? `${API_BASE}/products/${idVal}` : `${API_BASE}/products`;
        const method = isEditing ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(product)
        });
        if (res.ok) apiSaved = true;
    } catch (e) {
        // Backend not online
    }

    // Always update local dataset
    if (isEditing) {
        const idx = productsData.findIndex(x => x.id === existingId);
        if (idx !== -1) productsData[idx] = product;
    } else {
        productsData.unshift(product);
    }

    localStorage.setItem('avs_admin_products', JSON.stringify(productsData));
    closeProductModal();
    renderProductsTable();
    updateDashboardStats();
    alert('✓ Product saved successfully!');
}

async function deleteProduct(id) {
    if (!confirm(`Are you sure you want to delete Product #${id}?`)) return;

    try {
        await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    productsData = productsData.filter(x => x.id !== id);
    localStorage.setItem('avs_admin_products', JSON.stringify(productsData));
    renderProductsTable();
    updateDashboardStats();
}

// =============================================================
// 2. WEBSITE ORDERS MANAGEMENT
// =============================================================

async function loadOrders() {
    try {
        const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeaders() });
        if (res.ok) {
            ordersData = await res.json();
            localStorage.setItem('avs_orders', JSON.stringify(ordersData));
            renderOrdersTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_orders');
    if (saved) {
        try {
            ordersData = JSON.parse(saved);
        } catch (e) {
            ordersData = [];
        }
    } else {
        ordersData = [
            {
                orderId: 'AVS-10492',
                createdAt: new Date().toISOString(),
                customer: {
                    name: 'Rajesh Sharma',
                    mobile: '9820112345',
                    address: 'Flat 402, Lotus Residency, Andheri West',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400053'
                },
                items: [
                    { id: 2, name: 'Citrine Wealth Bracelet', emoji: '💛', price: 699, qty: 1 },
                    { id: 3, name: 'Pyrite Golden Money Bracelet', emoji: '✨', price: 799, qty: 1 }
                ],
                subtotal: 1498,
                discount: 100,
                shipping: 0,
                total: 1398,
                paymentMethod: 'UPI / Online',
                paymentStatus: 'Paid',
                orderStatus: 'Processing'
            }
        ];
        localStorage.setItem('avs_orders', JSON.stringify(ordersData));
    }

    renderOrdersTable();
    updateDashboardStats();
}

function renderOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!ordersData.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No website orders placed yet. Orders from checkout will appear here!</td></tr>';
        return;
    }

    ordersData.forEach(order => {
        const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const itemsSummary = (order.items || []).map(i => `${i.name} (x${i.qty})`).join(', ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${order.orderId}</strong><br>
                <small style="color:#777;">${dateStr}</small>
            </td>
            <td>
                <strong>${escapeHtml(order.customer?.name || 'Customer')}</strong><br>
                <small>📞 <a href="tel:${order.customer?.mobile || ''}">${order.customer?.mobile || ''}</a></small><br>
                <small style="color:#666;">${escapeHtml(order.customer?.city || '')} ${escapeHtml(order.customer?.state || '')}</small>
            </td>
            <td style="max-width:240px;">
                <span title="${escapeHtml(itemsSummary)}" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                    ${escapeHtml(itemsSummary || 'Items')}
                </span>
                <small style="color:#888;">${(order.items || []).length} item(s)</small>
            </td>
            <td>
                <strong>₹${order.total || 0}</strong><br>
                <span class="status-pill status-${(order.paymentStatus || 'paid').toLowerCase()}">${order.paymentStatus || 'Paid'}</span>
            </td>
            <td>
                <select onchange="updateOrderStatus('${order.orderId}', this.value)" style="padding:6px;border-radius:4px;font-size:12px;font-weight:600;">
                    ${['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => `
                        <option value="${st}" ${order.orderStatus === st ? 'selected' : ''}>${st}</option>
                    `).join('')}
                </select>
            </td>
            <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.orderId}')"><i class="fas fa-eye"></i> View</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.orderId}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ orderStatus: newStatus })
        });
    } catch (e) {
        // Offline
    }

    const order = ordersData.find(o => o.orderId === orderId);
    if (order) {
        order.orderStatus = newStatus;
        localStorage.setItem('avs_orders', JSON.stringify(ordersData));
    }
}

function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');

    content.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="label">Order ID</div>
                <div class="val">${order.orderId}</div>
            </div>
            <div class="detail-item">
                <div class="label">Order Date</div>
                <div class="val">${new Date(order.createdAt || Date.now()).toLocaleString('en-IN')}</div>
            </div>
            <div class="detail-item">
                <div class="label">Customer Name</div>
                <div class="val">${escapeHtml(order.customer?.name || '')}</div>
            </div>
            <div class="detail-item">
                <div class="label">Mobile Number</div>
                <div class="val"><a href="tel:${order.customer?.mobile || ''}">📞 ${order.customer?.mobile || ''}</a></div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Delivery Address</div>
                <div class="val">${escapeHtml(order.customer?.address || '')}, ${escapeHtml(order.customer?.city || '')} - ${escapeHtml(order.customer?.pincode || '')}</div>
            </div>
            <div class="detail-item">
                <div class="label">Payment Method</div>
                <div class="val">${order.paymentMethod || 'Razorpay / Online'} (${order.paymentStatus || 'Paid'})</div>
            </div>
            <div class="detail-item">
                <div class="label">Order Status</div>
                <div class="val"><b>${order.orderStatus || 'Placed'}</b></div>
            </div>
        </div>

        <h3 style="margin-bottom:12px;font-size:15px;">📦 Items Ordered</h3>
        <div class="table-responsive">
            <table style="margin-bottom:16px;">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${(order.items || []).map(item => `
                        <tr>
                            <td>${item.emoji || '📦'} ${escapeHtml(item.name)}</td>
                            <td>₹${item.price}</td>
                            <td>${item.qty}</td>
                            <td>₹${item.price * item.qty}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="text-align:right;border-top:1px solid #eee;padding-top:10px;">
            <p style="font-size:13px;color:#555;">Subtotal: ₹${order.subtotal || order.total}</p>
            <p style="font-size:13px;color:#555;">Discount: −₹${order.discount || 0}</p>
            <h3 style="color:var(--primary);margin-top:6px;">Grand Total: ₹${order.total}</h3>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeOrderDetailModal() {
    const modal = document.getElementById('orderDetailModal');
    if (modal) modal.style.display = 'none';
}

async function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
        await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    ordersData = ordersData.filter(o => o.orderId !== orderId && o._id !== orderId);
    localStorage.setItem('avs_orders', JSON.stringify(ordersData));
    renderOrdersTable();
    updateDashboardStats();
}

// =============================================================
// 3. SPECIAL BRACELET REQUESTS
// =============================================================

async function loadSpecialRequests() {
    try {
        const res = await fetch(`${API_BASE}/special-bracelets`, { headers: getAuthHeaders() });
        if (res.ok) {
            specialRequestsData = await res.json();
            localStorage.setItem('avs_special_requests', JSON.stringify(specialRequestsData));
            renderSpecialRequestsTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_special_requests');
    if (saved) {
        try {
            specialRequestsData = JSON.parse(saved);
        } catch (e) {
            specialRequestsData = [];
        }
    } else {
        specialRequestsData = [
            {
                requestId: 'SP-9921',
                createdAt: new Date().toISOString(),
                status: 'New Request',
                pricing: { finalPrice: 999 },
                personDetails: {
                    fullName: 'Ananya Deshmukh',
                    gender: 'Female',
                    dob: '1995-08-14',
                    birthTime: '10:45 AM',
                    birthPlace: 'Pune, Maharashtra',
                    rashi: 'Mesh (Aries)',
                    nakshatra: 'Ashwini',
                    gotra: 'Kashyap'
                },
                customization: {
                    primaryPurpose: 'Career Growth & Financial Stability',
                    wristSize: '6.5 inches',
                    beadSize: '8mm',
                    preferredStones: ['Pyrite', 'Citrine', 'Tiger Eye'],
                    specialConcerns: 'Experiencing financial hurdles and mental stress in business startup.'
                },
                customer: {
                    name: 'Vikas Deshmukh',
                    mobile: '9822098765',
                    address: 'B-12 Shanti Nagar, Kothrud',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411038'
                }
            }
        ];
        localStorage.setItem('avs_special_requests', JSON.stringify(specialRequestsData));
    }

    renderSpecialRequestsTable();
    updateDashboardStats();
}

function renderSpecialRequestsTable() {
    const tbody = document.querySelector('#specialRequestsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!specialRequestsData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No special bracelet requests yet. When a customer customizes a bracelet, it will appear here!</td></tr>';
        return;
    }

    specialRequestsData.forEach(req => {
        const person = req.personDetails || {};
        const custom = req.customization || {};
        const customer = req.customer || {};

        const whatsappNumber = (customer.whatsapp || customer.mobile || '').replace(/\D/g, '');
        const whatsappLink = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Namaste ${customer.name}, Regarding your Special Bracelet request (${req.requestId}) for ${person.fullName}...`)}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${req.requestId}</strong><br>
                <small style="color:#777;">${new Date(req.createdAt || Date.now()).toLocaleDateString('en-IN')}</small>
            </td>
            <td>
                <div class="special-person-box">
                    <strong>👤 ${escapeHtml(person.fullName || 'N/A')}</strong> (${person.gender || ''})<br>
                    <span>📅 DOB: ${escapeHtml(person.dob || '')}</span> ${person.birthTime ? `⏰ ${escapeHtml(person.birthTime)}` : ''}<br>
                    <span>📍 Place: ${escapeHtml(person.birthPlace || 'Not specified')}</span>
                    ${person.rashi ? `<br><span>♈ Rashi: <b>${escapeHtml(person.rashi)}</b></span>` : ''}
                </div>
            </td>
            <td>
                <strong>🎯 ${escapeHtml(custom.primaryPurpose || 'Healing')}</strong><br>
                <small>📏 Wrist: <b>${escapeHtml(custom.wristSize || '')}</b></small><br>
                <small style="color:#666;">Stones: ${escapeHtml((custom.preferredStones || []).join(', ') || 'Consultant choice')}</small>
            </td>
            <td>
                <strong>${escapeHtml(customer.name)}</strong><br>
                <small>📞 ${customer.mobile}</small><br>
                <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp btn-sm" style="margin-top:4px;">
                    <i class="fab fa-whatsapp"></i> Chat
                </a>
            </td>
            <td>
                <strong>₹${(req.pricing && req.pricing.finalPrice) || 999}</strong>
            </td>
            <td>
                <select onchange="updateSpecialRequestStatus('${req.requestId}', this.value)" style="padding:6px;border-radius:4px;font-size:12px;font-weight:600;">
                    ${['New Request', 'Kundli Analysis Done', 'In Making', 'Abhimantrit / Energized', 'Dispatched', 'Delivered', 'Cancelled'].map(st => `
                        <option value="${st}" ${req.status === st ? 'selected' : ''}>${st}</option>
                    `).join('')}
                </select>
            </td>
            <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="viewSpecialDetails('${req.requestId}')"><i class="fas fa-eye"></i> Details</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSpecialRequest('${req.requestId}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateSpecialRequestStatus(requestId, status) {
    try {
        await fetch(`${API_BASE}/special-bracelets/${requestId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
    } catch (e) {
        // Offline
    }

    const req = specialRequestsData.find(r => r.requestId === requestId);
    if (req) {
        req.status = status;
        localStorage.setItem('avs_special_requests', JSON.stringify(specialRequestsData));
    }
}

function viewSpecialDetails(requestId) {
    const req = specialRequestsData.find(r => r.requestId === requestId);
    if (!req) return;

    const person = req.personDetails || {};
    const custom = req.customization || {};
    const customer = req.customer || {};

    const modal = document.getElementById('specialDetailModal');
    const content = document.getElementById('specialDetailContent');

    content.innerHTML = `
        <div style="background:#fff7ea;border:1px solid #ffd591;padding:16px;border-radius:10px;margin-bottom:20px;">
            <h3 style="color:#d46b08;margin-bottom:8px;font-size:16px;">✨ Special Person Astrology Data</h3>
            <div class="detail-grid" style="margin-bottom:0;">
                <div class="detail-item">
                    <div class="label">Person Full Name</div>
                    <div class="val"><strong>${escapeHtml(person.fullName || '')}</strong> (${person.gender || ''})</div>
                </div>
                <div class="detail-item">
                    <div class="label">Date of Birth</div>
                    <div class="val">📅 ${escapeHtml(person.dob || '')}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Time of Birth</div>
                    <div class="val">⏰ ${escapeHtml(person.birthTime || 'Not provided')}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Place of Birth</div>
                    <div class="val">📍 ${escapeHtml(person.birthPlace || 'Not provided')}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Rashi / Zodiac Sign</div>
                    <div class="val">♈ ${escapeHtml(person.rashi || 'Not provided')}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Nakshatra / Gotra</div>
                    <div class="val">⭐ ${escapeHtml(person.nakshatra || '')} / ${escapeHtml(person.gotra || 'N/A')}</div>
                </div>
            </div>
        </div>

        <h3 style="margin-bottom:12px;font-size:15px;">🔮 Bracelet Customization &amp; Energy Intention</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="label">Primary Life Purpose</div>
                <div class="val"><strong>${escapeHtml(custom.primaryPurpose || '')}</strong></div>
            </div>
            <div class="detail-item">
                <div class="label">Wrist Size</div>
                <div class="val">📏 ${escapeHtml(custom.wristSize || '')} (Beads: ${escapeHtml(custom.beadSize || '8mm')})</div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Selected Stones / Crystals</div>
                <div class="val">${escapeHtml((custom.preferredStones || []).join(', ') || 'Consultant choice')}</div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Concerns / Kundli Problems Described</div>
                <div class="val" style="background:#fff;padding:8px;border-radius:4px;border:1px solid #e0e0e0;">
                    ${escapeHtml(custom.specialConcerns || 'None provided')}
                </div>
            </div>
        </div>

        <h3 style="margin-bottom:12px;font-size:15px;">📦 Delivery &amp; Customer Contact</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="label">Ordered By (Customer)</div>
                <div class="val">${escapeHtml(customer.name || '')}</div>
            </div>
            <div class="detail-item">
                <div class="label">Mobile &amp; WhatsApp</div>
                <div class="val">📞 ${escapeHtml(customer.mobile || '')}</div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Full Shipping Address</div>
                <div class="val">${escapeHtml(customer.address || '')}, ${escapeHtml(customer.city || '')} - ${escapeHtml(customer.pincode || '')}</div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeSpecialDetailModal() {
    const modal = document.getElementById('specialDetailModal');
    if (modal) modal.style.display = 'none';
}

async function deleteSpecialRequest(requestId) {
    if (!confirm('Are you sure you want to delete this special bracelet request?')) return;

    try {
        await fetch(`${API_BASE}/special-bracelets/${requestId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    specialRequestsData = specialRequestsData.filter(r => r.requestId !== requestId && r._id !== requestId);
    localStorage.setItem('avs_special_requests', JSON.stringify(specialRequestsData));
    renderSpecialRequestsTable();
    updateDashboardStats();
}

// =============================================================
// 4. CATEGORIES MANAGEMENT (DYNAMIC)
// =============================================================

async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) {
            categoriesData = await res.json();
            localStorage.setItem('avs_categories', JSON.stringify(categoriesData));
            renderCategoriesTable();
            populateCategoryDropdown();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_categories');
    if (saved) {
        try {
            categoriesData = JSON.parse(saved);
        } catch (e) {
            categoriesData = [...DEFAULT_ADMIN_CATEGORIES];
        }
    } else {
        categoriesData = [...DEFAULT_ADMIN_CATEGORIES];
        localStorage.setItem('avs_categories', JSON.stringify(categoriesData));
    }

    renderCategoriesTable();
    populateCategoryDropdown();
}

function renderCategoriesTable() {
    const tbody = document.querySelector('#categoryTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!categoriesData.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:25px;color:#888;">No custom categories found.</td></tr>';
        return;
    }

    categoriesData.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size:24px;">${c.icon || '💎'}</td>
            <td><strong>${escapeHtml(c.name)}</strong></td>
            <td><code>${escapeHtml(c.slug)}</code></td>
            <td style="color:#666;">${escapeHtml(c.description || '—')}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory('${c.slug || c._id}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateCategoryDropdown() {
    const select = document.getElementById('productCategory');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '';

    categoriesData.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name;
        if (opt.value === currentVal) opt.selected = true;
        select.appendChild(opt);
    });
}

async function saveCategory(e) {
    e.preventDefault();
    const name = document.getElementById('catName').value.trim();
    let slug = document.getElementById('catSlug').value.trim();
    const icon = document.getElementById('catIcon').value.trim() || '💎';
    const description = document.getElementById('catDesc').value.trim();

    if (!slug) {
        slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const newCategory = {
        _id: 'cat_' + Date.now(),
        name,
        slug,
        icon,
        description
    };

    try {
        await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newCategory)
        });
    } catch (err) {
        // Offline
    }

    categoriesData.push(newCategory);
    localStorage.setItem('avs_categories', JSON.stringify(categoriesData));
    document.getElementById('addCategoryForm').reset();
    renderCategoriesTable();
    populateCategoryDropdown();
    alert('✓ Category created successfully!');
}

async function deleteCategory(idOrSlug) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        await fetch(`${API_BASE}/categories/${idOrSlug}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    categoriesData = categoriesData.filter(c => c._id !== idOrSlug && c.slug !== idOrSlug);
    localStorage.setItem('avs_categories', JSON.stringify(categoriesData));
    renderCategoriesTable();
    populateCategoryDropdown();
}

// =============================================================
// 5. CONTACT US MESSAGES & INQUIRIES
// =============================================================

async function loadContacts() {
    try {
        const res = await fetch(`${API_BASE}/contacts`, { headers: getAuthHeaders() });
        if (res.ok) {
            contactsData = await res.json();
            localStorage.setItem('avs_contact_messages', JSON.stringify(contactsData));
            renderContactsTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_contact_messages');
    if (saved) {
        try {
            contactsData = JSON.parse(saved);
        } catch (e) {
            contactsData = [];
        }
    } else {
        contactsData = [
            {
                _id: 'cnt_1',
                name: 'Pooja Kulkarni',
                mobile: '9823456789',
                email: 'pooja.k@gmail.com',
                subject: 'Kundli Bracelet Recommendation',
                message: 'Hello, which bracelet is best for job promotion and health for Makar rashi?',
                status: 'New',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('avs_contact_messages', JSON.stringify(contactsData));
    }

    renderContactsTable();
    updateDashboardStats();
}

function renderContactsTable() {
    const tbody = document.querySelector('#contactsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!contactsData.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No contact inquiries yet. Website contact messages will appear here.</td></tr>';
        return;
    }

    contactsData.forEach(c => {
        const dateStr = new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const cleanMobile = (c.mobile || '').replace(/\D/g, '');
        const waLink = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(`Namaste ${c.name}, Thank you for contacting Astro Vastu Setu regarding "${c.subject || 'your inquiry'}". How can we assist you?`)}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><small style="color:#777;">${dateStr}</small></td>
            <td>
                <strong>${escapeHtml(c.name)}</strong><br>
                <span class="status-pill status-placed" style="font-size:11px;">${escapeHtml(c.subject || 'General Inquiry')}</span>
            </td>
            <td>
                <div>📞 <a href="tel:${c.mobile}">${escapeHtml(c.mobile)}</a></div>
                ${c.email ? `<small>📧 ${escapeHtml(c.email)}</small><br>` : ''}
                <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-sm" style="margin-top:5px;">
                    <i class="fab fa-whatsapp"></i> Chat WhatsApp
                </a>
            </td>
            <td style="max-width:300px;">
                <div style="background:#fdfcf9;border:1px solid #eee;border-radius:6px;padding:8px;font-size:12.5px;color:#444;">
                    ${escapeHtml(c.message)}
                </div>
            </td>
            <td>
                <select onchange="updateContactStatus('${c._id}', this.value)" style="padding:6px;border-radius:4px;font-size:12px;font-weight:600;">
                    ${['New', 'Contacted', 'Resolved'].map(st => `
                        <option value="${st}" ${c.status === st ? 'selected' : ''}>${st}</option>
                    `).join('')}
                </select>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteContact('${c._id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateContactStatus(id, status) {
    try {
        await fetch(`${API_BASE}/contacts/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
    } catch (e) {
        // Offline
    }

    const c = contactsData.find(x => x._id === id);
    if (c) {
        c.status = status;
        localStorage.setItem('avs_contact_messages', JSON.stringify(contactsData));
        updateDashboardStats();
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
        await fetch(`${API_BASE}/contacts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    contactsData = contactsData.filter(c => c._id !== id);
    localStorage.setItem('avs_contact_messages', JSON.stringify(contactsData));
    renderContactsTable();
    updateDashboardStats();
}

// =============================================================
// 6. NUMEROLOGY REPORTS
// =============================================================

async function loadNumerologyReports() {
    try {
        const res = await fetch(`${API_BASE}/numerology-orders`, { headers: getAuthHeaders() });
        if (res.ok) {
            numerologyData = await res.json();
            localStorage.setItem('avs_numerology_reports', JSON.stringify(numerologyData));
            renderNumerologyTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_numerology_reports');
    if (saved) {
        try {
            numerologyData = JSON.parse(saved);
        } catch (e) {
            numerologyData = [];
        }
    } else {
        numerologyData = [
            {
                _id: 'num_1',
                reportId: 'NUM-8842',
                createdAt: new Date().toISOString(),
                customer: {
                    name: 'Mahesh Joshi',
                    whatsapp: '9890123456',
                    email: 'mahesh.joshi@gmail.com',
                    dob: '1992-05-23',
                    purpose: 'Wealth & Prosperity'
                },
                numerology: {
                    mulank: 5,
                    bhagyank: 4,
                    rulingPlanet: 'Mercury (Budh)'
                },
                recommendation: {
                    braceletName: 'Pyrite & Green Aventurine Bracelet',
                    braceletPrice: 699,
                    braceletImage: '../website/Images/bracelet-pyrite.jpeg'
                },
                payment: { amount: 51, status: 'Paid' },
                reportStatus: 'Generated'
            }
        ];
        localStorage.setItem('avs_numerology_reports', JSON.stringify(numerologyData));
    }

    renderNumerologyTable();
    updateDashboardStats();
}

function renderNumerologyTable() {
    const tbody = document.querySelector('#numerologyTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!numerologyData.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:#888;">No numerology report requests yet. Submissions from "Find My Bracelet" will appear here.</td></tr>';
        return;
    }

    numerologyData.forEach(r => {
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
        const braceletImg = r.recommendation && r.recommendation.braceletImage
            ? `<img src="${r.recommendation.braceletImage}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:6px;" onerror="this.src='../website/Images/bracelet-default.jpeg'">`
            : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span style="background:#ede9fe;color:#6d28d9;font-weight:700;padding:4px 8px;border-radius:6px;font-size:12px;">${escapeHtml(r.reportId)}</span>
                <br><small style="color:#888;">${dateStr}</small>
            </td>
            <td>
                <strong>${escapeHtml(r.customer?.name || '')}</strong><br>
                <a href="tel:${escapeHtml(r.customer?.whatsapp || '')}" style="font-size:12px;color:var(--dark);"><i class="fas fa-phone-alt"></i> ${escapeHtml(r.customer?.whatsapp || '')}</a>
            </td>
            <td>
                <strong>🎂 ${escapeHtml(r.customer?.dob || '')}</strong><br>
                <small style="color:#b45309;font-weight:600;">🎯 ${escapeHtml(r.customer?.purpose || '')}</small>
            </td>
            <td>
                <span style="display:inline-block;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:12px;font-weight:700;font-size:12px;">मूल्यांक: ${r.numerology ? r.numerology.mulank : '-'}</span>
                <span style="display:inline-block;background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:12px;font-weight:700;font-size:12px;margin-left:4px;">भाग्यांक: ${r.numerology ? r.numerology.bhagyank : '-'}</span>
            </td>
            <td>
                ${braceletImg}
                <strong>${escapeHtml(r.recommendation ? r.recommendation.braceletName : '')}</strong>
                <br><small style="color:#16a34a;font-weight:700;">₹${r.recommendation ? r.recommendation.braceletPrice : 699}</small>
            </td>
            <td>
                <span class="status-pill status-confirmed">₹51 Paid</span>
            </td>
            <td>
                <span class="status-pill ${r.reportStatus === 'Sent on WhatsApp' ? 'status-delivered' : 'status-confirmed'}">
                    ${escapeHtml(r.reportStatus || 'Generated')}
                </span>
            </td>
            <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <a href="../website/find-my-bracelet.html?reportId=${encodeURIComponent(r.reportId)}" target="_blank" class="btn btn-secondary btn-sm" title="Open Customer Report Page">
                        <i class="fas fa-file-alt"></i> View
                    </a>
                    <button class="btn btn-success btn-sm" onclick="sendNumerologyWhatsApp('${r.reportId}')" title="Send Report on WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteNumerologyReport('${r._id || r.reportId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function sendNumerologyWhatsApp(reportId) {
    const r = numerologyData.find(x => x.reportId === reportId);
    if (!r) return;

    const msg = `🔮 *Astro Vastu Setu - Numerology Bracelet Report*\n\n` +
        `नमस्कार ${r.customer?.name} जी! 🙏\n\n` +
        `तुमच्या जन्मतारखेच्या (${r.customer?.dob}) आधारावर तुमची Personalized Numerology Bracelet Recommendation तयार करण्यात आली आहे. ✨\n\n` +
        `🔢 *मूल्यांक:* ${r.numerology?.mulank} | *भाग्यांक:* ${r.numerology?.bhagyank}\n` +
        `✨ *Recommended Bracelet:* ${r.recommendation?.braceletName}\n` +
        `💰 *किंमत:* ₹${r.recommendation?.braceletPrice}\n\n` +
        `धन्यवाद! 🕉️ Astro Vastu Setu`;

    const cleanNum = (r.customer?.whatsapp || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/91${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    r.reportStatus = 'Sent on WhatsApp';
    localStorage.setItem('avs_numerology_reports', JSON.stringify(numerologyData));
    renderNumerologyTable();
}

async function deleteNumerologyReport(idOrReportId) {
    if (!confirm('Are you sure you want to delete this numerology report?')) return;

    try {
        await fetch(`${API_BASE}/numerology-orders/${idOrReportId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    numerologyData = numerologyData.filter(r => r._id !== idOrReportId && r.reportId !== idOrReportId);
    localStorage.setItem('avs_numerology_reports', JSON.stringify(numerologyData));
    renderNumerologyTable();
    updateDashboardStats();
}

// =============================================================
// 7. PRODUCT REVIEWS & FEEDBACK
// =============================================================

async function loadReviews() {
    try {
        const res = await fetch(`${API_BASE}/reviews`, { headers: getAuthHeaders() });
        if (res.ok) {
            reviewsData = await res.json();
            localStorage.setItem('avs_reviews', JSON.stringify(reviewsData));
            renderReviewsTable();
            updateDashboardStats();
            return;
        }
    } catch (err) {
        // Fallback
    }

    const saved = localStorage.getItem('avs_reviews');
    if (saved) {
        try {
            reviewsData = JSON.parse(saved);
        } catch (e) {
            reviewsData = [];
        }
    } else {
        reviewsData = [
            {
                _id: 'rev_1',
                productName: '7 Chakra Energy Bracelet',
                userName: 'Sneha Patil',
                rating: 5,
                comment: 'Very authentic original stones and soothing energy! Highly recommended.',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('avs_reviews', JSON.stringify(reviewsData));
    }

    renderReviewsTable();
    updateDashboardStats();
}

function renderReviewsTable() {
    const tbody = document.querySelector('#reviewsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!reviewsData.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No product reviews submitted yet. Feedback submitted by customers will appear here.</td></tr>';
        return;
    }

    reviewsData.forEach(r => {
        const dateStr = new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><small style="color:#777;">${dateStr}</small></td>
            <td><strong>${escapeHtml(r.productName || 'Product')}</strong></td>
            <td><strong>${escapeHtml(r.userName || 'Customer')}</strong></td>
            <td><span style="color:#f57c00;font-weight:700;">${'★'.repeat(r.rating || 5)} (${r.rating || 5}/5)</span></td>
            <td style="max-width:300px;"><div style="background:#fdfcf9;padding:8px;border-radius:6px;border:1px solid #eee;">${escapeHtml(r.comment)}</div></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteReview('${r._id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this customer feedback?')) return;

    try {
        await fetch(`${API_BASE}/reviews/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    } catch (e) {
        // Offline
    }

    reviewsData = reviewsData.filter(r => r._id !== id);
    localStorage.setItem('avs_reviews', JSON.stringify(reviewsData));
    renderReviewsTable();
    updateDashboardStats();
}

// =============================================================
// 8. DASHBOARD STATS
// =============================================================

function updateDashboardStats() {
    const prodCountEl = document.getElementById('totalProductsCount');
    const orderCountEl = document.getElementById('totalOrdersCount');
    const specialCountEl = document.getElementById('totalSpecialCount');
    const revenueEl = document.getElementById('totalRevenue');

    const badgeOrders = document.getElementById('badgeOrdersCount');
    const badgeSpecial = document.getElementById('badgeSpecialCount');
    const badgeNumerology = document.getElementById('badgeNumerologyCount');
    const badgeContacts = document.getElementById('badgeContactsCount');
    const badgeReviews = document.getElementById('badgeReviewsCount');

    if (prodCountEl) prodCountEl.textContent = productsData.length;
    if (orderCountEl) orderCountEl.textContent = ordersData.length;
    if (specialCountEl) specialCountEl.textContent = specialRequestsData.length;

    if (badgeOrders) {
        badgeOrders.textContent = ordersData.length;
        badgeOrders.style.display = ordersData.length ? 'inline-block' : 'none';
    }
    if (badgeSpecial) {
        badgeSpecial.textContent = specialRequestsData.length;
        badgeSpecial.style.display = specialRequestsData.length ? 'inline-block' : 'none';
    }
    if (badgeNumerology) {
        badgeNumerology.textContent = numerologyData.length;
        badgeNumerology.style.display = numerologyData.length ? 'inline-block' : 'none';
    }
    if (badgeContacts) {
        const newContacts = contactsData.filter(c => c.status === 'New').length;
        badgeContacts.textContent = newContacts || contactsData.length;
        badgeContacts.style.display = contactsData.length ? 'inline-block' : 'none';
    }
    if (badgeReviews) {
        badgeReviews.textContent = reviewsData.length;
        badgeReviews.style.display = reviewsData.length ? 'inline-block' : 'none';
    }

    const totalRev = ordersData.reduce((sum, o) => sum + (Number(o.total) || 0), 0) +
        specialRequestsData.reduce((sum, s) => sum + (Number(s.pricing && s.pricing.finalPrice) || 0), 0) +
        numerologyData.reduce((sum, n) => sum + (Number(n.payment && n.payment.amount) || 51), 0);

    if (revenueEl) revenueEl.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
}

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
