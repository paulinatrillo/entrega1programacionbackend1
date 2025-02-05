const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al leer los productos');
    }
  }
}

module.exports = ProductManager;

