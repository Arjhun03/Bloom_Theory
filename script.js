/**
 * Plant Shop - Interactive Engine & Dynamic Products Management
 * Replicated from https://websitedemos.net/plant-shop-02/
 */

// --- Default 6 Plant Shop Products ---
const DEFAULT_PRODUCTS = [
  {
    id: 'birdnest-japanese',
    name: 'Birdnest Japanese',
    category: 'Air purifying',
    price: 84.90,
    image: 'assets/images/product-birdnest-japanese.jpg',
    description: 'A lush air-purifying fern with glossy, wavy emerald fronds that thrive in indirect indoor lighting.',
    isCustom: false
  },
  {
    id: 'hoya-obovatum',
    name: 'Hoya Obovatum',
    category: 'Indoor Plants',
    price: 64.00,
    image: 'assets/images/product-hoya-obovatum.jpg',
    description: 'Distinctive round, waxy succulent leaves with occasional silver splashes. Very low maintenance.',
    isCustom: false
  },
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    category: 'Air purifying',
    price: 224.90,
    image: 'assets/images/product-monstera-deliciosa.jpg',
    description: 'The iconic Swiss Cheese plant featuring magnificent split leaves that brings an instant tropical vibe.',
    isCustom: false
  },
  {
    id: 'zz-plants',
    name: 'Zz Plants',
    category: 'Herbs seeds',
    price: 124.90,
    image: 'assets/images/product-zz-plants.jpg',
    description: 'Virtually indestructible with thick, glossy foliage that handles low light and infrequent watering.',
    isCustom: false
  },
  {
    id: 'bird-of-paradise',
    name: 'Bird of Paradise',
    category: 'Ceramic pots',
    price: 249.90,
    image: 'assets/images/product-bird-of-paradise.jpg',
    description: 'Stately architectural indoor palm with large paddle-shaped leaves that make a dramatic statement.',
    isCustom: false
  },
  {
    id: 'calathea-beauty-star',
    name: 'Calathea Beauty Star',
    category: 'Herbs seeds',
    price: 79.90,
    image: 'assets/images/product-calathea-beauty-star.jpg',
    description: 'Artistic patterned foliage with delicate pink pinstripes and rich purple undersides.',
    isCustom: false
  }
];

