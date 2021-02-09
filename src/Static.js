const Database = require("./index");


let db;

/**
 * Static quick.db
 * @returns {Database}
 */
module.exports = () => {
         db = new Database()

    return db;
};