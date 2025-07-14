let cart = [];
let lastSentCart = [];
let dishAvailability = {};

function normalizeName(name) {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}


function fetchAvailability() {
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTNXMZ71_oZARWaNZ3eTJlXJ8q-u3d84AyOAj1a9ZEuS6YzToiCgA9Hw4LQ-Tk32Xm3IvsAHnVuqOty/pub?output=csv')
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split('\n');
      const dishAvailability = {};

      for (let i = 1; i < lines.length; i++) {
        const [rawName, rawStatus] = lines[i].split(',');

        if (!rawName || !rawStatus) continue;

        const name = rawName.trim().toLowerCase();
        const available = rawStatus.trim().toUpperCase() === 'Y';
        dishAvailability[name] = available;
      }

      console.log("🔄 Availability map:", dishAvailability);
      updateMenuAvailability(dishAvailability);
    })
    .catch(error => {
      console.error('❌ Failed to load availability:', error);
    });
}

function updateMenuAvailability(dishAvailability) {
  document.querySelectorAll('.dish').forEach(dishEl => {
    const h3 = dishEl.querySelector('h3');
    const dishName = h3?.innerText?.toLowerCase().trim();
    const isAvailable = dishAvailability[dishName];

    console.log(`🧪 Checking "${dishName}":`, isAvailable);

    if (isAvailable === false) {
      dishEl.classList.add('unavailable');
      dishEl.style.opacity = 0.4;

      const buttons = dishEl.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes('add')) {
          btn.disabled = true;
          btn.innerText = 'Not available today';
        }
      });
    } else {
      dishEl.classList.remove('unavailable');
      dishEl.style.opacity = 1;

      const buttons = dishEl.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes('not available')) {
          btn.disabled = false;
          btn.in



// 🛒 Everything below is unchanged (your existing cart logic)...

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1, sent: false });
  }
  updateCartCount();
  showToast(`${name} added to cart`);
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").innerText = count;
}

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
      </div>`).join("")}
    ${cart.length > 0 ? `
      <div class="cart-total">Total: ₹${calculateTotal()}</div>
      <div class="cart-actions">
        <button class="send-order" onclick="sendOrderToWaiter()">Send Order</button>
        <button class="place-order" onclick="placeOrder()">Place Order</button>
        <button class="close" onclick="closeCart()">Close</button>
      </div>` : '<div style="text-align: right;"><button class="close" onclick="closeCart()">Close</button></div>'}
  `;

  cartModal.style.display = "block";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function increaseQuantity(name) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity++;
    openCart();
    updateCartCount();
  }
}

function decreaseQuantity(name) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity--;
    if (item.quantity === 0) {
      cart = cart.filter(i => i.name !== name);
    }
    openCart();
    updateCartCount();
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

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
  lastSentCart = [];
  updateCartCount();
  closeCart();
}

function closeBill() {
  document.getElementById("bill-modal").style.display = "none";
}

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

function toggleMenu() {
  const menu = document.getElementById("section-menu");
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
  } else {
    menu.style.display = "flex";
    setTimeout(() => {
      menu.classList.add("active");
    }, 10);
  }
}

function viewAR(url) {
  window.open(url, "_blank");
}

function toggleMore(elem) {
  const more = elem.previousElementSibling;
  if (more.style.display === "none" || more.style.display === "") {
    more.style.display = "inline";
    elem.innerText = "less";
  } else {
    more.style.display = "none";
    elem.innerText = "more";
  }
}

function closeMenu() {
  const menu = document.getElementById("section-menu");
  menu.classList.remove("active");
  setTimeout(() => {
    menu.style.display = "none";
  }, 300);
}

function sendOrderToWaiter() {
  const newItems = cart.map(currentItem => {
    const previous = lastSentCart.find(prev => prev.name === currentItem.name);
    const prevQty = previous ? previous.quantity : 0;
    const newQty = currentItem.quantity - prevQty;

    return newQty > 0 ? { name: currentItem.name, quantity: newQty } : null;
  }).filter(item => item !== null);

  if (newItems.length === 0) {
    showToast("No new items to send.");
    return;
  }

  const message = newItems.map(item => `${item.name} x${item.quantity}`).join('\n');
  const phone = "919113692373";
  const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  lastSentCart = cart.map(item => ({ ...item }));
  window.open(whatsappURL, '_blank');
}
