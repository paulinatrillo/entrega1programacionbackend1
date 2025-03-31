const mongoose = require('mongoose');
const Cart = require('../models/cart');

class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    
    const existingProduct = cart.products.find(p => p.product.equals(productId));
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  }
}

module.exports = CartManager;
