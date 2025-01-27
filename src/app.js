import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
