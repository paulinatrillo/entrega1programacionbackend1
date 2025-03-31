const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
    const query = req.query.query ? { category: req.query.query } : {};

    const options = {
      page,
      limit,
      sort: sort ? { price: sort } : {},
    };

    const result = await Product.paginate(query, options);

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `?page=${result.prevPage}&limit=${limit}&sort=${req.query.sort}&query=${req.query.query}` : null,
      nextLink: result.hasNextPage ? `?page=${result.nextPage}&limit=${limit}&sort=${req.query.sort}&query=${req.query.query}` : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
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

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    if (updateData.id) {
      return res.status(400).json({ message: "No se puede modificar el ID del producto" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
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


