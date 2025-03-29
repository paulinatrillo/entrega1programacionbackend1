const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, code, price, stock, category, thumbnails } = req.body;

    if (!name || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = new Product({
      name,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || []
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto", message: error.message });
  }
});

module.exports = router;




