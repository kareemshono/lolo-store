const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { getSingleProduct, getFilteredProducts, getTotalProducts, getColors, getOrCreateCart, getCartItems, addToCart, updateCartItem, removeFromCart, mergeCarts } = require('../../db/queries');

// Middleware to verify JWT from cookie
const authenticateCookie = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.error('authenticateCookie: No token provided');
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        console.log('authenticateCookie: Token verified, user:', decoded.id);
        next();
    } catch (err) {
        console.error('authenticateCookie: JWT verification error:', {
            message: err.message,
            stack: err.stack,
        });
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get unique colors
router.get('/colors', async (req, res) => {
    try {
        console.log('Handling GET /api/products/colors');
        const colors = await getColors();
        console.log('Returning colors:', colors);
        res.status(200).json(colors);
    } catch (err) {
        console.error('Error fetching colors:', { message: err.message, stack: err.stack });
        res.status(500).json({ error: 'Failed to fetch colors: ' + err.message });
    }
});
// Get cart for authenticated user
router.get('/cart', authenticateCookie, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Handling GET /api/products/cart for user:', userId);
        if (!Number.isInteger(userId) || userId <= 0) {
            console.error('Invalid user ID:', userId);
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const cart = await getOrCreateCart(userId);
        console.log('Cart retrieved:', cart);
        const items = await getCartItems(cart.id);
        console.log('Cart items retrieved:', items);
        res.status(200).json({ cart, items });
    } catch (err) {
        console.error('Error fetching cart:', {
            message: err.message,
            stack: err.stack,
            userId: req.user?.id,
        });
        if (err.message.includes('Invalid')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to fetch cart: ' + err.message });
    }
});
// Add item to cart
router.post(
    '/cart/items',
    [
        body('productId').isInt().withMessage('Invalid product ID'),
        body('variantId').isInt().withMessage('Variant ID is required and must be an integer'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    authenticateCookie,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error('Validation errors in POST /api/products/cart/items:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            const { productId, variantId, quantity } = req.body;
            const userId = req.user.id;
            console.log('Adding to cart:', { userId, productId, variantId, quantity });

            const cart = await getOrCreateCart(userId);
            const cartId = cart.id;

            const item = await addToCart({ cartId, productId, variantId, quantity });
            if (!item) {
                return res.status(500).json({ error: 'Failed to add item to cart' });
            }

            // Fetch updated cart items to ensure consistency
            const updatedItems = await getCartItems(cartId);
            res.status(201).json({ item, cart, items: updatedItems });
        } catch (err) {
            console.error('Error adding to cart:', {
                message: err.message,
                stack: err.stack,
                productId: req.body.productId,
                variantId: req.body.variantId,
                quantity: req.body.quantity,
                userId: req.user.id,
            });
            res.status(500).json({ error: 'Failed to add to cart: ' + err.message });
        }
    }
);

// Update cart item quantity
router.put(
    '/cart/items/:itemId',
    [
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    authenticateCookie,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error('Validation errors in PUT /api/products/cart/items:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            const { itemId } = req.params;
            const { quantity } = req.body;
            const item = await updateCartItem({ cartItemId: itemId, quantity });
            if (!item) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.status(200).json(item);
        } catch (err) {
            console.error('Error updating cart item:', { message: err.message, stack: err.stack, itemId: req.params.itemId });
            res.status(500).json({ error: 'Failed to update cart item: ' + err.message });
        }
    }
);

// Remove item from cart
router.delete('/cart/items/:itemId', authenticateCookie, async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await removeFromCart(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Item removed' });
    } catch (err) {
        console.error('Error removing cart item:', { message: err.message, stack: err.stack, itemId: req.params.itemId });
        res.status(500).json({ error: 'Failed to remove cart item: ' + err.message });
    }
});

// Merge guest cart on sign-in
router.post('/cart/merge', authenticateCookie, async (req, res) => {
    try {
        const userId = req.user.id;
        const { guestCartItems } = req.body;
        console.log('Merging guest cart for user:', userId, guestCartItems);
        const cart = await mergeCarts({ userId, guestCartItems });
        const items = await getCartItems(cart.id);
        console.log('Merged cart:', { cart, items });
        res.status(200).json({ cart, items });
    } catch (err) {
        console.error('Error merging cart:', { message: err.message, stack: err.stack, userId: req.user.id });
        res.status(500).json({ error: 'Failed to merge cart: ' + err.message });
    }
});
// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId) || productId <= 0) {
            console.error('Invalid product ID:', req.params.id);
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        console.log('Fetching product with ID:', productId);
        const product = await getSingleProduct(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', { message: err.message, stack: err.stack, id: req.params.id });
        res.status(500).json({ error: 'Failed to fetch product: ' + err.message });
    }
});

// Get filtered products with pagination
router.get('/', async (req, res) => {
    try {
        const { categories, sizes, colors, sort, page = 0, limit = 20 } = req.query;
        const categoriesArray = categories ? (Array.isArray(categories) ? categories : categories.split(',')) : [];
        const sizesArray = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [];
        const colorsArray = colors ? (Array.isArray(colors) ? colors : colors.split(',')) : [];

        console.log('Fetching products with params:', { categoriesArray, sizesArray, colorsArray, sort, page, limit });

        const products = await getFilteredProducts({
            categories: categoriesArray,
            sizes: sizesArray,
            colors: colorsArray,
            sort,
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const total = await getTotalProducts({
            categories: categoriesArray,
            sizes: sizesArray,
            colors: colorsArray,
        });

        res.status(200).json({ products, total });
    } catch (err) {
        console.error('Error fetching products:', { message: err.message, stack: err.stack });
        res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
    }
});





module.exports = router;