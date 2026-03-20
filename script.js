let allProducts = [];

// ─── Load Products from JSON ───────────────────────────────────────────────
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderProducts(allProducts);
  })
  .catch(err => console.error('Failed to load products.json:', err));

// ─── Render Products to Grid ───────────────────────────────────────────────
function renderProducts(list) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6b7280;">
        <div style="font-size: 3rem;">🔍</div>
        <p style="font-size: 1.25rem; margin-top: 1rem;">No products found. Try a different search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-badge ${p.badgeClass || ''}">${p.badge || ''}</div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-specs">
          ${p.specs.map(s => `<span class="spec">${s}</span>`).join('')}
        </div>
        <div class="product-footer">
          <span class="product-price">$${Number(p.price).toFixed(2)}</span>
          <button class="order-btn" onclick="order('${p.name}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── Search ────────────────────────────────────────────────────────────────
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return allProducts;
  return allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q))) ||
    (p.specs && p.specs.some(s => s.toLowerCase().includes(q))) ||
    (p.category && p.category.toLowerCase().includes(q))
  );
}

// Live search on input
document.querySelector('header input').addEventListener('input', function () {
  const results = searchProducts(this.value);
  renderProducts(results);
  // Scroll to products grid
  if (this.value.trim()) {
    document.querySelector('#featured-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Search button click
document.querySelector('.search-btn').addEventListener('click', function () {
  const searchTerm = document.querySelector('header input').value;
  const results = searchProducts(searchTerm);
  renderProducts(results);
  if (searchTerm.trim()) {
    document.querySelector('#featured-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Enter key support for search
document.querySelector('header input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    document.querySelector('.search-btn').click();
  }
});

// ─── Order / WhatsApp ──────────────────────────────────────────────────────
function order(productName = '') {
  const message = productName
    ? `Hi, I'm interested in ordering: ${productName}`
    : `Hi, I'd like to place an order.`;
  window.location.href = `https://wa.me/85512345678?text=${encodeURIComponent(message)}`;
}

// ─── Cart (placeholder) ────────────────────────────────────────────────────
function openCart() {
  alert('Cart functionality will be implemented here');
}

// ─── Smooth Scroll + Active Nav ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
});