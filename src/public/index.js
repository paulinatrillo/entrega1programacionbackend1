const socket = io();

socket.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = "";
  products.forEach(product => {
    const newItem = document.createElement('li');
    newItem.textContent = `${product.title} - $${product.price}`;
    productList.appendChild(newItem);
  });
});

document.getElementById('newProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  socket.emit('newProduct', { title, price });
  e.target.reset();
});
