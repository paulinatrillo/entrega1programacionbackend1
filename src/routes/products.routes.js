const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await manager.getProducts();
    if (limit) {
      res.send(products.slice(0, limit));
    } else {
      res.send(products);
    }
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(parseInt(req.params.pid));
  if (product === 'Producto no encontrado') {
    res.status(404).send(product);
  } else {
    res.json(product);
  }
});

router.post('/', async (req, res) => {
  const nuevoProducto = req.body;
  try {
    await manager.addProduct(nuevoProducto);
    res.status(201).send({ message: 'Producto agregado exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error al agregar producto' });
  }
});

module.exports = router;