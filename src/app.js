import express from 'express';
import { cartsRouter } from './routes/carts.router.js';
import { productsRouter } from './routes/products.router.js';



const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const port = 8080; 

app.use(express.static('src/public'));

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);



app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});