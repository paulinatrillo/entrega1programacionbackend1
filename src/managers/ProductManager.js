const mongoose = require('mongoose');
const Product = require('../models/product');

class ProductManager {
  constructor() {}

  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }
}

module.exports = ProductManager;




