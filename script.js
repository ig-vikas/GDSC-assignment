const API_URL = 'https://fakestoreapi.com/products';

let cart = [];
const platformFee = 10;
const shippingCharges = 20;
let products = [];


async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(productsToRender) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToRender.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-rating">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <p class="product-price">₹${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
    
        productCard.onclick = () => showItemDetails(product);
    
        productList.appendChild(productCard);
    });    

    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(button.dataset.id);
        });
    });
}

function showItemDetails(product) {
    document.getElementById('item-title').textContent = product.title;
    document.getElementById('item-description').textContent = product.description;
    document.getElementById('item-category').textContent = product.category;

    const modal = document.getElementById('item-modal');
    modal.style.display = 'block';

    const closeButton = document.querySelector('.close-button');
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function addToCart(productId) {
    const product = products.find((p) => p.id == productId);
    const cartItem = cart.find((item) => item.id == productId);

    if (cartItem) {
        cartItem.quantity += 1; 
    } else {
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    renderCart();
}


function removeFromCart(productId) {
    console.log(`Removing item with ID: ${productId}`);
    cart = cart.filter((item) => item.id != productId); 
    renderCart(); 
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalMrpElement = document.getElementById('total-mrp');
    const totalAmountElement = document.getElementById('total-amount');
    const couponDiscountElement = document.getElementById('coupon-discount');

    cartItemsContainer.innerHTML = '';

    let totalMrp = 0;
    cart.forEach((item) => {
        totalMrp += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-name">${item.title}</div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">X</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem); 
    });

    const couponDiscount = calculateDiscount(totalMrp);
    const totalAmount = totalMrp - couponDiscount + platformFee + shippingCharges;

    totalMrpElement.textContent = totalMrp.toFixed(2);
    couponDiscountElement.textContent = couponDiscount.toFixed(2);
    totalAmountElement.textContent = totalAmount.toFixed(2);
}


function updateQuantity(productId, change) {
    const cartItem = cart.find((item) => item.id == productId);
    if (cartItem) {
        cartItem.quantity += change;


        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        }
    }
    renderCart();
}

function calculateDiscount(totalMrp) {
    return totalMrp > 500 ? 50 : 0;
}


document.getElementById('search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});



let categories = [];


async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        extractCategories(products);
        renderProducts(products);
        populateCategoryFilter(categories);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


function extractCategories(products) {
    categories = [...new Set(products.map(product => product.category))];
}


function populateCategoryFilter(categories) {
    const categoryFilter = document.getElementById('category-filter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });


    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
        renderProducts(filteredProducts); 
    });
}


function renderProducts(productsToRender) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToRender.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-rating">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <p>₹${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        
        productCard.onclick = () => showItemDetails(product);

        productList.appendChild(productCard);
    });


    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(button.dataset.id);
        });
    });
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before placing an order.");
        return;
    }

    const orderMessage = document.getElementById('order-message');
    orderMessage.textContent = "Your order has been placed successfully!";
    orderMessage.style.color = "green";
    orderMessage.style.fontWeight = "bold"; 

    cart = []; 
    renderCart();
}




fetchProducts(); 
