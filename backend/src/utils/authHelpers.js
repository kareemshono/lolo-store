const bcrypt = require("bcryptjs");
const db = require("../../db/index"); // Adjusted path

// Function to hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
// Function to check if a user exists by email
async function userExists(email) {
    const result = await db.query("SELECT id FROM site_user WHERE email = $1", [email]);
    return result.rows.length > 0;
}

module.exports = { hashPassword, userExists };
