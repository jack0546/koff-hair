/* ============================================================
   HAIR HAVEN LUXURY EXTENSIONS
   app.js  —  all behaviour (data, state, rendering, events)

   Structure
     1. Config & shared markup
     2. Product catalog data
     3. State
     4. Card rendering  (productCardTemplate = grouped card markup)
     5. WhatsApp link builders
     6. Quick view
     7. Cart
     8. Event wiring
   ============================================================ */

/* ---------- 1. CONFIG ---------- */
const PHONE_NUMBER = "233532340875";
const CART_STORAGE_KEY = "hair_haven_cart";
const FALLBACK_IMAGE = "a1.jpg";

const WHATSAPP_ICON = `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;

const BAG_ICON = `<svg class="w-12 h-12 mb-3 empty-state__icon" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`;

/* ---------- 2. PRODUCT CATALOG ---------- */
const products = [
    {
        id: 1,
        name: "Raw Cambodian Straight Bundle",
        category: "Raw Bundles",
        price: 135.00,
        rating: 5.0,
        reviewsCount: 42,
        image: "a1.jpg",
        description: "Single donor raw unprocessed Cambodian hair. Silky straight finish with natural full ends that can be bleached up to 613 platinum blonde effortlessly.",
        lengths: ["14 inch", "18 inch", "22 inch", "26 inch", "30 inch"],
        colors: ["Natural Black (1B)"],
        badge: "Top Seller"
    },
    {
        id: 2,
        name: "Raw Vietnamese Natural Wave Wig",
        category: "Custom Wigs",
        price: 340.00,
        rating: 4.9,
        reviewsCount: 38,
        image: "a2.jpg",
        description: "Full 13x6 HD Swiss Lace frontal wig with 200% density. Features natural wave pattern that can be styled straight or curled.",
        lengths: ["18 inch", "22 inch", "26 inch", "28 inch"],
        colors: ["Natural Black (1B)", "Dark Chocolate Highlight"],
        badge: "HD Lace"
    },
    {
        id: 3,
        name: "HD Seamless 5x5 Transparent Closure",
        category: "Closures & Frontals",
        price: 110.00,
        rating: 4.8,
        reviewsCount: 29,
        image: "a3.jpg",
        description: "Invisible ultra-thin HD lace closure that melts seamlessly into any skin tone with tiny hand-tied single knots.",
        lengths: ["12 inch", "16 inch", "20 inch"],
        colors: ["Natural Black (1B)"],
        badge: "Invisible Melt"
    },
    {
        id: 4,
        name: "Raw Burmese Curly Bundle",
        category: "Raw Bundles",
        price: 145.00,
        rating: 5.0,
        reviewsCount: 51,
        image: "a2.jpg",
        description: "Lush raw Burmese deep curly texture. Extremely thick cuticles from root to tip with zero synthetic blend.",
        lengths: ["16 inch", "20 inch", "24 inch", "28 inch"],
        colors: ["Natural Black (1B)"],
        badge: "High Density"
    },
    {
        id: 5,
        name: "Luxury Glueless Body Wave Wig",
        category: "Custom Wigs",
        price: 380.00,
        rating: 4.9,
        reviewsCount: 64,
        image: "a5.jpg",
        description: "Ready to wear pre-plucked, pre-bleached glueless wig with removable elastic security band and 3D dome cap.",
        lengths: ["20 inch", "24 inch", "28 inch", "32 inch"],
        colors: ["Natural Black (1B)", "Piano Honey Highlight"],
        badge: "Glueless Ready"
    },
    {
        id: 6,
        name: "Real HD 13x4 Ear-to-Ear Frontal",
        category: "Closures & Frontals",
        price: 175.00,
        rating: 4.9,
        reviewsCount: 31,
        image: "a4.jpg",
        description: "Pre-plucked natural hairline 13x4 Swiss HD Lace frontal offering versatile styling choices and parting freedom.",
        lengths: ["14 inch", "18 inch", "20 inch"],
        colors: ["Natural Black (1B)"],
        badge: "Skin Melt"
    }
];

/* ---------- 3. STATE ---------- */
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
let currentFilter = "All";
let currentSort = "default";
let searchQuery = "";

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast__dot"></span><span class="toast__text">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast--hide');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function imageFallback(img) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    img.src = FALLBACK_IMAGE;
}

function starRatingHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        let modifier = 'empty';
        if (i <= Math.floor(rating)) modifier = 'full';
        else if (i - rating <= 0.5) modifier = 'half';
        stars += `<span class="star-rating__star star-rating__star--${modifier}">${modifier === 'empty' ? '☆' : '★'}</span>`;
    }
    return `<span class="star-rating">${stars}</span>`;
}

/* ---------- 4. CARD RENDERING ---------- */
function productCardTemplate(product) {
    const waUrl = buildSingleProductWhatsAppUrl(product, product.lengths[0], product.colors[0]);

    return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-card__media" onclick="openQuickView(${product.id})" title="Quick View">
                <img class="product-card__img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="imageFallback(this)">
                <span class="product-card__badge">${product.badge}</span>
                <div class="product-card__overlay">
                    <span class="product-card__overlay-label">Quick View</span>
                </div>
            </div>

            <div class="product-card__body">
                <div>
                    <div class="product-card__meta">
                        <span class="product-card__category">${product.category}</span>
                        <span class="product-card__reviews">
                            ${starRatingHTML(product.rating)}
                            <span>(${product.reviewsCount})</span>
                        </span>
                    </div>
                    <h3 class="product-card__title" onclick="openQuickView(${product.id})">${product.name}</h3>
                    <p class="product-card__price">$${product.price.toFixed(2)} <span>USD</span></p>
                </div>

                <div class="product-card__actions">
                    <a class="btn btn--whatsapp" href="${waUrl}" target="_blank" rel="noopener">
                        ${WHATSAPP_ICON}
                        <span>Order On WhatsApp</span>
                    </a>
                    <button class="btn btn--ghost" onclick="addToBag(${product.id})">Add To Bag Drawer</button>
                </div>
            </div>
        </article>
    `;
}

