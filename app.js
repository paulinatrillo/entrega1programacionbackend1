const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const Product = require('./models/product');

const app = express();
const httpServer = app.listen(3000, () => {
  console.log(`Servidor escuchando en http://localhost:3000`);
});
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', function(socket) {
  socket.on('newProduct', async function(productData) {
    const product = new Product(productData);
    await product.save();
    const products = await Product.find();
    io.emit('updateProducts', products);
  });
});
