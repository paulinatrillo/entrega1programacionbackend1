const fs = require('fs').promises;

class CartManager {
  static ultId = 0;

  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async createCart() {
    try {
      const arrayCarts = await this.leerArchivo();

      const newCart = {
        id: ++CartManager.ultId,
        products: [],
      };

      arrayCarts.push(newCart);
      await this.guardarArchivo(arrayCarts);
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id) {
    const arrayCarts = await this.leerArchivo();
    return arrayCarts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const arrayCarts = await this.leerArchivo();
    const cart = arrayCarts.find(cart => cart.id === cartId);

    if (!cart) {
      return null;
    }

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.guardarArchivo(arrayCarts);
    return cart;
  }

  async leerArchivo() {
    const respuesta = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(respuesta);
  }

  async guardarArchivo(arrayCarts) {
    await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
  }
}

module.exports = CartManager;
