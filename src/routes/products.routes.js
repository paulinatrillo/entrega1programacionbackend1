const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = '', query = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    let filter = {};
    if (query) {
      filter = { $or: [{ category: { $regex: query, $options: 'i' } }, { stock: { $regex: query, $options: 'i' } }] };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOption);

    const total = await Product.countDocuments(filter);

    const totalPages = Math.ceil(total / parseInt(limit));
    const prevPage = page > 1 ? parseInt(page) - 1 : null;
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: parseInt(page),
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}` : null,
      nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}` : null,
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




