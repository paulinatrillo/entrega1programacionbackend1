const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();

const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

module.exports = router;

