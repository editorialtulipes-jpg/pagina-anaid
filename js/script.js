window.addEventListener('DOMContentLoaded', () => {

  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }

    });

  }, {
    threshold: 0.15
  });

  elements.forEach((el) => {
    observer.observe(el);
  });

});


const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartContent = document.querySelector('.cart-content');
const addCartButtons = document.querySelectorAll('.add-cart');

let isUpdating = false;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

if (cartButton && cartPanel && closeCart) {

  cartButton.addEventListener('click', () => {
    cartPanel.classList.add('active');
  });

  closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('active');
  });

}


addCartButtons.forEach(button => {

  button.addEventListener('click', () => {

    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const id = button.dataset.id || `${name}-${price}`;

    const existingItem = cart.find(item => item.id === id);

if (existingItem) {

  existingItem.quantity += 1;

} else {

  cart.push({
    id,
    name,
    price,
    quantity: 1
  });

}

updateCart();

  });

});


function updateCart() {

  if (isUpdating) return;
  isUpdating = true;

  if (!cartContent) return;

  if (cart.length === 0) {

    cartContent.innerHTML = `
      <p>
        Tu carrito está vacío.
      </p>
    `;

    cartButton.textContent = 'Carrito (0)';
    localStorage.setItem('cart', JSON.stringify(cart));

    isUpdating = false;
    return;
  }

  let total = 0;

  cartContent.innerHTML = '';

  cart.forEach(item => {

    total += item.price * item.quantity;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <div class="cart-item-wrapper">

        <div class="cart-item-info">
          <h3>${item.name} : ${item.quantity}</h3>
          <p>$${item.price * item.quantity} MXN</p>
        </div>

        <div class="cart-controls">
          <button class="qty-minus">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-plus">+</button>
          <button class="remove-item">×</button>
        </div>

      </div>
    `;

    const plusBtn = cartItem.querySelector('.qty-plus');
    const minusBtn = cartItem.querySelector('.qty-minus');
    const removeBtn = cartItem.querySelector('.remove-item');

    plusBtn.addEventListener('click', () => {
      item.quantity += 1;
      updateCart();
    });

    minusBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        const index = cart.indexOf(item);
        if (index > -1) cart.splice(index, 1);
      }
      updateCart();
    });

    removeBtn.addEventListener('click', () => {
      const index = cart.indexOf(item);
      if (index > -1) cart.splice(index, 1);
      updateCart();
    });

    cartContent.appendChild(cartItem);
  });

  const totalElement = document.createElement('div');
  totalElement.classList.add('cart-total');

  totalElement.innerHTML = `
    <h3>Total</h3>
    <p>$${total} MXN</p>
  `;

  cartContent.appendChild(totalElement);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartButton.textContent = `Carrito (${totalItems})`;

  localStorage.setItem('cart', JSON.stringify(cart));

  isUpdating = false;
}

updateCart();