const db = require('../db');
const oracledb = require('oracledb');

const create = async (username, hashedPassword, email) => {
    const sql = `INSERT INTO users (username, password_hash, email) VALUES (:username, :hashedPassword, :email) RETURNING USER_ID INTO :id`;
    const binds = {
      username: { val: username, dir: oracledb.BIND_IN, type: oracledb.STRING },
      hashedPassword: { val: hashedPassword, dir: oracledb.BIND_IN, type: oracledb.STRING },
      email: { val: email, dir: oracledb.BIND_IN, type: oracledb.STRING },
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };
    const options = { autoCommit: true };
    
    const result = await db.execute(sql, binds, options);
    return {
        id: result.outBinds.id[0],
        username,
        email,
    };
};

const assignRole = async (userId, roleName) => {
    const roleSql = `SELECT ID FROM ROLES WHERE NAME = :roleName`;
    const roleResult = await db.execute(roleSql, { roleName });
    if (roleResult.rows.length === 0) throw new Error('Role not found');
    const roleId = roleResult.rows[0].ID;

    const sql = `INSERT INTO USER_ROLES (USER_ID, ROLE_ID) VALUES (:userId, :roleId)`;
    await db.execute(sql, { userId, roleId }, { autoCommit: true });
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
    getUserRoles,
    assignRole,
};