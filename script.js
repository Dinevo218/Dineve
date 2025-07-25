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
          btn.innerText = 'Add to Cart';
        }
      });
    }
  });
}


function openCart() {
  const cartModal = document.getElementById("cart-modal");
  const cartCount = document.getElementById("cart-count");
  let html = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    html += "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      html += `<div class="cart-item">
        <span>${item.name}</span>
        <div class="cart-item-controls">
          <button onclick="changeQuantity(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <span>₹${item.price * item.quantity}</span>
      </div>`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    html += `<div class="cart-total">Total: ₹${total}</div>`;
  }

  html += `<div class="cart-actions">
    <button class="place-order" onclick="placeOrder()">Place Order</button>
    <button class="close" onclick="closeCart()">Close</button>
  </div>`;

  cartModal.innerHTML = html;
  cartModal.style.display = "block";
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove item if quantity is 0 or less
  }
  document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
  openCart(); // Re-render cart modal
}


function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
  showToast(`${name} added to cart`);
}

function placeOrder() {
  const billDetails = document.getElementById("bill-details");
  const billTotal = document.getElementById("bill-total");
  let html = "";

  if (cart.length === 0) {
    showToast("Cart is empty!");
    return;
  }

  cart.forEach(item => {
    html += `<div class="bill-item">
      <span>${item.name} x ${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
    </div>`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  billDetails.innerHTML = html;
  billTotal.innerHTML = `Total: ₹${total}`;

  document.getElementById("bill-modal").style.display = "flex";
  closeCart(); // Hide cart modal
}


function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

function toggleMenu() {
  const menu = document.getElementById("section-menu");
  menu.classList.toggle("active");
  menu.style.display = menu.classList.contains("active") ? "flex" : "none";
}

function closeMenu() {
  const menu = document.getElementById("section-menu");
  menu.classList.remove("active");
  menu.style.display = "none";
}

function toggleMore(elem) {
  const moreText = elem.previousElementSibling;
  if (moreText.style.display === "inline") {
    moreText.style.display = "none";
    elem.innerText = "more";
  } else {
    moreText.style.display = "inline";
    elem.innerText = "less";
  }
}

function viewAR(url) {
  window.open(url, "_blank");
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

document.addEventListener('DOMContentLoaded', () => {
  fetchAvailability();
});

function closeBill() {
  document.getElementById("bill-modal").style.display = "none";
}