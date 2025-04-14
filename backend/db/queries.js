const db = require('./index');

// Add a new user
async function addUser({ name, email, hashedPassword, phone,role, is_admin, created_at }) {
    const query = `
        INSERT INTO site_user (name, email, password,  phone, role, is_admin, created_at)
        VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING *;
    `;
    const values = [name, email, hashedPassword, phone, role , is_admin, created_at];
    const result = await db.query(query, values);
    return result.rows[0];
}
//get a user by email -- login
async function getUserByEmail(email) {
    const query = `SELECT * FROM site_user WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
}
// Get all users
async function getAllUsers() {
    const query = 'SELECT * FROM site_user;';
    const result = await db.query(query);
    return result.rows;
}

// Get a user by ID
// async function getUserById(userId) {
//     const query = 'SELECT * FROM site_user WHERE id = $1;';
//     const result = await db.query(query, [userId]);
//     return result.rows[0];
// }

// Update a user by ID
async function updateUser(userId, { name, email, phone }) {
    const query = `
        UPDATE site_user
        SET name = $1, email = $2, phone = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [name, email, phone, userId];
    const result = await db.query(query, values);
    return result.rows[0];
}

// Delete a user by ID
async function deleteUser(userId) {
    const query = 'DELETE FROM site_user WHERE id = $1 RETURNING *;';
    const result = await db.query(query, [userId]);
    return result.rows[0];
}

module.exports = {
    addUser,
    getAllUsers,
    getUserByEmail,
    updateUser,
    deleteUser,
};
