import express from 'express';
import { uploader } from '../utils.js';
import { ProductManager } from '../Manager.js';
const productsRouter = express.Router();
const manager = new ProductManager();

productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;

    const products = await manager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  let productId = parseInt(req.params.pid, 10);

  try {
    const product = await manager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

productsRouter.post('/', uploader.array('thumbnails', 5), async (req, res) => {
  try {
      const newProduct = { ...req.body };

      
      if (req.files) {
          newProduct.thumbnails = req.files.map(file => file.filename);
      }

      const addedProduct = await manager.addProduct(newProduct);

      if (addedProduct) {
          res.status(201).json(addedProduct);
      } else {
          res.status(400).json({ error: 'No se pudo agregar el producto' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

productsRouter.put('/:id', uploader.array('thumbnails', 5), async (req, res) => {
  try {
      const productId = parseInt(req.params.id, 10);


      const existingProduct = await manager.getProductById(productId);

      if (!existingProduct || existingProduct.error) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

     
      const updatedProductData = req.body;

    
      updatedProductData.id = productId;


      const updatedProduct = await manager.updateProduct(productId, updatedProductData);

      if (updatedProduct) {
          res.json(updatedProduct);
      } else {
          res.status(400).json({ error: 'No se pudo actualizar el producto' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);

  try {
    const deletedProduct = await manager.deleteProduct(productId);

    if (deletedProduct) {
      res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});



export { productsRouter };