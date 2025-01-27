import { Router } from 'express';
import fs from 'fs/promises';

const cartsRouter = Router();
const filePath = './src/data/carrito.json';

// Ruta POST /
cartsRouter.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const carts = JSON.parse(data);

    const newCart = {
      id: (carts.length + 1).toString(),
      products: []
    };

    carts.push(newCart);
    await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});

// Ruta GET /:cid
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const data = await fs.readFile(filePath, 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado.' });
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el carrito.' });
  }
});

// Ruta POST /:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const data = await fs.readFile(filePath, 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado.' });

    const product = cart.products.find(p => p.product === pid);

    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
  }
});

export default cartsRouter;
