import { Router } from 'express';
import fs from 'fs/promises';

const productsRouter = Router();
const filePath = './src/data/productos.json';

// Ruta GET /
productsRouter.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: 'Error al leer productos.' });
  }
});

// Ruta GET /:pid
productsRouter.get('/:pid', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer productos.' });
  }
});

// Ruta POST /
productsRouter.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);

    const newProduct = {
      id: (products.length + 1).toString(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto.' });
  }
});

// Ruta PUT /:pid
productsRouter.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;

    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado.' });

    const updatedProduct = { ...products[productIndex], ...updates, id: pid };
    products[productIndex] = updatedProduct;

    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

// Ruta DELETE /:pid
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const updatedProducts = products.filter(p => p.id !== pid);

    if (products.length === updatedProducts.length) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedProducts, null, 2));
    res.json({ message: 'Producto eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

export default productsRouter;
