const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();

const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await manager.getProducts();
    const productIndex = products.findIndex(product => product._id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    products.splice(productIndex, 1);
    await manager.saveProducts(products);

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto", message: error.message });
  }
});

module.exports = router;


