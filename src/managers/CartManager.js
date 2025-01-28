import path from 'path';

const cartsPath = path.resolve('./data/carts.json');

class CartManager {
  async getCarts() {
    const data = await fs.readFile(cartsPath, 'utf-8');
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: this.#generateId(carts), products: [] };
    carts.push(newCart);
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    return cart;
  }

  #generateId(carts) {
    return carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
  }
}

export default CartManager;