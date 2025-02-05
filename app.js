const express = require('express');
const productsRouter = require('./src/routes/products.routes');
const cartsRouter = require('./src/routes/carts.routes');

const app = express();

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
