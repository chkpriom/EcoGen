document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('chaya_cart')) || [];

    // Mobile Menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Scroll Reveal Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Cart Drawer Toggle
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            renderCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
        });
    }

    // Add to Cart Logic
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);

            addToCart({ id, name, price });

            // Visual feedback
            const originalText = e.target.innerText;
            e.target.innerText = 'Added!';
            e.target.classList.add('btn-success');

            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.classList.remove('btn-success');
            }, 1000);
        });
    });

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('chaya_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.innerText = count;
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
            cartTotal.innerText = '0 tk';
            checkoutBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} tk x ${item.quantity}</p>
                </div>
                <span class="material-icons remove-item" data-id="${item.id}">delete_outline</span>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotal.innerText = `${total.toLocaleString()} tk`;
        checkoutBtn.disabled = false;

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.id);
            });
        });
    }

    // Checkout / Payment Simulation
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            const total = cartTotal.innerText;

            alert(`Processing payment of ${total} via ${selectedPayment.toUpperCase()}...`);

            setTimeout(() => {
                alert('Payment Successful! Thank you for choosing Chaya.');
                cart = [];
                updateCart();
                cartDrawer.classList.remove('active');
            }, 1500);
        });
    }

    const authTrigger = document.getElementById('auth-modal-toggle');
    const authModal = document.getElementById('auth-modal');
    const closeModals = document.querySelectorAll('.close-modal');

    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            demoModal.style.display = 'block';
        });
    }

    if (quoteTrigger) {
        quoteTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            quoteModal.style.display = 'block';
        });
    }

    if (authTrigger) {
        authTrigger.addEventListener('click', () => {
            authModal.style.display = 'block';
        });
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Auth Tab Switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });

    // Form Submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Welcome back to Chaya!');
            authModal.style.display = 'none';
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account created successfully! Welcome to Chaya.');
            authModal.style.display = 'none';
        });
    }

    // Quote Form Submission
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your quote request has been sent to the Chaya team.');
            quoteModal.style.display = 'none';
            quoteForm.reset();
        });
    }

    // Initial count update
    updateCartCount();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

