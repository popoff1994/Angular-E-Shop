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
    execute
};
