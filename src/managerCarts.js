import fs from 'fs/promises';

export class ManagerCart {
    constructor() {
        this.path = 'src/cart.json';
    }

    async createCart() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);

            let lastCart = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);

            const newCart = {
                id: lastCart + 1,
                products: [],
            };

            await this.saveCart(newCart);

            return newCart;
        } catch (error) {
            throw error;
        }
    }


    async getCart(cartId) {
        try {
            const cart = await this.loadCart(cartId);
            if (cart) {
                return cart;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.loadCart(cartId);

            if (!cart) {
                return null;
            }

            const existingProduct = cart.products.find((product) => product.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }
            await this.saveCart(cart);

            return cart;
        } catch (error) {
            throw error;
        }
    }


    async loadCart(cartId) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts.find((cart) => cart.id === cartId);
        } catch (error) {
            console.log("Error: ", error);
            return null;
        }
    }

    async saveCart(cart) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            const existingCartIndex = carts.findIndex((c) => c.id === cart.id);

            if (existingCartIndex !== -1) {
                carts[existingCartIndex] = cart;
            } else {
                carts.push(cart);
            }
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            throw error;
        }
    }
}

