const express = require('express');
const app = express();

const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});