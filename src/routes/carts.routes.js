const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const manager = new CartManager('./data/carts.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send('Error al crear el carrito');
  }
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(Number(req.params.cid));
  if (!cart) {
    res.status(404).send('Carrito no encontrado');
  } else {
    res.json(cart);
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await manager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
  if (!updatedCart) {
    res.status(404).send('Carrito o producto no encontrado');
  } else {
    res.json(updatedCart);
  }
});

module.exports = router;