// --- Product Store Helper Methods ---
function getStoredProducts() {
  try {
    const raw = localStorage.getItem('plant_shop_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading products from storage:', err);
  }
  // Initialize with default catalog if first time or cleared
  localStorage.setItem('plant_shop_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveStoredProducts(list) {
  try {
    localStorage.setItem('plant_shop_products', JSON.stringify(list));
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

function addProductToCatalog(product) {
  const current = getStoredProducts();
  current.unshift(product); // Add to beginning of catalog
  saveStoredProducts(current);
}

function deleteProductFromCatalog(id) {
  const current = getStoredProducts();
  const updated = current.filter(item => item.id !== id);
  saveStoredProducts(updated);
  return updated;
}

function resetCatalogToDefaults() {
  saveStoredProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

// Global bag icon SVG string for reuse
const BAG_ICON_SVG = `
  <svg viewBox="826 826 140 140">
    <path d="M960.758,934.509l2.632,23.541c0.15,1.403-0.25,2.657-1.203,3.761c-0.953,1.053-2.156,1.579-3.61,1.579H833.424 c-1.454,0-2.657-0.526-3.61-1.579c-0.952-1.104-1.354-2.357-1.203-3.761l2.632-23.541H960.758z M953.763,871.405l6.468,58.29H831.77 l6.468-58.29c0.15-1.203,0.677-2.218,1.58-3.045c0.903-0.827,1.981-1.241,3.234-1.241h19.254v9.627c0,2.658,0.94,4.927,2.82,6.807 s4.149,2.82,6.807,2.82c2.658,0,4.926-0.94,6.807-2.82s2.821-4.149,2.821-6.807v-9.627h28.882v9.627 c0,2.658,0.939,4.927,2.819,6.807c1.881,1.88,4.149,2.82,6.807,2.82s4.927-0.94,6.808-2.82c1.879-1.88,2.82-4.149,2.82-6.807v-9.627 h19.253c1.255,0,2.332,0.414,3.235,1.241C953.086,869.187,953.612,870.202,953.763,871.405z M924.881,857.492v19.254 c0,1.304-0.476,2.432-1.429,3.385s-2.08,1.429-3.385,1.429c-1.303,0-2.432-0.477-3.384-1.429c-0.953-0.953-1.43-2.081-1.43-3.385 v-19.254c0-5.315-1.881-9.853-5.641-13.613c-3.76-3.761-8.298-5.641-13.613-5.641s-9.853,1.88-13.613,5.641 c-3.761,3.76-5.641,8.298-5.641,13.613v19.254c0,1.304-0.476,2.432-1.429,3.385c-0.953,0.953-2.081,1.429-3.385,1.429 c-1.303,0-2.432-0.477-3.384-1.429c-0.953-0.953-1.429-2.081-1.429-3.385v-19.254c0-7.973,2.821-14.779,8.461-20.42 c5.641-5.641,12.448-8.461,20.42-8.461c7.973,0,14.779,2.82,20.42,8.461C922.062,842.712,924.881,849.519,924.881,857.492z" />
  </svg>
`;

document.addEventListener('DOMContentLoaded', () => {
  // --- Cart State Management ---
  const state = {
    cart: []
  };

  // Load cart from localStorage if present
  try {
    const saved = localStorage.getItem('plant_shop_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Storage error:', e);
  }

  function saveCart() {
    try {
      localStorage.setItem('plant_shop_cart', JSON.stringify(state.cart));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // --- Shared DOM Elements ---
  const header = document.querySelector('.site-header');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartDrawerFooter = document.getElementById('cartDrawerFooter');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Mobile Nav Elements
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');

  // --- Sticky Header on Scroll ---
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Cart Drawer Toggle ---
  function openCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartTriggerBtn) {
    cartTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      closeCartDrawer();
      closeMobileNav();
    });
  }

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', closeCartDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeMobileNav();
    }
  });

  // --- Mobile Navigation ---
  function openMobileNav() {
    if (!mobileNavDrawer || !cartOverlay) return;
    mobileNavDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNavDrawer || !cartOverlay) return;
    mobileNavDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', openMobileNav);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- Toast Notification ---
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // --- Cart Calculations & Render ---
  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Header
    if (cartSubtotal) {
      cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
    if (cartCountBadge) {
      cartCountBadge.textContent = totalCount;
      cartCountBadge.classList.add('bump');
      setTimeout(() => cartCountBadge.classList.remove('bump'), 250);
    }

    // Update Drawer
    if (!cartEmptyState || !cartItemsList || !cartDrawerFooter) return;

    if (state.cart.length === 0) {
      cartEmptyState.style.display = 'flex';
      cartItemsList.style.display = 'none';
      cartDrawerFooter.style.display = 'none';
    } else {
      cartEmptyState.style.display = 'none';
      cartItemsList.style.display = 'flex';
      cartDrawerFooter.style.display = 'block';

      cartItemsList.innerHTML = state.cart.map(item => `
        <li class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-meta">
              <div class="qty-control">
                <button type="button" class="qty-btn dec-qty-btn" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button type="button" class="qty-btn inc-qty-btn" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button type="button" class="cart-item-remove remove-item-btn" data-id="${item.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </li>
      `).join('');

      if (cartTotalAmount) {
        cartTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;
      }
    }

    saveCart();
  }

  // --- Add to Cart Handler ---
  function addToCart(productId) {
    const allProducts = getStoredProducts();
    const prod = allProducts.find(p => p.id === productId);
    if (!prod) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        price: Number(prod.price),
        image: prod.image,
        quantity: 1
      });
    }

    updateCartUI();
    showToast(`"${prod.name}" added to cart`);
  }

  // Cart Items Qty & Remove Listeners
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.inc-qty-btn');
      const decBtn = e.target.closest('.dec-qty-btn');
      const removeBtn = e.target.closest('.remove-item-btn');

      if (incBtn) {
        const id = incBtn.getAttribute('data-id');
        const item = state.cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          updateCartUI();
        }
      } else if (decBtn) {
        const id = decBtn.getAttribute('data-id');
        const item = state.cart.find(i => i.id === id);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.cart = state.cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      } else if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        state.cart = state.cart.filter(i => i.id !== id);
        updateCartUI();
      }
    });
  }

  // Checkout Button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Thank you for exploring this replica! Checkout simulation successful.');
    });
  }

  // ========================================================================
  // DYNAMIC PRODUCTS FETCHING & RENDERING (HOMEPAGE)
  // ========================================================================
  const productsGrid = document.getElementById('productsGrid');

  function renderSkeletonLoading() {
    if (!productsGrid) return;
    productsGrid.innerHTML = `
      <div class="products-loading-banner">
        <div class="products-loading-spinner"></div>
        <p>Fetching botanical inventory...</p>
      </div>
      ${Array.from({ length: 6 }).map(() => `
        <div class="skeleton-card">
          <div class="skeleton-thumb"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text category"></div>
          <div class="skeleton-text price"></div>
        </div>
      `).join('')}
    `;
  }

  function fetchAndRenderProducts() {
    if (!productsGrid) return;

    // Show realistic fetch skeleton state
    renderSkeletonLoading();

    // Simulate async data fetching (e.g. from local storage / API)
    setTimeout(() => {
      const products = getStoredProducts();

      if (!products || products.length === 0) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <p>No plants currently available in the catalog.</p>
            <a href="add-product.html" class="btn btn-primary" style="margin-top: 16px;">Add First Plant</a>
          </div>
        `;
        return;
      }

      // Render product cards with exact same classes & structure
      productsGrid.innerHTML = products.map(prod => `
        <article class="product-card" data-product-id="${prod.id}">
          <div class="product-thumb">
            ${prod.isCustom ? `<span class="product-badge-new">New</span>` : ''}
            ${prod.isCustom ? `
              <button type="button" class="product-delete-btn" data-delete-id="${prod.id}" title="Remove custom plant" aria-label="Delete ${prod.name}">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : ''}
            <img src="${prod.image}" alt="${prod.name}" width="400" height="600" loading="lazy" onerror="this.src='assets/images/product-birdnest-japanese.jpg'">
            <button type="button" class="quick-add-btn" data-product-id="${prod.id}" aria-label="Add ${prod.name} to cart">
              ${BAG_ICON_SVG}
            </button>
            <span class="quick-add-tooltip">Add to cart</span>
          </div>
          <div class="product-meta">
            <h3 class="product-title">${prod.name}</h3>
            <span class="product-category">${prod.category}</span>
            <span class="product-price">$${Number(prod.price).toFixed(2)}</span>
          </div>
        </article>
      `).join('');
    }, 450); // Sleek 450ms fetch simulation
  }

  // Event Delegation for Products Grid (Quick Add and Delete)
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.quick-add-btn');
      const deleteBtn = e.target.closest('.product-delete-btn');

      if (addBtn) {
        e.preventDefault();
        const productId = addBtn.getAttribute('data-product-id');
        addToCart(productId);
      } else if (deleteBtn) {
        e.preventDefault();
        const deleteId = deleteBtn.getAttribute('data-delete-id');
        if (confirm('Are you sure you want to remove this custom plant from the catalog?')) {
          deleteProductFromCatalog(deleteId);
          fetchAndRenderProducts();
          showToast('Product removed from catalog');
        }
      }
    });

    // Initial Fetch
    fetchAndRenderProducts();
  }

  // ========================================================================
  // ADD PRODUCT PAGE LOGIC (add-product.html)
  // ========================================================================
  const addProductForm = document.getElementById('addProductForm');
  const livePreviewCard = document.getElementById('livePreviewCard');
  const previewName = document.getElementById('previewName');
  const previewCategory = document.getElementById('previewCategory');
  const previewPrice = document.getElementById('previewPrice');
  const previewImage = document.getElementById('previewImage');

  // Input Fields
  const inputName = document.getElementById('plantName');
  const inputCategory = document.getElementById('plantCategory');
  const inputCustomCategory = document.getElementById('customCategory');
  const inputPrice = document.getElementById('plantPrice');
  const inputDescription = document.getElementById('plantDescription');
  const inputImageUrl = document.getElementById('plantImageUrl');
  const inputImageFile = document.getElementById('plantImageFile');
  const imageDropzone = document.getElementById('imageDropzone');
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  // Live Preview Updater
  function updateLivePreview() {
    if (!livePreviewCard) return;

    const name = (inputName && inputName.value.trim()) || 'Philodendron Beauty';
    let category = (inputCategory && inputCategory.value) || 'Air purifying';
    if (category === 'custom' && inputCustomCategory) {
      category = inputCustomCategory.value.trim() || 'Exotic Foliage';
    }
    const rawPrice = inputPrice && inputPrice.value ? Number(inputPrice.value) : 89.90;
    const priceFormatted = `$${isNaN(rawPrice) ? '0.00' : rawPrice.toFixed(2)}`;

    let imageSrc = 'assets/images/product-birdnest-japanese.jpg';
    if (currentSelectedImage) {
      imageSrc = currentSelectedImage;
    } else if (inputImageUrl && inputImageUrl.value.trim()) {
      imageSrc = inputImageUrl.value.trim();
    }

    if (previewName) previewName.textContent = name;
    if (previewCategory) previewCategory.textContent = category;
    if (previewPrice) previewPrice.textContent = priceFormatted;
    if (previewImage) {
      previewImage.src = imageSrc;
      previewImage.onerror = () => {
        previewImage.src = 'assets/images/product-birdnest-japanese.jpg';
      };
    }
  }

  let currentSelectedImage = '';

  // Setup Add Product Form Events if on add-product page
  if (addProductForm) {
    // Inputs Listeners for Live Preview
    [inputName, inputCategory, inputCustomCategory, inputPrice, inputImageUrl].forEach(el => {
      if (el) {
        el.addEventListener('input', updateLivePreview);
        el.addEventListener('change', updateLivePreview);
      }
    });

    // Toggle custom category input
    if (inputCategory) {
      inputCategory.addEventListener('change', () => {
        if (inputCategory.value === 'custom') {
          if (inputCustomCategory) inputCustomCategory.style.display = 'block';
        } else {
          if (inputCustomCategory) inputCustomCategory.style.display = 'none';
        }
        updateLivePreview();
      });
    }

    // Image Tab Switching (Upload vs URL vs Preset)
    document.querySelectorAll('.image-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.image-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');

        document.getElementById('tabUpload').style.display = target === 'upload' ? 'block' : 'none';
        document.getElementById('tabUrl').style.display = target === 'url' ? 'block' : 'none';
        document.getElementById('tabPresets').style.display = target === 'presets' ? 'block' : 'none';
      });
    });

    // Preset Image Clicks
    document.querySelectorAll('.preset-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
        item.classList.add('selected');
        currentSelectedImage = item.getAttribute('data-img');
        if (inputImageUrl) inputImageUrl.value = '';
        updateLivePreview();
      });
    });

    // File Upload via FileReader (Base64)
    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        currentSelectedImage = e.target.result;
        document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
        if (inputImageUrl) inputImageUrl.value = '';
        updateLivePreview();
        const dropzoneText = imageDropzone ? imageDropzone.querySelector('p') : null;
        if (dropzoneText) dropzoneText.textContent = `Selected: ${file.name}`;
      };
      reader.readAsDataURL(file);
    }

    if (inputImageFile) {
      inputImageFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    if (imageDropzone) {
      imageDropzone.addEventListener('click', () => {
        if (inputImageFile) inputImageFile.click();
      });
      imageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropzone.classList.add('dragover');
      });
      imageDropzone.addEventListener('dragleave', () => {
        imageDropzone.classList.remove('dragover');
      });
      imageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Form Submission
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = inputName.value.trim();
      let category = inputCategory.value;
      if (category === 'custom') {
        category = inputCustomCategory ? inputCustomCategory.value.trim() : 'Exotic';
      }
      const price = parseFloat(inputPrice.value);
      const description = inputDescription ? inputDescription.value.trim() : '';

      let image = currentSelectedImage;
      if (!image && inputImageUrl && inputImageUrl.value.trim()) {
        image = inputImageUrl.value.trim();
      }
      if (!image) {
        image = 'assets/images/product-birdnest-japanese.jpg';
      }

      if (!name || isNaN(price) || price <= 0) {
        alert('Please fill in a valid plant name and price.');
        return;
      }

      // Unique ID
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

      const newProduct = {
        id: slug,
        name: name,
        category: category,
        price: Number(price.toFixed(2)),
        image: image,
        description: description,
        isCustom: true
      };

      // Save into Catalog
      addProductToCatalog(newProduct);

      // Render updated inventory list
      renderInventoryTable();

      // Show toast
      showToast(`Plant "${name}" successfully added to the catalog!`);

      // Reset form fields
      addProductForm.reset();
      currentSelectedImage = '';
      document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
      if (inputCustomCategory) inputCustomCategory.style.display = 'none';
      const dropzoneText = imageDropzone ? imageDropzone.querySelector('p') : null;
      if (dropzoneText) dropzoneText.textContent = 'Drag & drop image here or click to browse';
      updateLivePreview();
    });

    // Render Inventory Table in Add Product Page
    function renderInventoryTable() {
      if (!inventoryTableBody) return;
      const all = getStoredProducts();

      inventoryTableBody.innerHTML = all.map(p => `
        <tr>
          <td>
            <img src="${p.image}" alt="${p.name}" class="inventory-thumb-mini" onerror="this.src='assets/images/product-birdnest-japanese.jpg'">
          </td>
          <td>
            <strong>${p.name}</strong>
            ${p.isCustom ? `<span class="product-badge-new" style="position:static; display:inline-block; margin-left:6px; font-size:10px; padding:2px 6px;">Custom</span>` : ''}
          </td>
          <td>${p.category}</td>
          <td><strong>$${Number(p.price).toFixed(2)}</strong></td>
          <td class="inventory-actions-cell">
            ${p.isCustom ? `
              <button type="button" class="btn-icon-danger delete-inventory-item" data-id="${p.id}" title="Delete Plant">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : `<span style="font-size: 12px; color: var(--color-muted);">Default</span>`}
          </td>
        </tr>
      `).join('');
    }

    if (inventoryTableBody) {
      inventoryTableBody.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.delete-inventory-item');
        if (delBtn) {
          const id = delBtn.getAttribute('data-id');
          if (confirm('Delete this product from catalog?')) {
            deleteProductFromCatalog(id);
            renderInventoryTable();
            showToast('Plant deleted from catalog');
          }
        }
      });
      renderInventoryTable();
    }

    // Reset Defaults Button
    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener('click', () => {
        if (confirm('Reset entire catalog to original 6 default plants? Any custom items will be cleared.')) {
          resetCatalogToDefaults();
          renderInventoryTable();
          updateLivePreview();
          showToast('Catalog restored to default plants');
        }
      });
    }

    // Initial Live Preview
    updateLivePreview();
  }

  // --- Newsletter Form Submission ---
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (!email || !email.includes('@')) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'newsletter-feedback error';
        return;
      }

      const submitBtn = newsletterForm.querySelector('.newsletter-btn');
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
        newsletterEmail.value = '';
        newsletterFeedback.textContent = 'Thank you for subscribing to Plant Shop!';
        newsletterFeedback.className = 'newsletter-feedback success';
      }, 700);
    });
  }

  // Initial Cart Update
  updateCartUI();
});
