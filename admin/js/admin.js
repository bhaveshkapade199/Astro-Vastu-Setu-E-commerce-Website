const API_BASE = window.location.origin.includes('localhost:')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

let token = localStorage.getItem('admin_token');
let currentTab = 'products';
let productsData = [];
let categoriesData = [];
let ordersData = [];
let specialRequestsData = [];
let contactsData = [];
let reviewsData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupAuth();
    setupEventListeners();
    
    if (token) {
        showAdminApp();
        refreshAllData();
    } else {
        showLoginModal();
    }
});

// Setup Auth
function setupAuth() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value.trim();
            const errorEl = document.getElementById('loginError');

            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (res.ok && data.token) {
                    token = data.token;
                    localStorage.setItem('admin_token', token);
                    errorEl.style.display = 'none';
                    showAdminApp();
                    refreshAllData();
                } else {
                    errorEl.style.display = 'block';
                    errorEl.textContent = data.error || 'Invalid credentials';
                }
            } catch (err) {
                console.error(err);
                errorEl.style.display = 'block';
                errorEl.textContent = 'Unable to connect to MongoDB backend at ' + API_BASE;
            }
        });
    }
}

function showAdminApp() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

function showLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'flex';
}

function logout() {
    localStorage.removeItem('admin_token');
    token = null;
    showLoginModal();
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Refresh all data
async function refreshAllData() {
    await Promise.all([
        loadProducts(),
        loadCategories(),
        loadOrders(),
        loadSpecialRequests(),
        loadContacts(),
        loadReviews()
    ]);
    updateDashboardStats();
}

// Tab Switching
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
        'products': 'Product Management (MongoDB)',
        'categories': 'Category Management (Dynamic)',
        'orders': 'Customer Website Orders',
        'special-bracelets': 'Special & Customized Bracelet Requests',
        'contacts': 'Customer Inquiries & Contact Messages',
        'reviews': 'Customer Product Feedback & Reviews'
    };
    document.getElementById('pageTitle').textContent = titles[tabId] || 'Admin Panel';

    if (tabId === 'products') loadProducts();
    if (tabId === 'categories') loadCategories();
    if (tabId === 'orders') loadOrders();
    if (tabId === 'special-bracelets') loadSpecialRequests();
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

    // Product image upload
    const fileInput = document.getElementById('productImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            const statusEl = document.getElementById('uploadStatus');
            statusEl.style.color = '#0288d1';
            statusEl.textContent = 'Uploading to server...';

            try {
                const res = await fetch(`${API_BASE}/products/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                if (res.status === 401 || res.status === 403) return logout();

                const data = await res.json();
                if (res.ok && data.imageUrl) {
                    document.getElementById('productImageUrl').value = data.imageUrl;
                    statusEl.style.color = 'green';
                    statusEl.textContent = 'Upload successful!';
                } else {
                    statusEl.style.color = 'red';
                    statusEl.textContent = data.error || 'Upload failed';
                }
            } catch (err) {
                console.error(err);
                statusEl.style.color = 'red';
                statusEl.textContent = 'Image upload error';
            }
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

// -------------------------------------------------------------
// 1. PRODUCTS MANAGEMENT
// -------------------------------------------------------------
async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        productsData = await res.json();
        renderProductsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

function renderProductsTable() {
    const tbody = document.querySelector('#productTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!productsData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No products found in MongoDB. Click "Add New Product" to create one.</td></tr>';
        return;
    }

    productsData.forEach(p => {
        const imgSrc = p.image ? (p.image.startsWith('http') ? p.image : (API_BASE.replace('/api', '') + p.image)) : '';
        const visual = imgSrc
            ? `<img src="${imgSrc}" class="product-img" onerror="this.outerHTML='<div class=\\'product-img\\'>${p.emoji || '💎'}</div>'">`
            : `<div class="product-img">${p.emoji || '💎'}</div>`;

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
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openProductModal() {
    document.getElementById('productModal').style.display = 'flex';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('uploadStatus').textContent = '';
    document.getElementById('modalTitle').textContent = 'Add New Product to MongoDB';
    document.getElementById('productInStock').checked = true;
    document.getElementById('productIsFeatured').checked = true;
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
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
    document.getElementById('productModal').style.display = 'flex';
}

async function saveProduct() {
    const idVal = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value.trim(),
        price: Number(document.getElementById('productPrice').value),
        mrp: Number(document.getElementById('productMrp').value) || Number(document.getElementById('productPrice').value),
        discount: Number(document.getElementById('productDiscount').value) || 0,
        badge: document.getElementById('productBadge').value.trim(),
        emoji: document.getElementById('productEmoji').value.trim() || '💎',
        image: document.getElementById('productImageUrl').value.trim(),
        shortDesc: document.getElementById('productDesc').value.trim(),
        inStock: document.getElementById('productInStock').checked,
        isFeatured: document.getElementById('productIsFeatured').checked,
        isNew: document.getElementById('productIsNew').checked
    };

    try {
        const url = idVal ? `${API_BASE}/products/${idVal}` : `${API_BASE}/products`;
        const method = idVal ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(product)
        });

        if (res.status === 401 || res.status === 403) return logout();

        const data = await res.json();
        if (res.ok) {
            closeProductModal();
            await loadProducts();
            alert('Product saved successfully in MongoDB!');
        } else {
            alert(data.error || 'Failed to save product');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while saving product');
    }
}

async function deleteProduct(id) {
    if (!confirm(`Are you sure you want to delete Product #${id} from MongoDB?`)) return;

    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (res.status === 401 || res.status === 403) return logout();

        if (res.ok) {
            await loadProducts();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to delete');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting product');
    }
}

// -------------------------------------------------------------
// 2. WEBSITE ORDERS MANAGEMENT
// -------------------------------------------------------------
async function loadOrders() {
    try {
        const res = await fetch(`${API_BASE}/orders`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (!res.ok) throw new Error('Failed to load orders');
        ordersData = await res.json();
        renderOrdersTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error loading orders:', err);
    }
}

function renderOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!ordersData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No customer orders placed yet. Orders from website checkout will automatically appear here!</td></tr>';
        return;
    }

    ordersData.forEach(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const itemsSummary = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${order.orderId}</strong><br>
                <small style="color:#777;">${dateStr}</small>
            </td>
            <td>
                <strong>${escapeHtml(order.customer.name)}</strong><br>
                <small>📞 <a href="tel:${order.customer.mobile}">${order.customer.mobile}</a></small><br>
                <small style="color:#666;">${escapeHtml(order.customer.city || '')} ${escapeHtml(order.customer.state || '')}</small>
            </td>
            <td style="max-width:240px;">
                <span title="${escapeHtml(itemsSummary)}" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                    ${escapeHtml(itemsSummary)}
                </span>
                <small style="color:#888;">${order.items.length} item(s)</small>
            </td>
            <td>
                <strong>₹${order.total}</strong><br>
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
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.orderId}')"><i class="fas fa-eye"></i> View</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ orderStatus: newStatus })
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (res.ok) {
            await loadOrders();
        } else {
            alert('Could not update status');
        }
    } catch (err) {
        console.error(err);
        alert('Server error updating order');
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
                <div class="val">${new Date(order.createdAt).toLocaleString('en-IN')}</div>
            </div>
            <div class="detail-item">
                <div class="label">Customer Name</div>
                <div class="val">${escapeHtml(order.customer.name)}</div>
            </div>
            <div class="detail-item">
                <div class="label">Mobile Number</div>
                <div class="val"><a href="tel:${order.customer.mobile}">📞 ${order.customer.mobile}</a></div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Delivery Address</div>
                <div class="val">${escapeHtml(order.customer.address)}</div>
            </div>
            <div class="detail-item">
                <div class="label">Payment Method</div>
                <div class="val">${order.paymentMethod || 'Razorpay / Online'} (${order.paymentStatus || 'Paid'})</div>
            </div>
            <div class="detail-item">
                <div class="label">Delivery Method</div>
                <div class="val">${order.deliveryMethod || 'Standard'}</div>
            </div>
        </div>

        <h3 style="margin-bottom:12px;font-size:15px;">📦 Items Ordered</h3>
        <table style="margin-bottom:20px;">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.emoji || '📦'} ${escapeHtml(item.name)}</td>
                        <td>₹${item.price}</td>
                        <td>${item.qty}</td>
                        <td>₹${item.price * item.qty}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="text-align:right;border-top:1px solid #eee;padding-top:10px;">
            <p>Subtotal: ₹${order.subtotal}</p>
            <p>Discount: −₹${order.discount}</p>
            <p>Shipping: ₹${order.shipping}</p>
            <h3 style="color:var(--primary);margin-top:6px;">Grand Total: ₹${order.total}</h3>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeOrderDetailModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

