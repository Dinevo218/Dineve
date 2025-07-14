let cart = [];
let lastSentCart = [];
let dishAvailability = {};

function normalizeName(name) {
  return name.toLowerCase().trim();
}

function fetchAvailability() {
  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNXMZ71_oZARWaNZ3eTJlXJ8q-u3d84AyOAj1a9ZEuS6YzToiCgA9Hw4LQ-Tk32Xm3IvsAHnVuqOty/pubhtml?gid=0&single=true";

  fetch(sheetURL)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const table = doc.querySelector('table');

      if (!table) throw new Error("❌ No table found in Google Sheet");

      const rows = table.querySelectorAll('tbody tr');

      rows.forEach((row, index) => {
        if (index === 0) return; // skip header
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const name = normalizeName(cells[0].innerText);
          const status = cells[1].innerText.trim().toUpperCase();
          dishAvailability[name] = status === 'Y';
        }
      });

      console.log("🔄 Availability map:", dishAvailability);
      updateMenuAvailability();
    })
    .catch(err => console.error("⚠️ Error loading sheet:", err));
}

function updateMenuAvailability() {
  console.log("🔄 Availability map:", dishAvailability); // Debug line

  document.querySelectorAll('.dish').forEach(dishEl => {
    const h3 = dishEl.querySelector('h3');
    if (!h3) return;

    const dishName = normalizeName(h3.innerText);
    const isAvailable = dishAvailability[dishName];

    console.log(`🧪 Dish: "${dishName}" | Available: ${isAvailable}`);

    if (isAvailable === false) {
      dishEl.classList.add('unavailable');

      const buttons = dishEl.querySelectorAll('.dish-buttons button');
      buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes('add')) {
          btn.disabled = true;
          btn.innerText = 'Not available today';
        }
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', fetchAvailability);

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
