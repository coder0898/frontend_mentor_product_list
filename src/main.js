import "./style.css";

// DOM Elements
const listDisplay = document.getElementById("listDisplay");
const cartList = document.getElementById("cartList");

// Global State
let productData = [];
let cartState = {};
let totalPrice = 0;

// Fetch JSON data
async function getJSONData() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("Failed to fetch data");
    productData = await res.json();
    displayProducts();
  } catch (error) {
    console.error(error);
    listDisplay.innerHTML = "<p>Error loading products.</p>";
  }
}

// Create product card
function createCard({ image, name, category, price }, index) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${image.desktop}" alt="${name}" />
    <div class="button-group">
      <button class="cart-btn" data-id="${index}">
        <img src="./images/icon-add-to-cart.svg" alt="Add to cart" />
        <span>Add to cart</span>
      </button>
      <div class="counter-box" style="display: none;">
        <button class="decrement" data-id="${index}">-</button>
        <span class="counter" data-id="${index}">1</span>
        <button class="increment" data-id="${index}">+</button>
      </div>
    </div>
    <div class="content">
      <span>${category}</span>
      <h4>${name}</h4>
      <p>$ ${price}</p>
    </div>
  `;

  // Add event listeners
  const addBtn = card.querySelector(".cart-btn");
  const counterBox = card.querySelector(".counter-box");
  const counterDisplay = card.querySelector(".counter");

  addBtn.addEventListener("click", () => {
    addBtn.style.display = "none";
    counterBox.style.display = "flex";
    cartState[index] = 1;
    updateCartUI();
  });

  card.querySelector(".increment").addEventListener("click", () => {
    cartState[index]++;
    counterDisplay.textContent = cartState[index];
    updateCartUI();
  });

  card.querySelector(".decrement").addEventListener("click", () => {
    if (cartState[index] > 1) {
      cartState[index]--;
    } else {
      delete cartState[index];
      addBtn.style.display = "flex";
      counterBox.style.display = "none";
    }
    counterDisplay.textContent = cartState[index] || 1;
    updateCartUI();
  });

  return card;
}

// Display all products
function displayProducts() {
  listDisplay.innerHTML = "";

  if (!productData.length) {
    listDisplay.innerHTML = "<p>No products to display.</p>";
    return;
  }

  productData.forEach((product, index) => {
    listDisplay.appendChild(createCard(product, index));
  });
}

// Update cart preview
function updateCartUI() {
  cartList.innerHTML = "";

  // Initialize total counters
  let totalItems = 0;
  let totalPrice = 0;

  // Empty cart check
  if (Object.keys(cartState).length === 0) {
    cartList.innerHTML = `
      <div class="empty-content">
        <img src="./images/illustration-empty-cart.svg" alt="Empty Cart" />
        <p>Your added items will appear here</p>
      </div>`;
    return;
  }

  // Render each cart item
  Object.entries(cartState).forEach(([id, quantity]) => {
    const item = productData[id];

    const itemElem = document.createElement("div");
    itemElem.className = "cart-item";
    itemElem.innerHTML = `
      <div class="tittle">
        <p>${item.name}</p>
        <div class="price-group">
          <p>${quantity}x</p>
          <span>@$${item.price.toFixed(2)}</span>
          <span>$ ${(item.price * quantity).toFixed(2)}</span>
        </div>
      </div>
      <div class="close-btn">&#10060;</div>
    `;

    // Optional: handle "remove" button
    itemElem.querySelector(".close-btn").addEventListener("click", () => {
      delete cartState[id];

      updateCartUI();

      const card = document.querySelectorAll(".card")[id];
      if (card) {
        const addBtn = card.querySelector(".cart-btn");
        const counterBox = card.querySelector(".counter-box");
        const counterDisplay = card.querySelector(".counter");

        if (addBtn && counterBox && counterDisplay) {
          addBtn.style.display = "flex";
          counterBox.style.display = "none";
          counterDisplay.textContent = "1";
        }
      }
    });

    cartList.appendChild(itemElem);

    totalItems += quantity;
    totalPrice += item.price * quantity;
  });

  // Add cart footer only once (after loop)
  const cartFooter = document.createElement("div");
  cartFooter.className = "cart-footer";
  cartFooter.innerHTML = `
    <div class="cart-total">
      <span>Order Total:</span>
      <strong id="cartSubtotal">$ ${totalPrice.toFixed(2)}</strong>
    </div>
    <div class='carbon-neutral'>
    <img src='./images/icon-carbon-neutral.svg' alt='404'/>
    <p>This is a <span>carbon-neutral</span> delivery</p>
    </div>
    <button id="confirmOrderBtn" class="confirm-btn">Confirm Order</button>
  `;
  cartList.appendChild(cartFooter);

  const confirmBtn = document.getElementById("confirmOrderBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const modal = document.getElementById("orderModal");
      const summaryContainer = document.getElementById("modalCartSummary");
      const totalDisplay = document.getElementById("modalTotal");

      // Clear previous content
      summaryContainer.innerHTML = "";

      let total = 0;

      Object.entries(cartState).forEach(([id, quantity]) => {
        const item = productData[id];
        const itemTotal = item.price * quantity;
        total += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "modal-item";
        itemDiv.innerHTML = `
        <span>${item.name} (${quantity}x)</span>
        <span>$${itemTotal.toFixed(2)}</span>
      `;
        summaryContainer.appendChild(itemDiv);
      });

      totalDisplay.textContent = total.toFixed(2);

      // Show the modal
      modal.style.display = "block";

      // Reset handler
      const newOrderBtn = document.getElementById("startNewOrderBtn");
      newOrderBtn.onclick = () => {
        cartState = {};
        updateCartUI();
        resetAllProductCards();
        modal.style.display = "none";
      };
    });
  }
}

function resetAllProductCards() {
  document.querySelectorAll(".card").forEach((card, index) => {
    const addBtn = card.querySelector(".cart-btn");
    const counterBox = card.querySelector(".counter-box");
    const counterDisplay = card.querySelector(".counter");

    if (addBtn && counterBox && counterDisplay) {
      addBtn.style.display = "flex";
      counterBox.style.display = "none";
      counterDisplay.textContent = "1";
    }
  });
}

// Init
window.addEventListener("click", (e) => {
  const modal = document.getElementById("orderModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
window.addEventListener("DOMContentLoaded", getJSONData);