function emptyGridHTML() {
    return `
        <div class="col-span-full py-16 text-center text-gray-500">
            <p class="font-heading text-lg">No Products Found</p>
            <p class="text-xs mt-1">Try adjusting your search or category filters.</p>
        </div>
    `;
}

function renderProducts() {
    const grid = document.getElementById('product-grid');

    let filtered = products.filter(p => {
        const matchesFilter = currentFilter === "All" || p.category === currentFilter;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (currentSort === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = filtered.length
        ? filtered.map(productCardTemplate).join('')
        : emptyGridHTML();
}

/* ---------- 5. WHATSAPP LINKS ---------- */
function buildSingleProductWhatsAppUrl(product, selectedLength, selectedColor) {
    const text = `Hello Hair Haven, I want to book/order the following item:\n\n` +
                 `*Product:* ${product.name}\n` +
                 `*Category:* ${product.category}\n` +
                 `*Price:* $${product.price.toFixed(2)}\n` +
                 `*Selected Length:* ${selectedLength || product.lengths[0]}\n` +
                 `*Selected Color:* ${selectedColor || product.colors[0]}\n\n` +
                 `Please let me know the availability and payment options.`;
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
}

function buildFullCartWhatsAppUrl(customerDetails) {
    let message = `*NEW WHATSAPP ORDER - HAIR HAVEN LUXURY EXTENSIONS*\n\n` +
                  `*CUSTOMER DETAILS:*\n` +
                  `• Name: ${customerDetails.name}\n` +
                  `• Phone: ${customerDetails.phone}\n` +
                  `• Delivery Address: ${customerDetails.address}\n` +
                  `• Payment Method: ${customerDetails.payment}\n\n` +
                  `*ORDER SUMMARY:*\n`;

    let subtotal = 0;
    cart.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `${i + 1}. ${item.name}\n` +
                   `   Qty: ${item.quantity} | Length: ${item.length} | Color: ${item.color}\n` +
                   `   Price: $${itemTotal.toFixed(2)}\n`;
    });

    message += `\n*TOTAL SUB-PRICE:* $${subtotal.toFixed(2)} USD\n` +
               `*DELIVERY FEE:* To be calculated on WhatsApp\n\n` +
               `Please confirm my order and share final invoice/payment details. Thank you!`;

    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- 6. QUICK VIEW ---------- */
function openQuickView(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-content');

    content.innerHTML = `
        <div class="quickview">
            <div class="quickview__media">
                <img src="${product.image}" alt="${product.name}" onerror="imageFallback(this)">
            </div>
            <div class="quickview__info">
                <div>
                    <span class="quickview__category">${product.category}</span>
                    <h2 class="quickview__title">${product.name}</h2>
                    <div class="quickview__rating">
                        ${starRatingHTML(product.rating)}
                        <span class="quickview__reviews">(${product.reviewsCount} customer reviews)</span>
                    </div>
                    <p class="quickview__price">$${product.price.toFixed(2)} USD</p>
                    <p class="quickview__desc">${product.description}</p>

                    <div class="quickview__options">
                        <div>
                            <label class="form-label" for="qv-length-select">Hair Length</label>
                            <select id="qv-length-select" class="form-control">
                                ${product.lengths.map(l => `<option value="${l}">${l}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label" for="qv-color-select">Color Shade</label>
                            <select id="qv-color-select" class="form-control">
                                ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="quickview__actions">
                    <button class="btn btn--whatsapp" id="qv-whatsapp-btn">
                        ${WHATSAPP_ICON}
                        <span>Book On WhatsApp Now</span>
                    </button>
                    <button class="btn btn--ghost" id="qv-add-bag-btn">Add To Bag Drawer</button>
                </div>
            </div>
        </div>
    `;

    modal.removeAttribute('hidden');

    const lengthSelect = document.getElementById('qv-length-select');
    const colorSelect = document.getElementById('qv-color-select');

    document.getElementById('qv-whatsapp-btn').onclick = function() {
        window.open(buildSingleProductWhatsAppUrl(product, lengthSelect.value, colorSelect.value), '_blank');
    };

    document.getElementById('qv-add-bag-btn').onclick = function() {
        addToBag(product.id, lengthSelect.value, colorSelect.value);
        modal.setAttribute('hidden', '');
    };
}

/* ---------- 7. CART ---------- */
function addToBag(productId, length = null, color = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const selectedLength = length || product.lengths[0];
    const selectedColor = color || product.colors[0];

    const existingIndex = cart.findIndex(item =>
        item.id === productId &&
        item.length === selectedLength &&
        item.color === selectedColor
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            length: selectedLength,
            color: selectedColor,
            quantity: 1
        });
    }

    saveCart();
    showToast(`${product.name} added to your bag drawer`);
}

function updateCartQuantity(index, newQty) {
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQty;
    }
    saveCart();
}

function cartItemTemplate(item, index) {
    const itemTotal = item.price * item.quantity;
    return `
        <div class="cart-item">
            <img class="cart-item__img" src="${item.image}" alt="${item.name}" onerror="imageFallback(this)">
            <div class="cart-item__body">
                <div>
                    <div class="cart-item__head">
                        <h4 class="cart-item__name">${item.name}</h4>
                        <button class="cart-item__remove" onclick="updateCartQuantity(${index}, 0)" title="Remove item">&#10005;</button>
                    </div>
                    <p class="cart-item__variant">Length: ${item.length} | Color: ${item.color}</p>
                </div>
                <div class="cart-item__foot">
                    <span class="qty">
                        <button class="qty__btn" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="qty__value">${item.quantity}</span>
                        <button class="qty__btn" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    </span>
                    <span class="cart-item__total">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                ${BAG_ICON}
                <p class="empty-state__title">Your bag is empty</p>
                <p class="empty-state__text">Select luxury extensions to book via WhatsApp.</p>
            </div>
        `;
        cartSubtotal.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartItemsContainer.innerHTML = cart.map(cartItemTemplate).join('');
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
}

/* ---------- 8. EVENTS ---------- */
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    /* Navigation mobile toggle */
    const mobileMenu = document.getElementById('mobile-menu');
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    /* Search */
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');

    document.getElementById('search-toggle').addEventListener('click', () => {
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) searchInput.focus();
    });

    const handleSearch = () => {
        searchQuery = searchInput.value.trim();
        renderProducts();
    };

    document.getElementById('search-submit-btn').addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    /* Category filters */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    document.querySelectorAll('.filter-category').forEach(card => {
        card.addEventListener('click', () => {
            const targetBtn = Array.from(filterBtns).find(b => b.dataset.filter === card.dataset.category);
            if (targetBtn) targetBtn.click();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* Sorting */
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    /* Cart drawer */
    const cartDrawer = document.getElementById('cart-drawer');
    const openCart = () => cartDrawer.classList.remove('hidden');
    const closeCart = () => cartDrawer.classList.add('hidden');

    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

    document.getElementById('clear-cart-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            cart = [];
            saveCart();
            showToast("Bag drawer emptied");
        }
    });

    /* Quick view */
    const quickviewModal = document.getElementById('quickview-modal');
    const closeQuickView = () => quickviewModal.setAttribute('hidden', '');
    document.getElementById('close-quickview-btn').addEventListener('click', closeQuickView);
    document.getElementById('quickview-overlay').addEventListener('click', closeQuickView);

    /* Checkout */
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('whatsapp-checkout-form');

    document.getElementById('cart-checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Your bag is empty. Please select products first.");
            return;
        }
        closeCart();
        checkoutModal.removeAttribute('hidden');
    });

    const closeCheckout = () => checkoutModal.setAttribute('hidden', '');
    document.getElementById('close-checkout-btn').addEventListener('click', closeCheckout);
    document.getElementById('checkout-overlay').addEventListener('click', closeCheckout);

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerDetails = {
            name: document.getElementById('cust-name').value.trim(),
            phone: document.getElementById('cust-phone').value.trim(),
            address: document.getElementById('cust-address').value.trim(),
            payment: document.getElementById('cust-payment').value
        };

        window.open(buildFullCartWhatsAppUrl(customerDetails), '_blank');

        cart = [];
        saveCart();
        closeCheckout();
        checkoutForm.reset();
        showToast("Redirecting to WhatsApp to complete your order...");
    });

    /* Newsletter placeholder */
    const newsletterBtn = document.getElementById('newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletter-email').value.trim();
            showToast(email ? "You're on the VIP list. Welcome to Hair Haven!" : "Please enter your email first.");
        });
    }
});
