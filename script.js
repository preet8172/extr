document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------
  // SWIPER
  // -------------------------------
  new Swiper(".mySwiper", {
    loop: true,
    navigation: { nextEl: "#next", prevEl: "#prev" },
  });



  // -------------------------------
  // CART TOGGLE
  // -------------------------------
  const cartIcon = document.querySelector('.cart-icon');
  const cartTab = document.querySelector('.cart-tab');
  const closebtn = document.querySelector('.close-btn');

  cartIcon.addEventListener('click', () => {
    cartTab.classList.add('cart-tab-active');
  });

  closebtn.addEventListener('click', () => {
    cartTab.classList.remove('cart-tab-active');
  });

  // -------------------------------
  // MENU CARDS
  // -------------------------------
  const cardList = document.querySelector('.card-list'); // select menu container
  let productlist = [];

  const showcards = () => {
    cardList.innerHTML = ''; // clear previous cards
    productlist.forEach(product => {
      const ordercard = document.createElement('div');
      ordercard.classList.add('order-card');

      ordercard.innerHTML = `
        <div class="card-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn add-to-cart">Add to Cart</a>
      `;

      cardList.appendChild(ordercard);
    });
  };

  const initApp = () => {
    fetch('products.json')
      .then(response => response.json())
      .then(data => {
        productlist = data;
        showcards();
      })
      .catch(err => console.error("Error loading products:", err));
  };

  initApp();

  // -------------------------------
  // CART FUNCTIONALITY
  // -------------------------------
  const cartList = document.querySelector('.cart-list');
  const cartTotal = document.querySelector('.cart-total');
  const cartValue = document.querySelector('.cart-value');

  let cart = {};

  function parsePrice(priceText) {
    return parseFloat(priceText.replace(/[^\d.]/g, ''));
  }

  function updateCart() {
    cartList.innerHTML = '';
    let total = 0;

    for (let key in cart) {
      const item = cart[key];
      total += item.price * item.quantity;

      const cartItem = document.createElement('div');
      cartItem.classList.add('item');
      cartItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div>
          <h4>${item.name}</h4>
          <h4 class="item-total">₹${(item.price * item.quantity).toFixed(2)}</h4>
        </div>
        <a href="#" class="quantity-btn minus" data-name="${item.name}">
          <i class="fa-solid fa-minus"></i>
        </a>
        <h4 class="quantity-value">${item.quantity}</h4>
        <a href="#" class="quantity-btn plus" data-name="${item.name}">
          <i class="fa-solid fa-plus"></i>
        </a>
      `;
      cartList.appendChild(cartItem);
    }

    cartTotal.textContent = `₹${total.toFixed(2)}`;
    cartValue.textContent = Object.keys(cart).length;
  }

  // Add to cart click
  cardList.addEventListener('click', e => {
    if (e.target.closest('.add-to-cart')) {
      e.preventDefault();
      const card = e.target.closest('.order-card');
      const name = card.querySelector('h4').textContent;
      const priceText = card.querySelector('.price').textContent;
      const price = parsePrice(priceText);
      const image = card.querySelector('img').src;

      if (cart[name]) {
        cart[name].quantity += 1;
      } else {
        cart[name] = { name, price, image, quantity: 1 };
      }

      updateCart();
      cartTab.classList.add('cart-tab-active'); // Open cart immediately
    }
  });

  // Handle quantity buttons
  cartList.addEventListener('click', e => {
    if (e.target.closest('.quantity-btn')) {
      e.preventDefault();
      const btn = e.target.closest('.quantity-btn');
      const name = btn.dataset.name;

      if (btn.classList.contains('plus')) {
        cart[name].quantity += 1;
      } else if (btn.classList.contains('minus')) {
        cart[name].quantity -= 1;
        if (cart[name].quantity <= 0) delete cart[name];
      }

      updateCart();
    }
  });

  // -------------------------------
  // NAV MENU CLICK HANDLER
  // -------------------------------
  const navLinks = document.querySelectorAll('.navlist a');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.textContent.trim();
      console.log('You clicked on:', page);
      // You can navigate dynamically if needed:
      // window.location.href = page.toLowerCase().replace(/\s+/g, '-') + '.html';
    });
  });
  const links = document.querySelectorAll('.navlist a');

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});