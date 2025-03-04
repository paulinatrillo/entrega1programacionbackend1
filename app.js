const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const productsRouter = require('./src/routes/products.routes');
const cartsRouter = require('./src/routes/carts.routes');

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

let products = [];

app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', function(socket) {
  socket.emit('updateProducts', products);
  socket.on('newProduct', function(product) {
    products.push(product);
    io.emit('updateProducts', products);
  });
});
