import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

router.post('/', async (req, res) => {
  const product = req.body;
  const newProduct = await productManager.addProduct(product);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updates = req.body;
  const updatedProduct = await productManager.updateProduct(Number(req.params.pid), updates);
  updatedProduct ? res.json(updatedProduct) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', async (req, res) => {
  const deletedProduct = await productManager.deleteProduct(Number(req.params.pid));
  deletedProduct ? res.sendStatus(204) : res.status(404).send('Producto no encontrado');
});

export default router;