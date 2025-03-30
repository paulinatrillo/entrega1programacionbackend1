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

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await manager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).send('Carrito o producto no encontrado');
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).send('Error al eliminar el producto del carrito');
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;
    const updatedCart = await manager.updateCart(cid, products);
    if (!updatedCart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).send('Error al actualizar el carrito');
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    const updatedCart = await manager.updateProductQuantity(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(404).send('Carrito o producto no encontrado');
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).send('Error al actualizar la cantidad del producto en el carrito');
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await manager.deleteCart(cid);
    if (!deletedCart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.status(200).json(deletedCart);
  } catch (error) {
    res.status(500).send('Error al eliminar el carrito');
  }
});

module.exports = router;
