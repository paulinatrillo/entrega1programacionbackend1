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

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    socket.emit('newProduct', { title, price });
    e.target.reset();
});
