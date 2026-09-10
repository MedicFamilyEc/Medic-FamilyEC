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

// Modal optimizado: descripción principal completa debajo del precio y texto dinámico de la miniatura debajo de la foto
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
                <div class="cart-header" style="padding-bottom: 10px;">
                    <h2 style="font-size: 1.1rem;">Detalle del Producto</h2>
                    <button class="close-modal" onclick="closeProductModal()">×</button>
                </div>
                <div id="modalBody" style="margin-top: 10px;"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    let galleryHTML = '';
    let initialImg = product.img;
    let initialSubText = "";

    if (product.gallery && product.gallery.length > 0) {
        const firstItem = product.gallery[0];
        initialImg = (typeof firstItem === 'object') ? firstItem.src : firstItem;
        initialSubText = (typeof firstItem === 'object') ? firstItem.text : "";

        galleryHTML = `
            <div style="margin: 8px 0;">
                <p style="font-size: 0.8rem; font-weight: bold; color: #475569; margin-bottom: 4px;">Elementos incluidos:</p>
                <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 3px;">
                    ${product.gallery.map(item => {
                        const imgSrc = (typeof item === 'object') ? item.src : item;
                        const imgText = (typeof item === 'object') ? item.text : "";
                        if (!imgSrc || imgSrc.trim() === "") return '';

                        return `<img src="${imgSrc}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 5px; border: 1px solid #cbd5e1; cursor: pointer; flex-shrink: 0;" onclick="document.getElementById('mainModalImg').src='${imgSrc}'; document.getElementById('modalItemDesc').innerText='${imgText}';">`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img id="mainModalImg" src="${initialImg}" style="width:100%; max-height:140px; object-fit:contain; background:#ffffff; border-radius:6px; padding: 5px; border: 1px solid #f1f5f9;" alt="${product.name}">
            <p id="modalItemDesc" style="color: #0284c7; font-size: 0.82rem; font-weight: 600; margin: 4px 0 0 0; min-height: 16px;">${initialSubText}</p>
        </div>
        ${galleryHTML}
        <span class="tag" style="display:block; margin-top:4px; font-size: 11px;">${product.cat}</span>
        <h2 style="margin: 2px 0; color: #1e293b; font-size: 1.15rem;">${product.name}</h2>
        <p style="font-size: 1.05rem; font-weight: bold; color: var(--a); margin: 4px 0;">$${Number(product.price).toFixed(2)}</p>
        <p style="color: #64748b; font-size: 0.88rem; line-height: 1.3; white-space: pre-line; margin-bottom: 12px; max-height: 90px; overflow-y: auto; padding-right: 4px;">${product.desc}</p>
        <button onclick="addToCartById(${product.id}); closeProductModal();" style="width:100%; background:var(--v); color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size: 0.95rem;">Agregar al Carrito</button>
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
