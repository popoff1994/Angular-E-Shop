const oracledb = require('oracledb');
require('dotenv').config();

try {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
  } catch (err) {
    console.error('Error initializing Oracle client libraries:', err);
    process.exit(1);
  }

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function initialize() {
    await oracledb.createPool(dbConfig);
}

async function close() {
    await oracledb.getPool().close();
}
async function commit() {
    const connection = await oracledb.getConnection();
    try {
        await connection.commit();
    } catch (err) {
        console.error('Error committing transaction:', err);
        throw err;
    } finally {
        if(connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
                throw err;
            }
        }
    }
}
async function rollback() {
    const connection = await oracledb.getConnection();
    try {
        await connection.rollback();
    } catch (err) {
        console.error('Error rolling back transaction:', err);
        throw err;
    } finally {
        if(connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
                throw err;
            }
        }
    }
}

function execute(sql, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        let connection;
        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
        opts.autoCommit = true;
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(sql, binds, opts);
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    });
}

module.exports = {
    initialize,
    close,
    execute,
    rollback,
    commit,
    STRING: oracledb.STRING,
    OUT_FORMAT_OBJECT: oracledb.OUT_FORMAT_OBJECT,
    BIND_OUT: oracledb.BIND_OUT,
    NUMBER: oracledb.NUMBER,
};
