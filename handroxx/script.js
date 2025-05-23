// Persistent Cart Data with localStorage
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Add product to cart
function addToCart(button) {
  const productDiv = button.closest('.product');
  const productName = productDiv.getAttribute('data-name');
  const price = Number(productDiv.getAttribute('data-price'));

  // Prevent adding if already in cart
  if (cartItems.some(item => item.name === productName)) {
    alert('Item already in cart!');
    return;
  }

  // Add new item with quantity 1
  cartItems.push({ name: productName, price, quantity: 1 });

  // Disable button and style it
  button.disabled = true;
  button.textContent = 'Added ✓';
  button.style.backgroundColor = '#4CAF50';
  button.classList.add('added');

  // Animate button scale effect
  button.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
  ], { duration: 300, easing: 'ease-in-out' });

  // Save cart and update UI
  saveCart();
  updateCart();
  showCheckoutSection();
}

// Update Cart UI with quantity controls
function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';

  if (cartItems.length === 0) {
    cartDiv.textContent = 'Your cart is empty.';
    resetAddButtons();
    hideCheckoutSection();
  } else {
    const ul = document.createElement('ul');
    ul.id = 'cart-items';

    cartItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.style.opacity = 0;
      li.style.animation = 'fadeInUp 0.5s ease forwards';

      const itemText = document.createElement('span');
      itemText.textContent = `${item.name} - ₹${item.price} x `;

      // Quantity controls container
      const qtyControls = document.createElement('span');
      qtyControls.classList.add('qty-controls');

      // Minus button
      const minusBtn = document.createElement('button');
      minusBtn.textContent = '−';
      minusBtn.title = 'Decrease quantity';
      minusBtn.onclick = () => changeQuantity(idx, -1);

      // Quantity number display
      const qtySpan = document.createElement('span');
      qtySpan.textContent = item.quantity;
      qtySpan.classList.add('quantity');

      // Plus button
      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.title = 'Increase quantity';
      plusBtn.onclick = () => changeQuantity(idx, 1);

      qtyControls.append(minusBtn, qtySpan, plusBtn);

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('remove-btn');
      removeBtn.title = 'Remove item';
      removeBtn.onclick = () => removeItem(idx);

      li.append(itemText, qtyControls, removeBtn);
      ul.appendChild(li);

      setTimeout(() => {
        li.style.opacity = 1;
      }, 10);
    });

    cartDiv.appendChild(ul);
  }

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('total').textContent = total;

  updateUPILink(total);
}

// Change quantity of an item in the cart
function changeQuantity(index, delta) {
  cartItems[index].quantity += delta;

  // Remove item if quantity less than 1
  if (cartItems[index].quantity < 1) {
    cartItems.splice(index, 1);
  }

  saveCart();
  updateCart();
}

// Remove item from cart
function removeItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  updateCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Show checkout section once cart has items
function showCheckoutSection() {
  const checkoutSection = document.getElementById('checkout');
  if (checkoutSection) {
    checkoutSection.style.display = 'block';
    checkoutSection.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 400, easing: 'ease-out' });
  }
}

// Hide checkout section when cart is empty
function hideCheckoutSection() {
  const checkoutSection = document.getElementById('checkout');
  if (checkoutSection) {
    checkoutSection.style.display = 'none';
  }
}

// Reset all Add to Cart buttons to enabled state
function resetAddButtons() {
  const buttons = document.querySelectorAll('.product button');
  buttons.forEach(button => {
    button.disabled = false;
    button.textContent = 'Add to Cart';
    button.style.backgroundColor = '#b22222'; // original red
    button.classList.remove('added');
  });
}

// Update UPI payment link dynamically
function updateUPILink(amount) {
  const upiId = 'jadhavs01@ptyes'; // fixed UPI ID

  const upiUrl = `upi://pay?pa=${upiId}&pn=Handroxx&am=${amount}&cu=INR`;

  let upiLink = document.getElementById('upi-link');
  if (!upiLink) {
    upiLink = document.createElement('a');
    upiLink.id = 'upi-link';
    upiLink.target = '_blank';
    upiLink.style.display = 'inline-block';
    upiLink.style.marginTop = '10px';
    upiLink.style.color = '#ffd700';
    upiLink.style.fontWeight = 'bold';
    document.getElementById('checkout').appendChild(upiLink);
  }

  if (amount > 0) {
    upiLink.href = upiUrl;
    upiLink.textContent = `Pay ₹${amount} via UPI`;
  } else {
    upiLink.textContent = '';
    upiLink.removeAttribute('href');
  }
}

// Load cart on page load
window.onload = () => {
  updateCart();

  // Disable add buttons for items already in cart
  const buttons = document.querySelectorAll('.product button');
  buttons.forEach(button => {
    const productDiv = button.closest('.product');
    const productName = productDiv.getAttribute('data-name');
    if (cartItems.some(item => item.name === productName)) {
      button.disabled = true;
      button.textContent = 'Added ✓';
      button.style.backgroundColor = '#4CAF50';
      button.classList.add('added');
    }
  });

  // Show checkout section if cart has items
  if (cartItems.length > 0) showCheckoutSection();
};
function generateBill() {
  const cart = document.querySelectorAll('.cart-item');
  let billWindow = window.open('', '', 'width=600,height=700');
  let billHTML = `
    <html>
      <head>
        <title>Handroxx Jewelry Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          hr { margin: 20px 0; }
          .item { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>Handroxx Jewelry Invoice</h2>
        <hr>
  `;

  let total = 0;
  cart.forEach(item => {
    const name = item.querySelector('.item-name').textContent;
    const quantity = item.querySelector('.quantity').textContent;
    const price = item.querySelector('.item-price').textContent;

    total += parseInt(price.replace('₹', ''));

    billHTML += `
      <div class="item">
        <strong>${name}</strong><br>
        Quantity: ${quantity}<br>
        Price: ${price}
      </div>
    `;
  });

  billHTML += `
      <hr>
      <h3>Total: ₹${total}</h3>
      <p>UPI ID: jadhavs01@ptyes</p>
      <p>Thank you for shopping with Handroxx!</p>
      </body></html>
  `;

  billWindow.document.write(billHTML);
  billWindow.document.close();
  billWindow.print(); // Opens print/download dialog
}
console.log("JS loaded");
