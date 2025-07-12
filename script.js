let cart = [];

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
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").innerText = count;
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function openCart() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length === 0 ? "<p>Your cart is empty.</p>" : ""}
    ${cart
      .map(
        item => `
        <div class="cart-item">
          <span>${item.name} x${item.quantity}</span>
          <div class="cart-item-controls">
            <button onclick="increaseQuantity('${item.name}')">+</button>
            <button onclick="decreaseQuantity('${item.name}')">−</button>
          </div>
        </div>
      `
      )
      .join("")}
    ${
      cart.length > 0
        ? `<div class="cart-total">Total: ₹${calculateTotal()}</div>
           <div class="cart-actions">
             <button class="place-order" onclick="placeOrder()">Place Order</button>
             <button class="close" onclick="closeCart()">Close</button>
           </div>`
        : '<div style="text-align: right;"><button class="close" onclick="closeCart()">Close</button></div>'
    }
  `;
  cartModal.style.display = "block";
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function increaseQuantity(name) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity++;
    openCart();
    updateCartCount();
  }
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

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
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

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

  const total = calculateTotal();
const discount = Math.round(total * 0.10);
const finalAmount = total - discount;

billTotal.innerHTML = `
  <div>Subtotal: ₹${total}</div>
  <div style="color: green;">10% Cashback: -₹${discount}</div>
  <strong>Total Payable: ₹${finalAmount}</strong>
`;

  billModal.style.display = "flex";

  cart = [];
  updateCartCount();
  closeCart();
}

// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function closeBill() {
  document.getElementById("bill-modal").style.display = "none";
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

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
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function toggleMenu() {
  const menu = document.getElementById("section-menu");
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    setTimeout(() => {
      menu.style.display = "none";
    }, 300); // wait for animation
  } else {
    menu.style.display = "flex";
    setTimeout(() => {
      menu.classList.add("active");
    }, 10);
  }
}

// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});


function viewAR(url) {
  window.open(url, "_blank");
}
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

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
// ✅ Scroll reveal for dish cards
window.addEventListener('scroll', () => {
  document.querySelectorAll('.dish').forEach(dish => {
    const rect = dish.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      dish.classList.add('visible');
    }
  });
});

function redeemCashback() {
  const name = document.getElementById("user-name").value.trim();
  const phone = document.getElementById("user-phone").value.trim();

  if (!name || !phone || phone.length < 10) {
    showToast("Please enter valid name and mobile number.");
    return;
  }

  showToast(`Hi ${name}, 🎉 you've unlocked 10% cashback!`);
  document.getElementById("welcome-section").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}
