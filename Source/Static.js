const Database = require("./Database");

let db;

/**
 * Static Xen.db
 * @returns {Database}
 */
module.exports = () => {
         db = new Database()

    return db;
};