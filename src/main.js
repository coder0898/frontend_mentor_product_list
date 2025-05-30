import "./style.css";

// DOM Elements
const listDisplay = document.getElementById("listDisplay");

// Global State
let productData = [];
let cartCounter = 0;

// Fetch JSON data
async function getJSONData() {
  try {
    const res = await fetch("src/data.json");
    if (!res.ok) throw new Error("Failed to fetch data");
    productData = await res.json();
    displayProducts();
  } catch (error) {
    console.error(error);
    listDisplay.innerHTML = "<p>Error loading products.</p>";
  }
}

// Create card DOM element
function createCard({ image, name, category, price }) {
  const card = document.createElement("div");
  card.className = "card";

  // Image
  const img = document.createElement("img");
  img.src = image.desktop;
  img.alt = name;
  card.appendChild(img);

  // Button group
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  const addButton = document.createElement("button");
  addButton.className = "cart-btn";
  addButton.id = "addCart";

  const cartIcon = document.createElement("img");
  cartIcon.src = "./images/icon-add-to-cart.svg";
  cartIcon.alt = "Add to cart";

  const addText = document.createElement("span");
  addText.textContent = "Add to cart";

  addButton.append(cartIcon, addText);

  const counterBox = document.createElement("div");
  counterBox.className = "counter-box";

  const decrementBtn = document.createElement("button");
  decrementBtn.id = "decrementCart";
  decrementBtn.textContent = "-";

  const counterCount = document.createElement("span");
  counterCount.id = "counterCount";
  counterCount.textContent = cartCounter;

  const incrementBtn = document.createElement("button");
  incrementBtn.id = "incrementCart";
  incrementBtn.innerHTML = "+";

  counterBox.append(decrementBtn, counterCount, incrementBtn);
  buttonGroup.append(addButton, counterBox);

  // Content section
  const content = document.createElement("div");
  content.className = "content";

  const categoryTag = document.createElement("span");
  categoryTag.textContent = category;

  const title = document.createElement("h4");
  title.textContent = name;

  const priceTag = document.createElement("p");
  priceTag.textContent = `$ ${price}`;

  content.append(categoryTag, title, priceTag);

  // Assemble card
  card.append(buttonGroup, content);
  return card;
}

// Render product list
function displayProducts() {
  listDisplay.innerHTML = "";

  if (!Array.isArray(productData) || productData.length === 0) {
    listDisplay.innerHTML = "<p>No products to display.</p>";
    return;
  }

  productData.forEach((product) => {
    const card = createCard(product);
    listDisplay.appendChild(card);
  });
}

// Load data on page load
window.addEventListener("DOMContentLoaded", getJSONData);
