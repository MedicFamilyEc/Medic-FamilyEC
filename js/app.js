let currentPage = 1;
const itemsPerPage = 8;
let cart = [];

function toggleCart() {
    document.getElementById('cartModal').classList.toggle('active');
}

function addToCartById(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    let found = cart.find(item => item.id === id);
    if (found) {
        found.qty++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    let totalQty = 0;
    let totalPrice = 0;
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;

        let li = document.createElement('li');
        li.className = 'cart-item-row';
        li.innerHTML = `
            <div class="cart-item-info">
                <span><b>${item.name}</b></span>
                <span>$${item.price.toFixed(2)} x ${item.qty}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                <button class="delete-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
        cartItemsList.appendChild(li);
    });

    cartCount.textContent = totalQty;
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    let message = "Hola, me gustaría realizar el siguiente pedido de Medic Family EC:\n\n*FACTURA DE COMPRA*\n";
    let total = 0;
    cart.forEach(item => {
        let subtotal = item.price * item.qty;
        total += subtotal;
        message += `- ${item.name} (x${item.qty}) - $${subtotal.toFixed(2)}\n`;
    });
    message += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*\n\nQuedo atento a la confirmación.`;
    window.open(`https://wa.me/593979703470?text=${encodeURIComponent(message)}`, '_blank');
}

// Modal de Detalle de Producto Mejorado con soporte para múltiples imágenes o desglose
function openProductModalById(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    let modalOverlay = document.getElementById('productModal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'productModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="product-modal-content">
                <div class="cart-header">
                    <h2>Detalle del Producto</h2>
                    <button class="close-modal" onclick="closeProductModal()">×</button>
                </div>
                <div id="modalBody" style="margin-top: 15px;"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    // Generamos las miniaturas de la galería y permitimos cambiar la foto y el texto dinámicamente
    let galleryHTML = '';
    if (product.gallery && product.gallery.length > 0) {
        galleryHTML = `
            <div style="margin: 12px 0;">
                <p style="font-size: 0.9rem; font-weight: bold; color: #475569; margin-bottom: 6px;">Elementos incluidos:</p>
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px;">
                    ${product.gallery.map(item => `
                        <img src="${item.src}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;" 
                            onclick="document.getElementById('mainModalImg').src='${item.src}'; document.getElementById('modalItemDesc').textContent='${item.text}';">
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Texto inicial (si tiene galería, muestra el texto del primer elemento, sino la descripción general)
    const initialText = (product.gallery && product.gallery.length > 0) ? product.gallery[0].text : product.desc;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img id="mainModalImg" src="${product.gallery && product.gallery.length > 0 ? product.gallery[0].src : product.img}" style="width:100%; max-height:200px; object-fit:contain; background:#ffffff; border-radius:8px; padding: 10px; border: 1px solid #f1f5f9;" alt="${product.name}">
        </div>
        ${galleryHTML}
        <span class="tag" style="display:block; margin-top:10px;">${product.cat}</span>
        <h2 style="margin: 5px 0; color: #1e293b; font-size: 1.3rem;">${product.name}</h2>
        <p style="font-size: 1.2rem; font-weight: bold; color: var(--a); margin: 8px 0;">$${Number(product.price).toFixed(2)}</p>
        <p id="modalItemDesc" style="color: #64748b; font-size: 0.95rem; line-height: 1.4; white-space: pre-line; margin-bottom: 20px;">${initialText}</p>
        <button onclick="addToCartById(${product.id}); closeProductModal();" style="width:100%; background:var(--v); color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size: 1rem;">Agregar al Carrito</button>
    `;

    modalOverlay.classList.add('active');
}
    // Si el producto tiene una propiedad 'gallery' (array de imágenes adicionales), las mostramos
    let galleryHTML = '';
    if (product.gallery && product.gallery.length > 0) {
        galleryHTML = `
            <div style="margin: 12px 0;">
                <p style="font-size: 0.9rem; font-weight: bold; color: #475569; margin-bottom: 6px;">Otras vistas / Elementos incluidos:</p>
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px;">
                    ${product.gallery.map(imgSrc => `
                        <img src="${imgSrc}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer;" onclick="document.getElementById('mainModalImg').src='${imgSrc}'">
                    `).join('')}
                </div>
            </div>
        `;
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img id="mainModalImg" src="${product.img}" style="width:100%; max-height:220px; object-fit:contain; background:#ffffff; border-radius:8px; padding: 10px; border: 1px solid #f1f5f9;" alt="${product.name}">
        </div>
        ${galleryHTML}
        <span class="tag" style="display:block; margin-top:10px;">${product.cat}</span>
        <h2 style="margin: 5px 0; color: #1e293b; font-size: 1.3rem;">${product.name}</h2>
        <p style="font-size: 1.2rem; font-weight: bold; color: var(--a); margin: 8px 0;">$${Number(product.price).toFixed(2)}</p>
        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.4; white-space: pre-line; margin-bottom: 20px;">${product.desc}</p>
        <button onclick="addToCartById(${product.id}); closeProductModal();" style="width:100%; background:var(--v); color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size: 1rem;">Agregar al Carrito</button>
    `;

    modalOverlay.classList.add('active');
}

function closeProductModal() {
    const modalOverlay = document.getElementById('productModal');
    if (modalOverlay) modalOverlay.classList.remove('active');
}

function getFilteredProducts() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filterCategory = document.getElementById('filter').value;

    return productsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchInput);
        const matchesCat = (filterCategory === 'all' || product.cat === filterCategory);
        return matchesSearch && matchesCat;
    });
}

function resetAndFilter() {
    currentPage = 1;
    renderCatalog();
}

function renderCatalog() {
    const container = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filtered = getFilteredProducts();

    container.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #667d86;">No se encontraron productos.</p>';
        return;
    }

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(product => {
        const card = document.createElement('div');
        card.className = `product-card ${product.agotado ? 'is-agotado' : ''}`;
        
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" onclick="openProductModalById(${product.id})">
            <div>
                <div class="tag">${product.cat}</div>
                <h3 onclick="openProductModalById(${product.id})">${product.name}</h3>
                <p>${product.desc}</p>
            </div>
            <div class="card-footer">
                <span class="price">${product.price > 0 ? '$' + product.price.toFixed(2) : 'Consultar'}</span>
                <button class="add-btn ${product.agotado ? 'disabled' : ''}" 
                    ${product.agotado ? 'disabled' : ''} 
                    onclick="addToCartById(${product.id})">
                    ${product.agotado ? 'Agotado' : 'Agregar'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderCatalog();
                window.scrollTo({ top: document.getElementById('productos').offsetTop - 100, behavior: 'smooth' });
            };
            paginationContainer.appendChild(btn);
        }
    }
}

window.onload = function() {
    renderCatalog();
};
