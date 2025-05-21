const db = require('./index');

// Add a new user
async function addUser({ name, email, hashedPassword, phone, role, is_admin, created_at }) {
    try {
        const query = `
            INSERT INTO site_user (name, email, password, phone, role, is_admin, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, email, role;
        `;
        const values = [name, email, hashedPassword, phone, role || 'user', is_admin, created_at];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Add user error:', err.message);
        throw new Error('Failed to add user: ' + err.message);
    }
}

// Get a user by email
async function getUserByEmail(email) {
    try {
        const query = `SELECT * FROM site_user WHERE email = $1`;
        const result = await db.query(query, [email]);
        return result.rows[0];
    } catch (err) {
        console.error('Get user by email error:', err.message);
        throw new Error('Failed to get user by email: ' + err.message);
    }
}

// Get a user by ID
async function getUserById(userId) {
    try {
        const query = `SELECT id, name, email, role FROM site_user WHERE id = $1`;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (err) {
        console.error('Get user by ID error:', err.message);
        throw new Error('Failed to get user by ID: ' + err.message);
    }
}

// Get all users
async function getAllUsers() {
    try {
        const query = 'SELECT id, name, email, role FROM site_user;';
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Get all users error:', err.message);
        throw new Error('Failed to get all users: ' + err.message);
    }
}

// Update a user by ID
async function updateUser(userId, { name, email, phone }) {
    try {
        const query = `
            UPDATE site_user
            SET name = $1, email = $2, phone = $3
            WHERE id = $4
            RETURNING id, name, email, role;
        `;
        const values = [name, email, phone, userId];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Update user error:', err.message);
        throw new Error('Failed to update user: ' + err.message);
    }
}

// Delete a user by ID
async function deleteUser(userId) {
    try {
        const query = 'DELETE FROM site_user WHERE id = $1 RETURNING id, name, email, role;';
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (err) {
        console.error('Delete user error:', err.message);
        throw new Error('Failed to delete user: ' + err.message);
    }
}

// Get all products with variants and images
async function getAllProducts() {
    try {
        const query = `
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.sku AS product_sku,
                p.price,
                p.stock_quantity AS product_stock,
                p.is_active,
                c.name AS category_name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pv.id,
                            'size', pv.size,
                            'color', pv.color,
                            'material', pv.material,
                            'fit_type', pv.fit_type,
                            'stock_quantity', pv.stock_quantity
                        )
                    ) FILTER (WHERE pv.id IS NOT NULL), '[]'
                ) AS variants,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'img_url', pi.img_url,
                            'is_thumbnail', pi.is_thumbnail
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL), '[]'
                ) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.is_active = TRUE
            GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity, p.is_active, c.name
            ORDER BY p.id;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Get all products error:', err.message);
        throw new Error('Failed to get all products: ' + err.message);
    }
}

// Get single product by ID
async function getSingleProduct(productId) {
    try {
        const query = `
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.sku AS product_sku,
                p.price,
                p.stock_quantity AS product_stock,
                p.is_active,
                c.name AS category_name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pv.id,
                            'size', pv.size,
                            'color', pv.color,
                            'material', pv.material,
                            'fit_type', pv.fit_type,
                            'stock_quantity', pv.stock_quantity
                        )
                    ) FILTER (WHERE pv.id IS NOT NULL), '[]'
                ) AS variants,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'img_url', pi.img_url,
                            'is_thumbnail', pi.is_thumbnail
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL), '[]'
                ) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = $1 AND p.is_active = TRUE
            GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity, p.is_active, c.name;
        `;
        const result = await db.query(query, [productId]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Get single product error:', err.message);
        throw new Error('Failed to get single product: ' + err.message);
    }
}

// Get filtered products with pagination
async function getFilteredProducts({ categories, sizes, colors, sort, page = 0, limit = 20 }) {
    try {
        const query = `
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.sku AS product_sku,
                p.price,
                p.stock_quantity AS product_stock,
                p.is_active,
                c.name AS category_name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pv.id,
                            'size', pv.size,
                            'color', pv.color,
                            'material', pv.material,
                            'fit_type', pv.fit_type,
                            'stock_quantity', pv.stock_quantity
                        )
                    ) FILTER (WHERE pv.id IS NOT NULL), '[]'
                ) AS variants,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'img_url', pi.img_url,
                            'is_thumbnail', pi.is_thumbnail
                        )
                    ) FILTER (WHERE pi.id IS NOT NULL), '[]'
                ) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.is_active = TRUE
            ${categories && categories.length > 0 ? `AND LOWER(c.name) = ANY($1::varchar[])` : ''}
            ${sizes && sizes.length > 0 ? `
                AND (
                    LOWER(pv.size) = ANY($${categories && categories.length > 0 ? 2 : 1}::varchar[])
                    OR pv.size IN (
                        SELECT numeric_size
                        FROM (VALUES
                            ('xs', '36'),
                            ('s', '38'),
                            ('m', '40'),
                            ('l', '42')
                        ) AS size_map (letter_size, numeric_size)
                        WHERE letter_size = ANY($${categories && categories.length > 0 ? 2 : 1}::varchar[])
                    )
                )` : ''}
            ${colors && colors.length > 0 ? `AND LOWER(pv.color) = ANY($${categories && categories.length > 0 ? sizes && sizes.length > 0 ? 3 : 2 : sizes && sizes.length > 0 ? 2 : 1}::varchar[])` : ''}
            GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity, p.is_active, c.name
            ORDER BY ${sort === 'priceAsc' ? 'p.price ASC' : sort === 'priceDesc' ? 'p.price DESC' : 'p.id'}
            LIMIT $${categories && categories.length > 0 ? sizes && sizes.length > 0 ? colors && colors.length > 0 ? 4 : 3 : colors && colors.length > 0 ? 3 : 2 : sizes && sizes.length > 0 ? colors && colors.length > 0 ? 3 : 2 : colors && colors.length > 0 ? 2 : 1} OFFSET $${categories && categories.length > 0 ? sizes && sizes.length > 0 ? colors && colors.length > 0 ? 5 : 4 : colors && colors.length > 0 ? 4 : 3 : sizes && sizes.length > 0 ? colors && colors.length > 0 ? 4 : 3 : colors && colors.length > 0 ? 3 : 2};
        `;
        const values = [];
        if (categories && categories.length > 0) values.push(categories.map(cat => cat.toLowerCase()));
        if (sizes && sizes.length > 0) values.push(sizes.map(size => size.toLowerCase()));
        if (colors && colors.length > 0) values.push(colors.map(color => color.toLowerCase()));
        values.push(limit, page * limit);

        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Get filtered products error:', err.message);
        throw new Error('Failed to get filtered products: ' + err.message);
    }
}

// Get total product count for pagination
async function getTotalProducts({ categories, sizes, colors }) {
    try {
        const query = `
            SELECT COUNT(DISTINCT p.id) AS total
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            WHERE p.is_active = TRUE
            ${categories && categories.length > 0 ? `AND LOWER(c.name) = ANY($1::varchar[])` : ''}
            ${sizes && sizes.length > 0 ? `
                AND (
                    LOWER(pv.size) = ANY($${categories && categories.length > 0 ? 2 : 1}::varchar[])
                    OR pv.size IN (
                        SELECT numeric_size
                        FROM (VALUES
                            ('xs', '36'),
                            ('s', '38'),
                            ('m', '40'),
                            ('l', '42')
                        ) AS size_map (letter_size, numeric_size)
                        WHERE letter_size = ANY($${categories && categories.length > 0 ? 2 : 1}::varchar[])
                    )
                )` : ''}
            ${colors && colors.length > 0 ? `AND LOWER(pv.color) = ANY($${categories && categories.length > 0 ? sizes && sizes.length > 0 ? 3 : 2 : sizes && sizes.length > 0 ? 2 : 1}::varchar[])` : ''}
        `;
        const values = [];
        if (categories && categories.length > 0) values.push(categories.map(cat => cat.toLowerCase()));
        if (sizes && sizes.length > 0) values.push(sizes.map(size => size.toLowerCase()));
        if (colors && colors.length > 0) values.push(colors.map(color => color.toLowerCase()));

        const result = await db.query(query, values);
        return parseInt(result.rows[0].total, 10);
    } catch (err) {
        console.error('Get total products error:', err.message);
        throw new Error('Failed to get total products: ' + err.message);
    }
}

// Get unique colors from product_variants
async function getColors() {
    try {
        const query = `
            SELECT DISTINCT LOWER(color) AS color
            FROM product_variants
            WHERE color IS NOT NULL
            ORDER BY color;
        `;
        const result = await db.query(query);
        return result.rows.map(row => row.color);
    } catch (err) {
        console.error('Get colors error:', err.message);
        throw new Error('Failed to get colors: ' + err.message);
    }
}

// Get or create cart for a user
async function getOrCreateCart(userId) {
    try {
        let query = `
            SELECT id, user_id, created_at, updated_at
            FROM cart
            WHERE user_id = $1;
        `;
        let result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
            query = `
                INSERT INTO cart (user_id, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
                RETURNING id, user_id, created_at, updated_at;
            `;
            result = await db.query(query, [userId]);
        }

        return result.rows[0];
    } catch (err) {
        console.error('Get or create cart error:', err.message);
        throw new Error('Failed to get or create cart: ' + err.message);
    }
}

// Get cart items
async function getCartItems(cartId) {
    try {
        const query = `
            SELECT 
                ci.id,
                ci.cart_id,
                ci.product_id,
                ci.variant_id,
                ci.quantity,
                ci.added_at,
                p.name AS product_name,
                p.price,
                pv.size,
                pv.color,
                pi.img_url AS thumbnail
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants pv ON ci.variant_id = pv.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_thumbnail = TRUE
            WHERE ci.cart_id = $1;
        `;
        const result = await db.query(query, [cartId]);
        return result.rows;
    } catch (err) {
        console.error('Get cart items error:', err.message);
        throw new Error('Failed to get cart items: ' + err.message);
    }
}

// Add item to cart with stock locking
async function addToCart({ cartId, productId, variantId, quantity }) {
    try {
        const result = await db.query(`
            WITH stock_check AS (
                SELECT stock_quantity
                FROM product_variants
                WHERE id = $1
            ),
            stock_update AS (
                UPDATE product_variants
                SET stock_quantity = stock_quantity - $2
                WHERE id = $1
                    AND stock_quantity >= $2
                RETURNING id
            )
            INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, added_at)
            SELECT $3, $4, $1, $2, NOW()
            FROM stock_update
            ON CONFLICT (cart_id, product_id, variant_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING 
                cart_items.id,
                cart_items.cart_id,
                cart_items.product_id,
                cart_items.variant_id,
                cart_items.quantity,
                cart_items.added_at,
                (SELECT name FROM products WHERE id = cart_items.product_id) AS product_name,
                (SELECT price FROM products WHERE id = cart_items.product_id) AS price,
                (SELECT size FROM product_variants WHERE id = cart_items.variant_id) AS size,
                (SELECT color FROM product_variants WHERE id = cart_items.variant_id) AS color,
                (SELECT img_url FROM product_images WHERE product_id = cart_items.product_id AND is_thumbnail = TRUE) AS thumbnail;
        `, [variantId, quantity, cartId, productId]);

        if (!result.rows[0]) {
            throw new Error('Insufficient stock or stock update failed');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Add to cart error:', {
            message: err.message,
            cartId,
            productId,
            variantId,
            quantity,
            stack: err.stack,
        });
        throw new Error('Failed to add to cart: ' + err.message);
    }
}


// Update cart item quantity
async function updateCartItem({ cartItemId, quantity }) {
    try {
        const query = `
            UPDATE cart_items
            SET quantity = $2
            WHERE id = $1
            RETURNING 
                id,
                cart_id,
                product_id,
                variant_id,
                quantity,
                added_at,
                (SELECT name FROM products WHERE id = cart_items.product_id) AS product_name,
                (SELECT price FROM products WHERE id = cart_items.product_id) AS price,
                (SELECT size FROM product_variants WHERE id = cart_items.variant_id) AS size,
                (SELECT color FROM product_variants WHERE id = cart_items.variant_id) AS color,
                (SELECT img_url FROM product_images WHERE product_id = cart_items.product_id AND is_thumbnail = TRUE) AS thumbnail;
        `;
        const result = await db.query(query, [cartItemId, quantity]);
        return result.rows[0];
    } catch (err) {
        console.error('Update cart item error:', err.message);
        throw new Error('Failed to update cart item: ' + err.message);
    }
}

// Remove item from cart
async function removeFromCart(cartItemId) {
    try {
        const query = `
            DELETE FROM cart_items
            WHERE id = $1
            RETURNING id, cart_id, product_id, variant_id, quantity, added_at;
        `;
        const result = await db.query(query, [cartItemId]);
        return result.rows[0];
    } catch (err) {
        console.error('Remove cart item error:', err.message);
        throw new Error('Failed to remove cart item: ' + err.message);
    }
}

// Merge guest cart into user cart on sign-in
async function mergeCarts({ userId, guestCartItems }) {
    try {
        const cart = await getOrCreateCart(userId);
        const cartId = cart.id;

        for (const item of guestCartItems) {
            await addToCart({
                cartId,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            });
        }

        return cart;
    } catch (err) {
        console.error('Merge carts error:', err.message);
        throw new Error('Failed to merge carts: ' + err.message);
    }
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllProducts,
    getSingleProduct,
    getFilteredProducts,
    getTotalProducts,
    getColors,
    getOrCreateCart,
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    mergeCarts,
};