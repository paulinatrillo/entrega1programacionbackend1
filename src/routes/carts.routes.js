const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send('Error al crear el carrito');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al agregar producto al carrito');
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    
    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al eliminar el producto del carrito');
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al actualizar el carrito');
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
    if (productIndex === -1) return res.status(404).send('Producto no encontrado en el carrito');
    
    cart.products[productIndex].quantity = req.body.quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al actualizar la cantidad del producto en el carrito');
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json({ message: 'Carrito eliminado' });
  } catch (error) {
    res.status(500).send('Error al eliminar el carrito');
  }
});

module.exports = router;
