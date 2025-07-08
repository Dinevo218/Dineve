let cart = [];

// ✅ Add item to cart
function addToCart(name, price) {
  const item = cart.find(dish => dish.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartCount();
 showToast(`${name} added to cart!`);
}

// ✅ Update cart icon count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').innerText = count;
}

// ✅ Open cart popup
function openCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItemsList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <div>
          ${item.name} x${item.qty}
          <br><small>₹${item.price * item.qty}</small>
        </div>
        <div>
          <button onclick="increaseQty(${index})">➕</button>
          <button onclick="decreaseQty(${index})">➖</button>
        </div>
      </div>
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.innerText = total;
  cartModal.classList.remove('hidden');
}

// ✅ Increase item quantity
function increaseQty(index) {
  cart[index].qty++;
  openCart();
  updateCartCount();
}

// ✅ Decrease item quantity
function decreaseQty(index) {
  cart[index].qty--;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  openCart();
  updateCartCount();
}

// ✅ Close cart popup
function closeCart() {
  document.getElementById('cart-modal').classList.add('hidden');
}

// ✅ Place order
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("🎉 Order placed successfully!\nThank you for ordering with Dinévo.");
  cart = [];
  updateCartCount();
  closeCart();
}

// ✅ Scroll to category section
function scrollToCategory(id) {
  const section = document.getElementById(id);
  section.scrollIntoView({ behavior: "smooth" });
}

// ✅ Toggle category menu popup
function toggleMenuPopup() {
  const popup = document.getElementById('menu-popup');
  popup.classList.toggle('hidden');
}
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100); // trigger animation

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300); // remove after fade out
  }, 2500);
}
