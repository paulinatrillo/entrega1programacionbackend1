const fs = require('fs').promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      const arrayProductos = await this.leerArchivo();

      if (!title || !description || !price || !img || !code || !stock || !category) {
        return;
      }

      if (arrayProductos.some(item => item.code === code)) {
        return;
      }

      const nuevoProducto = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      nuevoProducto.id = ++ProductManager.ultId;
      arrayProductos.push(nuevoProducto);

      await this.guardarArchivo(arrayProductos);
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    const arrayProductos = await this.leerArchivo();
    return arrayProductos;
  }

  async getProductById(id) {
    const arrayProductos = await this.leerArchivo();
    const producto = arrayProductos.find(item => item.id === id);

    if (!producto) {
      return 'Producto no encontrado';
    } else {
      return producto;
    }
  }

  async leerArchivo() {
    const respuesta = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(respuesta);
  }

  async guardarArchivo(arrayProductos) {
    await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
  }
}

module.exports = ProductManager;