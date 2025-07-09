let cart = [];

// Add item to cart
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartCount();
  showToast(`${name} added to cart`);
}

// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").innerText = count;
}

// Open Cart Modal
function openCart() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length === 0 ? "<p>Your cart is empty.</p>" : ""}
    ${cart.map(item => `
      <div class="cart-item">
        <span>${item.name} x${item.quantity}</span>
        <div class="cart-item-controls">
          <button onclick="increaseQuantity('${item.name}')">+</button>
          <button onclick="decreaseQuantity('${item.name}')">−</button>
        </div>
      </div>
    `).join("")}
    ${cart.length > 0
      ? `<div class="cart-total">Total: ₹${calculateTotal()}</div>
         <div class="cart-actions">
           <button class="place-order" onclick="placeOrder()">Total Bill</button>
           <button class="close" onclick="closeCart()">Close</button>
         </div>`
      : '<div style="text-align: right;"><button class="close" onclick="closeCart()">Close</button></div>'}
  `;
  cartModal.style.display = "block";
}

// Close Cart Modal
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// Increase quantity in cart
function increaseQuantity(name) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.quantity++;
    openCart();
    updateCartCount();
  }
}

// Decrease quantity in cart
function decreaseQuantity(name) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
    openCart();
    updateCartCount();
  }
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Finalize order and show bill
function placeOrder() {
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  const billModal = document.getElementById("bill-modal");
  const billDetails = document.getElementById("bill-details");
  const billTotal = document.getElementById("bill-total");

  billDetails.innerHTML = cart.map(item => `
    <div class="bill-item">
      <span>${item.name} x${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
    </div>
  `).join("");

  billTotal.innerText = `Total: ₹${calculateTotal()}`;
  billModal.style.display = "flex";

  cart = [];
  updateCartCount();
  closeCart();
}

// Close bill modal
function closeBill() {
  document.getElementById("bill-modal").style.display = "none";
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 3000);
}

// Toggle floating menu
function toggleMenu() {
  const menu = document.getElementById("section-menu");
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    setTimeout(() => {
      menu.style.display = "none";
    }, 200);
  } else {
    menu.style.display = "flex";
    setTimeout(() => {
      menu.classList.add("active");
    }, 10);
  }
}

// Close menu when category selected
function closeMenu() {
  const menu = document.getElementById("section-menu");
  menu.classList.remove("active");
  setTimeout(() => {
    menu.style.display = "none";
  }, 300);
}

// View AR model in new tab
function viewAR(url) {
  window.open(url, "_blank");
}

// Reveal dishes as they scroll into view
window.addEventListener("scroll", () => {
  document.querySelectorAll(".dish").forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add("visible");
    }
  });
});
