import fs from 'fs/promises';
import path from 'path';

const productsPath = path.resolve('./data/products.json');

class ProductManager {
  async getProducts() {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: this.#generateId(products), ...product };
    products.push(newProduct);
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id }; 
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length === products.length) return null;

    await fs.writeFile(productsPath, JSON.stringify(filteredProducts, null, 2));
    return id;
  }

  #generateId(products) {
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  }
}

export default ProductManager;