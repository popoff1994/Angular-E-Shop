const db = require('../db');

const create = async (username, hashedPassword, email) => {
    const sql = `INSERT INTO users (username, password_hash, email) VALUES (:username, :hashedPassword, :email)`;
    const binds = { username, hashedPassword, email };
    const options = { autoCommit: true };
    
    const result = await db.execute(sql, binds, options);
    return result;
};

const findByUsername = async (username) => {
    const sql = `SELECT * FROM users WHERE username = :username`;
    try {
        const result = await db.execute(sql, { username });
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

module.exports = {
    create,
    findByUsername,
};