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

const getUserRoles = async (userId) => {
    const sql = `SELECT r.NAME AS role_name 
                 FROM ROLES r 
                 INNER JOIN USER_ROLES ur ON r.ID = ur.ROLE_ID 
                 WHERE ur.USER_ID = :userId`;
    try {
        const result = await db.execute(sql, {userId}); 
        console.log('Rows:', result.rows); // Add this line to check the rows
        if (!result || !result.rows || !Array.isArray(result.rows) || result.rows.length === 0) {
            console.log(`No roles found for userId: ${userId}`);
            return [];
        }
        return result.rows.map(row => row.ROLE_NAME);
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
};




module.exports = {
    create,
    findByUsername,
    getUserRoles
};