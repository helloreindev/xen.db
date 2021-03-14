const SQLite = require("better-sqlite3");
const fs = require("fs");
const lodash = require("lodash");
const Util = require("./Util");

class Database {

    constructor(databaseFile = "json.sqlite", options = {} ) {

        if (!databaseFile || typeof databaseFile !== "string") throw new TypeError("Invalid Database Name Specified! Need Help? Check: discord.gg/78RyqJK");

        /**
         * Database name
         */
        this.name = databaseFile || "json.sqlite";

        /**
         * Database path
         */
        this.path = options.path || "./";

        /**
         * Table name
         */
        this.tableName = options.table || "JSON";

        if (!options.database && !fs.existsSync(this.path)) fs.mkdirSync(this.path)

        /**
         * The SQLite3 database.
         */
        Object.defineProperties(this, {
            _database: {
                value: options.database || new SQLite(databaseFile, options),
                writable: true,
                enumerable: false
            },
        });

        if (options.useWalMode === true) this.database.pragma("journal_mode = wal");

        this.prepareTable();
    }

    /**
     * Prepares a tabe
     * @param {string} [name] The table name
     */
    prepareTable(name = this.tableName) {
        this.database.prepare(`CREATE TABLE IF NOT EXISTS ${name} (ID TEXT, json TEXT)`).run();
    }

    /**
     * Returns the SQLite3-Database Manager
     * @type {SQLite.Database}
     */
    get database() {
        return this._database;
    }

    /**
     * Returns number of rows count
     */
    get rowCount() {
        const res = this.database.prepare(`SELECT count(*) FROM '${this.tableName}';`).get();
        return res["count(*)"];
    }

    /**
     * Iterator that yields all data of this db
     */
    *[Symbol.iterator]() {
        this.prepareTable(this.tableName);

        yield* this.all({ table: this.tableName });
    }
    /**
     * Evaluate anything inside the `Database` class using `this`
     * @param {any} x Value to be evaluated
     */
    eval(x) {
        return eval(x);
    }
    /**
     * Returns an array of this table
     */
    array() {
        return [...this];
    }

    /**
     * Returns the database file size in bytes
     */
    size() {
        try {
            return fs.statSync(this.name).size;
        } catch {
            return 0;
        }
    }

    /**
     * Delete all data in the database
     */
    deleteAll(options = {}) {
        this.prepareTable(options.table || this.tableName);
        this.database.prepare(`DELETE FROM ${options.table || this.tableName};`).run();
    }

    /**
     * Creates new instance of this database with the specified table
     * @param {string} name Table name
     */
    createTable(name = "JSON") {
        if (name === this.tableName) return this;

        return new Database("PLACEHOLDER", {
            database: this.database,
            table: typeof name === "string" ? name : "JSON"
        });
    }

    /**
     * Returns saved data from this database. Alias of `(method) Database.fetch()`
     * @param {string} key Key of the data 
     * @param {object} options Options
     */
    get(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.tableName;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse Key. Need Help? Check: discord.gg/78RyqJK");

        // make sure to create table
        this.prepareTable(table);

        let data = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!data || data.json === "{}") return null;

        data = JSON.parse(data.json);

        if (typeof data === "object" && target) {
            data = lodash.get(data, target);
        }