async function deleteOrder(id) {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
        const res = await fetch(`${API_BASE}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadOrders();
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// 3. SPECIAL BRACELET REQUESTS (FOR SPECIFIC PERSON)
// -------------------------------------------------------------
async function loadSpecialRequests() {
    try {
        const res = await fetch(`${API_BASE}/special-bracelets`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (!res.ok) throw new Error('Failed to load special requests');
        specialRequestsData = await res.json();
        renderSpecialRequestsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error loading special requests:', err);
    }
}

function renderSpecialRequestsTable() {
    const tbody = document.querySelector('#specialRequestsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!specialRequestsData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No special bracelet requests yet. When a customer customizes a bracelet for a special person, it will appear here!</td></tr>';
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
                <small style="color:#777;">${new Date(req.createdAt).toLocaleDateString('en-IN')}</small>
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
                <small style="color:#666;">Stones: ${escapeHtml((custom.preferredStones || []).join(', ') || 'Astrologer recommended')}</small>
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
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="viewSpecialDetails('${req.requestId}')"><i class="fas fa-eye"></i> Details</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSpecialRequest('${req._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateSpecialRequestStatus(requestId, status) {
    try {
        const res = await fetch(`${API_BASE}/special-bracelets/${requestId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (res.ok) {
            await loadSpecialRequests();
        } else {
            alert('Failed to update status');
        }
    } catch (err) {
        console.error(err);
        alert('Server error updating special request');
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
            <h3 style="color:#d46b08;margin-bottom:8px;font-size:16px;">✨ Special Person Astrology Data (फॉर दैट स्पेशल पर्सन)</h3>
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
                    <div class="label">Place of Birth (City/State)</div>
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

        <h3 style="margin-bottom:12px;font-size:15px;">🔮 Bracelet Customization & Energy Intention</h3>
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
                <div class="label">Personal Concerns / Kundli Problems Described</div>
                <div class="val" style="background:#fff;padding:8px;border-radius:4px;border:1px solid #e0e0e0;">
                    ${escapeHtml(custom.specialConcerns || 'None provided')}
                </div>
            </div>
        </div>

        <h3 style="margin-bottom:12px;font-size:15px;">📦 Delivery & Customer Contact</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="label">Ordered By (Customer)</div>
                <div class="val">${escapeHtml(customer.name)}</div>
            </div>
            <div class="detail-item">
                <div class="label">Mobile & WhatsApp</div>
                <div class="val">📞 ${escapeHtml(customer.mobile)}</div>
            </div>
            <div class="detail-item" style="grid-column: span 2;">
                <div class="label">Full Shipping Address</div>
                <div class="val">${escapeHtml(customer.address)}, ${escapeHtml(customer.city || '')}, ${escapeHtml(customer.state || '')} - ${escapeHtml(customer.pincode || '')}</div>
            </div>
        </div>

        <div style="margin-top:16px;">
            <label style="font-weight:600;font-size:13px;display:block;margin-bottom:6px;">Astrologer / Consecration Notes (Internal):</label>
            <textarea id="astrologerNotesInput" rows="2" style="width:100%;padding:8px;border-radius:6px;border:1px solid #ccc;">${escapeHtml(req.astrologerNotes || '')}</textarea>
            <button class="btn btn-sm" onclick="saveAstrologerNotes('${req.requestId}')" style="margin-top:8px;">
                <i class="fas fa-save"></i> Save Notes
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

async function saveAstrologerNotes(requestId) {
    const notes = document.getElementById('astrologerNotesInput').value.trim();
    try {
        const res = await fetch(`${API_BASE}/special-bracelets/${requestId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ astrologerNotes: notes })
        });
        if (res.ok) {
            alert('Astrologer notes saved!');
            await loadSpecialRequests();
        }
    } catch (err) {
        console.error(err);
    }
}

function closeSpecialDetailModal() {
    document.getElementById('specialDetailModal').style.display = 'none';
}

async function deleteSpecialRequest(id) {
    if (!confirm('Are you sure you want to delete this special bracelet request?')) return;
    try {
        const res = await fetch(`${API_BASE}/special-bracelets/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadSpecialRequests();
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// 4. CATEGORIES MANAGEMENT (DYNAMIC)
// -------------------------------------------------------------
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to load categories');
        categoriesData = await res.json();
        renderCategoriesTable();
        populateCategoryDropdown();
    } catch (err) {
        console.error('Error loading categories:', err);
    }
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
                <button class="btn btn-danger btn-sm" onclick="deleteCategory('${c._id}')"><i class="fas fa-trash"></i> Delete</button>
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

    const defaultList = [
        { name: 'Bracelets', slug: 'bracelets' },
        { name: 'Rudraksha', slug: 'rudraksha' },
        { name: 'Dhanyog', slug: 'dhanyog' },
        { name: 'Lakshmi Potli', slug: 'lakshmipotli' }
    ];

    const allCats = [...defaultList];
    categoriesData.forEach(c => {
        if (!allCats.some(x => x.slug === c.slug)) {
            allCats.push({ name: c.name, slug: c.slug });
        }
    });

    allCats.forEach(c => {
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
    const slug = document.getElementById('catSlug').value.trim();
    const icon = document.getElementById('catIcon').value.trim() || '💎';
    const description = document.getElementById('catDesc').value.trim();

    try {
        const res = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, slug, icon, description })
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById('addCategoryForm').reset();
            alert('✅ New category created successfully in MongoDB!');
            await loadCategories();
        } else {
            alert('❌ ' + (data.error || 'Failed to create category'));
        }
    } catch (err) {
        console.error(err);
        alert('Server error creating category');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadCategories();
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// 5. CONTACT US MESSAGES & INQUIRIES
// -------------------------------------------------------------
async function loadContacts() {
    try {
        const res = await fetch(`${API_BASE}/contacts`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (!res.ok) throw new Error('Failed to load contacts');
        contactsData = await res.json();
        renderContactsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error loading contacts:', err);
    }
}

function renderContactsTable() {
    const tbody = document.querySelector('#contactsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!contactsData.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No contact messages yet. Inquiries from the website Contact Us page will appear here.</td></tr>';
        return;
    }

    contactsData.forEach(c => {
        const dateStr = new Date(c.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const cleanMobile = (c.mobile || '').replace(/\D/g, '');
        const waLink = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(`Namaste ${c.name}, Thank you for contacting Astro Vastu Setu regarding "${c.subject}". How can we assist you?`)}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <small style="color:#777;">${dateStr}</small>
            </td>
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
            <td style="max-width:320px;">
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
        const res = await fetch(`${API_BASE}/contacts/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            await loadContacts();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
        const res = await fetch(`${API_BASE}/contacts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadContacts();
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// 6. CUSTOMER PRODUCT REVIEWS & FEEDBACK
// -------------------------------------------------------------
async function loadReviews() {
    try {
        const res = await fetch(`${API_BASE}/reviews`, {
            headers: getAuthHeaders()
        });
        if (res.status === 401 || res.status === 403) return logout();
        if (!res.ok) throw new Error('Failed to load reviews');
        reviewsData = await res.json();
        renderReviewsTable();
        updateDashboardStats();
    } catch (err) {
        console.error('Error loading reviews:', err);
    }
}

function renderReviewsTable() {
    const tbody = document.querySelector('#reviewsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!reviewsData.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No product reviews submitted yet. Feedback submitted by customers on product pages will appear here.</td></tr>';
        return;
    }

    reviewsData.forEach(r => {
        const dateStr = new Date(r.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><small style="color:#777;">${dateStr}</small></td>
            <td><strong>${escapeHtml(r.productName || ('Product #' + r.productId))}</strong></td>
            <td><strong>${escapeHtml(r.userName)}</strong></td>
            <td><span style="color:#f57c00;font-weight:700;">${'★'.repeat(r.rating || 5)} (${r.rating}/5)</span></td>
            <td style="max-width:320px;"><div style="background:#fdfcf9;padding:8px;border-radius:6px;border:1px solid #eee;">${escapeHtml(r.comment)}</div></td>
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
        const res = await fetch(`${API_BASE}/reviews/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadReviews();
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// 7. DASHBOARD STATS
// -------------------------------------------------------------
function updateDashboardStats() {
    const prodCountEl = document.getElementById('totalProductsCount');
    const orderCountEl = document.getElementById('totalOrdersCount');
    const specialCountEl = document.getElementById('totalSpecialCount');
    const revenueEl = document.getElementById('totalRevenue');

    const badgeOrders = document.getElementById('badgeOrdersCount');
    const badgeSpecial = document.getElementById('badgeSpecialCount');
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
        specialRequestsData.reduce((sum, s) => sum + (Number(s.pricing && s.pricing.finalPrice) || 0), 0);

    if (revenueEl) revenueEl.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
}

// Helper to escape HTML and prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

