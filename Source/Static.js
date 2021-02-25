const Database = require("./Database");

let db;

/**
 * Static Xen.db
 * @param {string} [databaseFile] Database File Name 
 * @param {string} [path] Database Path 
 * @param {string} [table] Database Table Name
 * @returns {Database}
 */
module.exports = (databaseFile, path, table) => {
        if (!db) db = new Database(databaseFile || "json.sqlite", {
            path: path || "./",
            table: table || "JSON"
        })

    return db;
};