        return data;
    }

    /**
     * Returns saved data from this database. Alias of `(method) Database.get()`
     * @param {string} key Key of the data 
     * @param {object} options Options
     */
    fetch(key, options = {}) {
        return this.get(key, options);
    }

    /**
     * Set or re-writes data in this database key
     * @param {string} key Key of the data
     * @param {any} value Value to store
     * @param {object} options Options
     */
    set(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.tableName;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse Key. Need Help? Check: discord.gg/78RyqJK");

        this.prepareTable(table);

        let existing = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!existing) {
            this.database.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(id, '{}');
            existing = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        }

        existing = JSON.parse(existing.json);
        try { existing = JSON.parse(existing) } catch { }

        if (typeof existing === "object" && target) {
            value = lodash.set(existing, target, value);
        } else if (target) throw new TypeError("Cannot Use Target With Non-Object. Need Help? Check: discord.gg/78RyqJK");

        value = JSON.stringify(value);

        this.database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(value, id);

        const newData = this.fetch(id, { table: table });
        return newData;
    }

    /**
     * Checks if there is any matching value with provided key
     * @param {string} key Key to match
     * @param {object} options Options
     * @returns {boolean}
     */
    has(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.tableName;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse key. Need Help? Check: discord.gg/78RyqJK");

        this.prepareTable(table);

        let data = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!data) return false;

        data = JSON.parse(data.json);

        try { data = JSON.parse(data) } catch { }

        if (target && typeof data === "object") {
            data = lodash.get(data, target);
        }

        return typeof data !== "undefined";
    }

    /**
     * Returns data type of fetched data
     * @param {string} key Key of the data
     * @param {object} options Options
     */
    type(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const data = this.get(key, options);
        return Array.isArray(data) ? "array" : typeof data;
    }

    /**
     * Deletes a data from the specified key
     * @param {string} key Key to be delete
     * @param {object} options Options
     * @returns {boolean}
     */
    delete(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.tableName;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse Key. Need Help? Check: discord.gg/78RyqJK");

        this.prepareTable(table);

        let data = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!data) return false;

        data = JSON.parse(data.json);

        try { data = JSON.parse(data) } catch { }

        if (target && typeof data === "object") {
            const r = lodash.unset(data, target);
            if (!r) return false;
            data = JSON.stringify(data);
            this.database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(data, id);

            return true;
        } else if (target) throw new Error("Cannot Use Target With Non-Object. Need Help? Check: discord.gg/78RyqJK");

        this.database.prepare(`DELETE FROM ${table} WHERE ID = (?)`).run(id);

        return true;
    }
    /**
     * Returns used table (or specific table) as array
     * @param {object} options 
     */
    all(options = {}) {
        const table = options.table || this.tableName;
        this.prepareTable(table);

        const statement = this.database.prepare(`SELECT * FROM ${table} WHERE ID IS NOT NULL`);
        const res = [];

        for (const row of statement.iterate()) {
            if (options.length && typeof options.length === "number" && options.length > 0 && options.length === res.length) break;

            try {
                let raw = JSON.parse(row.json);
                try { raw = JSON.parse(raw) } catch { }

                res.push({
                    ID: row.ID,
                    data: raw
                });
            } catch { }
        }

        return res;
    }

    /**
     * Push an array type value into the database key
     * @param {string} key Key of the data 
     * @param {any} value Value to store (or push into the jey)
     * @param {object} options Options
     */
    push(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        const has = this.has(key, options);
        if (!has) return this.set(key, !Array.isArray(value) ? [value] : value, options);

        const data = this.get(key, options);
        if (!Array.isArray(data)) throw new TypeError("Cannot Use Push With Non-Array Type. Need Help? Check: discord.gg/78RyqJK");
        if (Array.isArray(value)) {
            const n = data.concat(value);
            return this.set(key, n, options);
        }
        const res = [...data];
        res.push(value);
        return this.set(key, res, options);
    }

    /**
     * Extract a value from an array (Reverse of `(method) Database.push()`)
     * @param {string} key Key of the data
     * @param {any} value The value that wanted to be extracted/pull
     * @param {object} options Options
     */
    pull(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        const data = this.get(key, options);
        if (!Array.isArray(data)) throw new TypeError("Cannot Use Pull With Non-Array Type. Need Help? Check: discord.gg/78RyqJK");

        if (!Array.isArray(value)) return this.set(key, data.filter(x => x !== value), options);
        return this.set(key, data.filter(x => !value.includes(x)), options);
    }

    /**
     * Extract a value from an array. Alias of `(method) Database.pull()`
     * @param {string} key Key of the data
     * @param {any} value The value that wanted to be extracted
     * @param {object} options Options
     */
    extract(key, value, options = {}) {
        return this.pull(key, value, options)
    }

    /**
     * Fetch a specific value from the database
     * @param {string} key Key of the data
     * @param {any} value The value that wanted to be fetched
     * @param {object} options Options
     */
    fetchOne(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.fetch(key, options).filter(x => x === value)
    }

    /**
     * Get a specific value from the database. Alias of `(method) Database.fetchOne()`
     * @param {string} key Key of the data
     * @param {any} value The value that wanted to be fetched
     * @param {object} options Options
     */
    getOne(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.get(key, options).filter(x => x === value)
    }

    /**
     * Alias of `(method) Database.all()` but easier to sort by key
     * @param {string} key The key of the data
     * @param {object} options Options
     */
    startsWith(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        let data = this.filter(i => i.ID.startsWith(key), options);
        if (ops && typeof ops.sort === "string") {
            if (ops.sort.startsWith(".")) ops.sort = ops.sort.slice(1);
            ops.sort = ops.sort.split(".");
            data = lodash.sortBy(data, ops.sort).reverse();
        }

        return data;
    }

    /**
     * Alias of `(method) Database.all()` but easier to sort by key
     * @param {string} key The key of the data
     * @param {object} options Options
     */
    endsWith(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        let data = this.filter(i => i.ID.endsWith(key), options);
        if (ops && ops.sort && typeof ops.sort === "string") {
            if (ops.sort.startsWith(".")) ops.sort = ops.sort.slice(1);
            ops.sort = ops.sort.split(".");
            data = lodash.sortBy(data, ops.sort).reverse();
        }

        return data;
    }

    /**
     * Alias of `(method) Database.all()`
     * @param {object} options Options
     */
    fetchAll(options = {}) {
        return this.all(options);
    }

    /**
     * Add numbers to a key in the database
     * @param {string} key Key of the data
     * @param {number} value Any numerical value
     * @param {object} options Options
     */
    add(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 + value, options);
        return this.set(key, has + value, options);
    }

    /**
     * Subtract numbers to a key in the database
     * @param {string} key Key of the data
     * @param {number} value Any numerical value
     * @param {object} options Options
     */
    subtract(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 - value, options);
        return this.set(key, has - value, options);
    }

    /**
     * Multiply numbers to a key in the database
     * @param {string} key Key of the data
     * @param {number} value Any numerical value
     * @param {object} options Options
     */
    multiply(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 * value, options);
        return this.set(key, has * value, options);
    }

    /**
     * Divide numbers to a key in the database 
     * @param {string} key Key of the data
     * @param {number} value Any numerical value
     * @param {object} options Options
     */
    divide(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 / value, options);
        return this.set(key, has / value, options);
    }

    /**
     * Modulus for existing data with the given numerical value.
     * @param {string} key Key of the data 
     * @param {number} value Numerical value
     * @param {object} options Options
     */
    modulus(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 % value, options);
        return this.set(key, has % value, options);
    }

    /**
     * Returns array of keys
     * @param {object} options Options
     */
    keyArray(options = {}) {
        return this.map(m => m.ID, options);
    }

    /**
     * Returns array of values
     * @param {object} options Options
     */
    valueArray(options = {}) {
        return this.map(m => m.data, options);
    }

    /**
     * Drops currently active/specified table
     * @param {object} options Options
     * @returns {boolean}
     */
    drop(options = {}) {
        const table = options.table || this.tableName;

        try {
            this.database.prepare(`DROP TABLE ${table}`).run();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Returns length of this database
     */
    get length() {
        return this.rowCount;
    }

    /**
     * Alias of db.has
     * @param {string} key Key
     * @param {object} options Options
     * @returns {boolean}
     */
    includes(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.has(key, options);
    }

    /**
     * Identical to Array.forEach
     * @param {Function} fn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param {object} options Options
     */
    forEach(fn, options = {}) {
        return this.all(options).forEach(fn);
    }

    /**
     * Identical to Array.map
     * @param {Function} fn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param {object} options Options
     */
    map(fn, options = {}) {
        return this.all(options).map(fn);
    }

    /**
     * Identical to Array.some
     * @param {Function} fn A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
     * @param {object} options Options
     */
    some(fn, options = {}) {
        return this.all(options).some(fn);
    }

    /**
     * Identical to Array.every
     * @param {Function} fn A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
     * @param {object} options Options
     */
    every(fn, options = {}) {
        return this.all(options).every(fn);
    }

    /**
     * Identical to Array.sort
     * @param {Function} fn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * @param {object} options Options
     */
    sort(fn, options = {}) {
        return this.all(options).sort(fn);
    }

    /**
     * Identical to Array.filter
     * @param {Function} fn A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param {object} options Options
     */
    filter(fn, options = {}) {
        return this.all(options).filter(fn);
    }

    /**
     * Identical to Array.flatMap
     * @param {Function} fn Function that produces an element of the new Array, taking three arguments.
     * @param {object} options Options
     */
    flatMap(fn, options = {}) {
        return this.all(options).flatMap(fn);
    } 

    /**
     * Identical to Array.reduce
     * @param {Function} fn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param {object} initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     * @param {object} options Options
     */
    reduce(fn, initialValue, options = {}) {
        return this.all(options).reduce(fn, initialValue);
    }

    /**
     * Identical to Array.reduceRight
     * @param {Function} fn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param {object} initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     * @param {object} options Options
     */
    reduceRight(fn, initialValue, options = {}) {
        return this.all(options).reduceRight(fn, initialValue);
    }

    /**
     * Identical to Array.find
     * @param {Function} fn find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param {object} options Options
     */
    find(fn, options = {}) {
        return this.all(options).find(fn);
    }

    /**
     * Identical to Array.findIndex
     * @param {Function} fn find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param {object} options Options
     */
    findIndex(fn, options = {}) {
        return this.all(options).findIndex(fn);
    }

    /**
     * Identical to Array.indexOf
     * @param {any} searchElement The value to locate in the array.
     * @param {number} fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     * @param {object} options Options
     */
    indexOf(searchElement, fromIndex = 0, options = {}) {
        return this.all(options).indexOf(searchElement, fromIndex);
    }

    /**
     * Returns a value representation of an array
     */
    toString() {
        return `<Database ${this.length}>`;
    }

    /**
     * Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization.
     * @param {object} options Options
     */
    toJSON(options) {
        return this.all(options);
    }

    /**
     * Returns all table name
     */
    tables() {
        const data = this.database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        return {
            count: Object.keys(data).length,
            tables: Object.values(data).map(m => m.name)
        };
    }

    /**
     * Exports this db
     * @param {object} options Export options 
     */
    export(options = { stringify: false, format: false, tableName: null, allTable: false }) {
        let data = {
            data: options.allTable ? this.allTableArray() : this.all({ table: options.tableName || this.tableName }),
            mod: "quick.db",
            generatedTimestamp: new Date().getTime()
        };

        if (options.stringify) data = JSON.stringify(data, null, options.format ? (typeof options.format === "number" ? options.format : "\t") : null);

        return data;
    }

    /**
     * This method updates current database manager with a new one. Database parameter can either be `Database` instance or `BetterSQLite3.Database` instance
     * @param {any} database The database
     */
    use(database) {
        if (!database) throw new Error("Database Was Not Provided!");
        if (database.prototype instanceof Database || database instanceof Database) this._database = database._database;
        if (database instanceof SQLite || database.prototype instanceof SQLite || database instanceof this._database || database.prototype instanceof this._database) this._database = database;

        throw new Error("Invalid Database");
    }

    /**
     * Returns all table(s) as array.
     */
    allTableArray() {
        const { tables } = this.tables();
        let arr = [];

        tables.forEach((table, index) => {
            arr.push({
                id: index,
                table: table,
                data: this.all({ table: table })
            })
        })

        return arr;
    }

    flat() {
        const { tables } = this.tables();

        const data = [];
        for (const table of tables) {
            data.push(this.all({table}));
        }

        return Array.prototype.flat.call(data)
    }

}

module.exports = Database;
