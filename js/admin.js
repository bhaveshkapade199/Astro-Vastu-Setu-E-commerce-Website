const API_BASE = 'http://localhost:3000/api';
let adminProducts = [];
let token = localStorage.getItem('admin_token');

document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        document.getElementById('adminLoginModal').style.display = 'none';
        loadProducts();
    } else {
        document.getElementById('adminLoginModal').style.display = 'flex';
    }

    document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                token = data.token;
                localStorage.setItem('admin_token', token);
                document.getElementById('adminLoginModal').style.display = 'none';
                document.getElementById('loginError').style.display = 'none';
                loadProducts();
            } else {
                document.getElementById('loginError').style.display = 'block';
                document.getElementById('loginError').textContent = data.error || 'Login failed';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('loginError').style.display = 'block';
            document.getElementById('loginError').textContent = 'Server error. Is backend running?';
        }
    });

    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });

    document.getElementById('productImageFile').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const statusEl = document.getElementById('uploadStatus');
        statusEl.style.color = 'blue';
        statusEl.textContent = 'Uploading...';

        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            if (res.status === 401 || res.status === 403) return logout();
            
            const data = await res.json();
            if (res.ok) {
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
            statusEl.textContent = 'Upload failed due to server error';
        }
    });
});

function logout() {
    localStorage.removeItem('admin_token');
    token = null;
    document.getElementById('adminLoginModal').style.display = 'flex';
}

async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to load');
        adminProducts = await res.json();
        renderTable();
    } catch (err) {
        console.error(err);
        alert('Could not load products. Please ensure the backend is running.');
    }
}

function renderTable() {
    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = '';

    adminProducts.forEach(p => {
        const visual = p.image ? `<img src="${p.image}" class="product-img">` : `<div class="product-img">${p.emoji || '📦'}</div>`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${visual}</td>
            <td><strong>${p.name}</strong><br><small>${p.badge || ''}</small></td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>
                <span style="color: ${p.inStock ? 'green' : 'red'}">
                    ${p.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <button class="btn btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal() {
    document.getElementById('productModal').style.display = 'flex';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('uploadStatus').textContent = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
    // Default new products to In Stock + Featured so they appear on homepage
    document.getElementById('productInStock').checked = true;
    document.getElementById('productIsFeatured').checked = true;
    document.getElementById('productIsNew').checked = false;
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function editProduct(id) {
    const p = adminProducts.find(x => x.id === id);
    if (!p) return;

    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productSubcategory').value = p.subcategory || '';
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productMrp').value = p.mrp;
    document.getElementById('productDiscount').value = p.discount || 0;
    document.getElementById('productEmoji').value = p.emoji || '';
    document.getElementById('productImageUrl').value = p.image || '';
    document.getElementById('productDesc').value = p.shortDesc || '';
    document.getElementById('productInStock').checked = p.inStock;
    document.getElementById('productIsFeatured').checked = p.isFeatured;
    document.getElementById('productIsNew').checked = p.isNew;
    document.getElementById('uploadStatus').textContent = '';

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productModal').style.display = 'flex';
}

async function saveProduct() {
    const idVal = document.getElementById('productId').value;
    
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value,
        price: parseInt(document.getElementById('productPrice').value) || 0,
        mrp: parseInt(document.getElementById('productMrp').value) || 0,
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        emoji: document.getElementById('productEmoji').value,
        image: document.getElementById('productImageUrl').value,
        shortDesc: document.getElementById('productDesc').value,
        inStock: document.getElementById('productInStock').checked,
        isFeatured: document.getElementById('productIsFeatured').checked,
        isNew: document.getElementById('productIsNew').checked
    };

    try {
        const url = idVal ? `${API_BASE}/products/${idVal}` : `${API_BASE}/products`;
        const method = idVal ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });

        if (res.status === 401 || res.status === 403) return logout();

        if (res.ok) {
            closeModal();
            loadProducts();
            alert('Product saved successfully!');
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to save product');
        }
    } catch (err) {
        console.error(err);
        alert('Error saving product');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) return logout();

        if (res.ok) {
            loadProducts();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to delete');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting product');
    }
}

function resetData() {
    alert("Database resets are not supported in this version. Delete items manually or use a seed script.");
}
