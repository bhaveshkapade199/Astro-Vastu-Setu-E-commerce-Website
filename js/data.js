// ============================================
// ASTRO VASTU SETU - Product Data
// ============================================

const PRODUCTS = [
  {
    id: 1,
    name: "7 Chakra Bracelet",
    category: "bracelets",
    subcategory: "7chakra",
    emoji: "🌈",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 126,
    badge: "BESTSELLER",
    material: "7 Natural Gemstones (Amethyst, Lapis, Aquamarine, Jade, Citrine, Carnelian, Red Jasper)",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "25g approx",
    origin: "India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Traditional 7 Chakra inspired bracelet designed for spiritual and wellness practices. Traditionally associated with balancing the 7 energy centers of the body.",
    benefits: [
      "Traditionally associated with balancing 7 energy chakras",
      "Used in meditation and spiritual practices",
      "Supports positive mindset and inner peace",
      "Popular for wellness and energy balancing"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 2,
    name: "Citrine Bracelet",
    category: "bracelets",
    subcategory: "citrine",
    emoji: "💛",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.7,
    reviews: 124,
    badge: "31% OFF",
    material: "Natural Citrine (Original Stone)",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "22g approx",
    origin: "Brazil / India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Citrine is traditionally associated with abundance, positivity and confidence. It is believed to help attract prosperity and support emotional balance.",
    benefits: [
      "Supports positivity and abundance (traditional belief)",
      "Associated with confidence and motivation",
      "Helps balance emotions (wellness practice)",
      "Popular for meditation and spiritual use"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 3,
    name: "Amethyst Bracelet",
    category: "bracelets",
    subcategory: "amethyst",
    emoji: "💜",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 98,
    badge: "21% OFF",
    material: "Natural Amethyst",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "23g approx",
    origin: "Brazil",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Amethyst is traditionally known as the stone of peace and spiritual growth. Widely used in meditation and spiritual practices worldwide.",
    benefits: [
      "Traditionally used for calmness and peace of mind",
      "Supports meditation and spiritual growth",
      "Associated with protection and positive energy",
      "Popular for stress relief wellness practice"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 4,
    name: "Tiger Eye Bracelet",
    category: "bracelets",
    subcategory: "tigereye",
    emoji: "🟤",
    price: 799,
    mrp: 1049,
    discount: 24,
    rating: 4.6,
    reviews: 87,
    badge: "NEW",
    material: "Natural Tiger Eye Stone",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "28g approx",
    origin: "South Africa",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Tiger Eye is traditionally associated with courage, strength and mental clarity. Widely used in wellness and spiritual practices.",
    benefits: [
      "Traditionally associated with courage and strength",
      "Supports mental clarity and focus",
      "Associated with protection and grounding energy",
      "Used in spiritual and wellness practices"
    ],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 5,
    name: "Black Tourmaline Bracelet",
    category: "bracelets",
    subcategory: "blacktourmaline",
    emoji: "⚫",
    price: 899,
    mrp: 1199,
    discount: 25,
    rating: 4.7,
    reviews: 73,
    badge: "21% OFF",
    material: "Natural Black Tourmaline",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "30g approx",
    origin: "Brazil",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Black Tourmaline is traditionally known as a powerful protective stone. Used widely in spiritual practices for grounding and protection.",
    benefits: [
      "Traditionally used for protection and grounding",
      "Associated with shielding from negative energies",
      "Supports grounding and stability",
      "Used in spiritual and wellness practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 6,
    name: "Rose Quartz Bracelet",
    category: "bracelets",
    subcategory: "rosequartz",
    emoji: "🌸",
    price: 699,
    mrp: 1049,
    discount: 33,
    rating: 4.8,
    reviews: 115,
    badge: "31% OFF",
    material: "Natural Rose Quartz",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "22g approx",
    origin: "Brazil / Madagascar",
    suitableFor: "All Ages, Unisex — especially popular with women",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Rose Quartz is traditionally known as the stone of love and compassion. Widely used in wellness practices for emotional healing.",
    benefits: [
      "Traditionally associated with love and compassion",
      "Supports self-love and emotional healing",
      "Associated with peace and harmony",
      "Popular in wellness and spiritual practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 7,
    name: "Clear Quartz Bracelet",
    category: "bracelets",
    subcategory: "clearquartz",
    emoji: "⚪",
    price: 699,
    mrp: 999,
    discount: 30,
    rating: 4.6,
    reviews: 62,
    badge: "30% OFF",
    material: "Natural Clear Quartz",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "20g approx",
    origin: "Brazil",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Clear Quartz is traditionally known as the master healing stone. Used in meditation for clarity, focus, and spiritual alignment.",
    benefits: [
      "Traditionally known as the 'master stone' in crystal healing",
      "Supports clarity and mental focus",
      "Associated with amplifying positive intentions",
      "Used in meditation and spiritual practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: 8,
    name: "Pyrite Bracelet",
    category: "bracelets",
    subcategory: "pyrite",
    emoji: "✨",
    price: 899,
    mrp: 1249,
    discount: 28,
    rating: 4.7,
    reviews: 58,
    badge: "28% OFF",
    material: "Natural Pyrite",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "35g approx",
    origin: "Peru / Spain",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water and moisture to prevent oxidation",
    shortDesc: "Pyrite is traditionally known as 'Fool's Gold' and is associated with prosperity, abundance, and positive energy in spiritual traditions.",
    benefits: [
      "Traditionally associated with prosperity and abundance",
      "Supports motivation and positive mindset",
      "Associated with confidence and success",
      "Used in wealth manifestation spiritual practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: 9,
    name: "Green Aventurine Bracelet",
    category: "bracelets",
    subcategory: "greenaventurine",
    emoji: "💚",
    price: 799,
    mrp: 1049,
    discount: 24,
    rating: 4.6,
    reviews: 71,
    badge: "24% OFF",
    material: "Natural Green Aventurine",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "24g approx",
    origin: "India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Green Aventurine is traditionally known as the 'Stone of Opportunity' and is widely used in prosperity and wellness practices.",
    benefits: [
      "Traditionally called the 'Stone of Opportunity'",
      "Associated with luck and prosperity",
      "Supports heart-based wellness practices",
      "Used in manifestation and spiritual practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: 10,
    name: "Rudraksha Bracelet",
    category: "rudraksha",
    subcategory: "rudraksha",
    emoji: "📿",
    price: 899,
    mrp: 1299,
    discount: 31,
    rating: 4.9,
    reviews: 143,
    badge: "POPULAR",
    material: "5 Mukhi Rudraksha Beads",
    beadSize: "12 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "18g approx",
    origin: "Nepal / Indonesia",
    suitableFor: "All Ages, Unisex",
    care: "Apply mustard oil occasionally. Avoid water for extended periods.",
    shortDesc: "Authentic Rudraksha beads with deep roots in Hindu spiritual tradition. Widely used in meditation, prayer, and spiritual wellness practices.",
    benefits: [
      "Deeply rooted in Hindu spiritual tradition",
      "Traditionally worn for meditation and prayer",
      "Associated with calmness and spiritual protection",
      "Used in Vedic wellness and spiritual practices"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 11,
    name: "Dhanyog Bracelet",
    category: "dhanyog",
    subcategory: "dhanyog",
    emoji: "🌿",
    price: 999,
    mrp: 1499,
    discount: 33,
    rating: 4.8,
    reviews: 89,
    badge: "SPECIAL",
    material: "Multi-stone Prosperity Bracelet",
    beadSize: "8 mm (approx)",
    braceletSize: "Elastic (Fits most wrists)",
    weight: "28g approx",
    origin: "India",
    suitableFor: "All Ages, Unisex",
    care: "Avoid water, perfumes, and direct sunlight",
    shortDesc: "Dhanyog Bracelet is specially crafted with stones traditionally associated with prosperity and positive energy in spiritual wellness practices.",
    benefits: [
      "Traditionally associated with prosperity and growth",
      "Combines multiple stones for balanced energy",
      "Used in spiritual and wellness practices",
      "Associated with positive mindset and abundance"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 12,
    name: "Lakshmi Potli (Small)",
    category: "lakshmipotli",
    subcategory: "lakshmipotli",
    emoji: "🪔",
    price: 249,
    mrp: 399,
    discount: 38,
    rating: 4.9,
    reviews: 201,
    badge: "DIWALI SPECIAL",
    material: "Traditional spiritual items in decorative potli",
    beadSize: "N/A",
    braceletSize: "N/A",
    weight: "150g approx",
    origin: "India",
    suitableFor: "All Ages, Perfect for gifting",
    care: "Store in a cool, dry place",
    shortDesc: "Traditional Lakshmi Potli made with auspicious items for Diwali and festive occasions. Perfect as a spiritual gift for your loved ones.",
    benefits: [
      "Traditional auspicious potli for Diwali puja",
      "Contains traditionally significant spiritual items",
      "Perfect for gifting to family and friends",
      "Associated with prosperity blessings in tradition"
    ],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 13,
    name: "Lakshmi Potli (Premium)",
    category: "lakshmipotli",
    subcategory: "lakshmipotli",
    emoji: "🪔",
    price: 499,
    mrp: 799,
    discount: 38,
    rating: 4.8,
    reviews: 134,
    badge: "PREMIUM",
    material: "Premium traditional spiritual items in decorative potli",
    beadSize: "N/A",
    braceletSize: "N/A",
    weight: "300g approx",
    origin: "India",
    suitableFor: "All Ages, Perfect for gifting",
    care: "Store in a cool, dry place",
    shortDesc: "Premium Lakshmi Potli with superior quality items, beautifully packaged. An ideal Diwali gift that embodies traditional blessings and positive energy.",
    benefits: [
      "Premium quality traditional potli for Diwali",
      "Contains larger selection of auspicious items",
      "Beautifully packaged for gifting",
      "Associated with prosperity and auspiciousness"
    ],
    inStock: true,
    isNew: false,
    isFeatured: false
  }
];

// Cart & Wishlist Management
function getCart() {
  return JSON.parse(localStorage.getItem('avs_cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('avs_cart', JSON.stringify(cart));
  updateBadges();
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('avs_wishlist') || '[]');
}

function setWishlist(wl) {
  localStorage.setItem('avs_wishlist', JSON.stringify(wl));
  updateBadges();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  setCart(cart);
  showToast('🛒 Added to cart!', 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  setCart(cart);
}

function toggleWishlist(productId) {
  const wl = getWishlist();
  const idx = wl.indexOf(productId);
  if (idx === -1) {
    wl.push(productId);
    showToast('❤️ Added to wishlist!', 'gold');
  } else {
    wl.splice(idx, 1);
    showToast('🤍 Removed from wishlist', '');
  }
  setWishlist(wl);
  return idx === -1;
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return p ? sum + (p.price * item.qty) : sum;
  }, 0);
}

function updateBadges() {
  const cart = getCart();
  const wl = getWishlist();
  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);
  
  document.querySelectorAll('#cartBadge').forEach(el => { el.textContent = cartTotal; });
  document.querySelectorAll('#wishlistBadge').forEach(el => { el.textContent = wl.length; });
}

// Coupon codes
const COUPONS = {
  'NAVRATRI10': { type: 'percent', value: 10, minOrder: 500 },
  'WELCOME50': { type: 'flat', value: 50, minOrder: 299 },
  'DIWALI200': { type: 'flat', value: 200, minOrder: 999 },
  'FIRST20': { type: 'percent', value: 20, minOrder: 699 },
};

function applyCoupon(code, subtotal) {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return { valid: false, message: 'Invalid coupon code.' };
  if (subtotal < coupon.minOrder) return { valid: false, message: `Minimum order ₹${coupon.minOrder} required.` };
  
  const discount = coupon.type === 'percent'
    ? Math.round(subtotal * coupon.value / 100)
    : coupon.value;
  
  return { valid: true, discount, message: `Coupon applied! You saved ₹${discount}` };
}
