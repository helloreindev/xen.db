const SQLite = require("better-sqlite3");
const { EventEmitter } = require("events");
const fs = require("fs");
const lodash = require("lodash");
const Util = require("./Util");

/**
 * Represents XenDB Database class
 * @extends EventEmitter
 * @property {SQLite.Database} database The main SQLite3 Database
 * @property {String} name The name of the database
 * @property {Object} options XenDB options
 * @property {Number} rowCount The database table's rows count
 */
class Database extends EventEmitter {
    /**
     * XenDB Database
     * @param {String} [databaseFile="json.sqlite"] The database's file
     * @param {Object} [options] Database options
     * @param {SQLite.Database} [options.database] The SQLite Database
     * @param {String} [options.path="./"] The database's path file
     * @param {String} [options.table="JSON"] The database's table name
     * @param {Boolean} [options.useWalMode] Whether to use wal mode or not
     */
    constructor(databaseFile, options) {
        super();

        this.name = databaseFile;
        this.options = Object.assign({
            path: "./",
            table: "JSON",
            useWalMode: false
        }, options);

        if (databaseFile === undefined) {
            databaseFile = "json.sqlite";
        }

        if (typeof databaseFile !== "string") {
            throw new TypeError("Invalid Database name specified! Need Help? Check: discord.gg/78RyqJK");
        }

        if (!this.options.database && !fs.existsSync(this.options.path)) {
            fs.mkdirSync(this.options.path)
        }

        if (this.options.useWalMode === true) {
            this.database.pragma("journal_mode = wal");
        }

        Object.defineProperties(this, {
            _database: {
                value: this.options.database || new SQLite(databaseFile, options),
                writable: true,
                enumerable: false
            },
        });

        this.prepareTable();
    }

    /**
     * Fired when the database is ready
     * @returns {void}
     */
    init() {
        this.emit("ready");
    }

    /**
     * Prepares a tabe
     * @param {String} [name] The table name
     */
    prepareTable(name = this.options.table) {
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
     * @type {Number}
     */
    get rowCount() {
        const res = this.database.prepare(`SELECT count(*) FROM '${this.options.table}';`).get();
        return res["count(*)"];
    }

    /**
     * Iterator that yields all data of this db
     */
    *[Symbol.iterator]() {
        this.prepareTable(this.options.table);

        yield* this.all({ table: this.options.table });
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
     * @type {Number}
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
     * @param {Object} [options] Options 
     */
    deleteAll(options = {}) {
        this.prepareTable(options.table || this.options.table);
        this.database.prepare(`DELETE FROM ${options.table || this.options.table};`).run();
    }

    /**
     * Creates new instance of this database with the specified table
     * @param {String} name Table name
     */
    createTable(name = "JSON") {
        if (name === this.options.table) return this;

        return new Database("PLACEHOLDER", {
            database: this.database,
            table: typeof name === "string" ? name : "JSON"
        });
    }

    /**
     * Returns saved data from this database. Alias of `Database.fetch()`
     * @param {String} key Key of the data 
     * @param {Object} options Options
     */
    get(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.options.table;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse Key. Need Help? Check: discord.gg/78RyqJK");

        this.prepareTable(table);

        let fetched = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!fetched || fetched.json === "{}") return null;

        fetched = JSON.parse(fetched.json);

        if (typeof fetched === "object" && target) {
            fetched = lodash.get(fetched, target);
        }

        return fetched;
    }

    /**
     * Returns saved data from this database. Alias of `Database.get()`
     * @param {String} key Key of the data 
     * @param {Object} options Options
     */
    fetch(key, options = {}) {
        return this.get(key, options);
    }

    /**
     * Set or re-writes data in this database key
     * @param {String} key Key of the data
     * @param {any} value Value to store
     * @param {Object} options Options
     */
    set(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.options.table;
        const { id, target } = Util.parseKey(key);

        if (!id) throw new Error("Could Not Parse Key. Need Help? Check: discord.gg/78RyqJK");

        this.prepareTable(table);

        let data = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        if (!data) {
            this.database.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(id, '{}');
            data = this.database.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(id);
        }

        data = JSON.parse(data.json);

        if (typeof data === "object" && target) {
            value = lodash.set(data, target, value);
        } else if (target) throw new TypeError("Cannot Use Target With Non-Object. Need Help? Check: discord.gg/78RyqJK");

        value = JSON.stringify(value);

        this.database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(value, id);

        const newData = this.fetch(id, { table: table });
        return newData;
    }

    /**
     * Checks if there is any matching value with provided key
     * @param {String} key Key to match
     * @param {Object} options Options
     * @returns {Boolean}
     */
    has(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.options.table;
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
     * @param {String} key Key of the data
     * @param {Object} options Options
     */
    type(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const data = this.get(key, options);
        return Array.isArray(data) ? "array" : typeof data;
    }

    /**
     * Deletes a data from the specified key
     * @param {String} key Key to be delete
     * @param {Object} options Options
     * @returns {Boolean}
     */
    delete(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        const table = options.table || this.options.table;
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
     * @param {Object} options 
     */
    all(options = {}) {
        const table = options.table || this.options.table;
        this.prepareTable(table);

        const statement = this.database.prepare(`SELECT * FROM ${table} WHERE ID IS NOT NULL`);
        let res = [];

        for (const row of statement.iterate()) {
            if (options.length && typeof options.length === "number" && options.length > 0 && options.length === res.length) break;

            try {
                res.push({
                    ID: row.ID,
                    Data: JSON.parse(row.json)
                });
            } catch { }
        }

        return res;
    }

    /**
     * Push an array type value into the database key
     * @param {String} key Key of the data 
     * @param {any} value Value to store (or push into the key)
     * @param {Object} options Options
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
     * Extract a value from an array (Reverse of `Database.push()`)
     * @param {String} key Key of the data
     * @param {any} value The value that wanted to be extracted/pull
     * @param {Object} options Options
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
     * Extract a value from an array. Alias of `Database.pull()`
     * @param {String} key Key of the data
     * @param {any} value The value that wanted to be extracted
     * @param {Object} options Options
     */
    extract(key, value, options = {}) {
        return this.pull(key, value, options)
    }

    /**
     * Fetch a specific value from the database
     * @param {String} key Key of the data
     * @param {any} value The value that wanted to be fetched
     * @param {Object} options Options
     */
    fetchOne(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.fetch(key, options).filter(x => x === value)
    }

    /**
     * Get a specific value from the database. Alias of `Database.fetchOne()`
     * @param {String} key Key of the data
     * @param {any} value The value that wanted to be fetched
     * @param {Object} options Options
     */
    getOne(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value && value != 0) throw new TypeError("No Value Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.get(key, options).filter(x => x === value)
    }

    /**
     * Alias of `Database.all()` but easier to sort by key
     * @param {String} key The key of the data
     * @param {Object} options Options
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
     * Alias of `Database.all()` but easier to sort by key
     * @param {String} key The key of the data
     * @param {Object} options Options
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
     * Alias of `Database.all()`
     * @param {Object} options Options
     */
    fetchAll(options = {}) {
        return this.all(options);
    }

    /**
     * Add numbers to a key in the database
     * @param {String} key Key of the data
     * @param {Number} value Any numerical value
     * @param {Object} options Options
     */
    add(key, value, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        if (!value || typeof value !== "number") throw new TypeError("Value Must Be Numerical! Need Help? Check: discord.gg/78RyqJK");

        const has = this.get(key, options);
        if (!has) return this.set(key, 0 + value, options);
        return this.set(key, has + value, options);
    }

    /**
     * Subtract numbers to a key from the database
     * @param {String} key Key of the data
     * @param {Number} value Any numerical value
     * @param {Object} options Options
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
     * @param {String} key Key of the data
     * @param {Number} value Any numerical value
     * @param {Object} options Options
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
     * @param {String} key Key of the data
     * @param {Number} value Any numerical value
     * @param {Object} options Options
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
     * @param {String} key Key of the data 
     * @param {Number} value Numerical value
     * @param {Object} options Options
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
     * @param {Object} options Options
     */
    keyArray(options = {}) {
        return this.map(m => m.ID, options);
    }

    /**
     * Returns array of values
     * @param {Object} options Options
     */
    valueArray(options = {}) {
        return this.map(m => m.data, options);
    }

    /**
     * Drops currently active/specified table
     * @param {Object} options Options
     * @returns {Boolean}
     */
    drop(options = {}) {
        const table = options.table || this.options.table;

        try {
            this.database.prepare(`DROP TABLE ${table}`).run();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Returns length of this database
     * @type {Number}
     */
    get length() {
        return this.rowCount;
    }

    /**
     * Alias of db.has
     * @param {String} key Key
     * @param {Object} options Options
     * @returns {Boolean}
     */
    includes(key, options = {}) {
        if (!key || typeof key !== "string") throw new TypeError("No Key Specified! Need Help? Check: discord.gg/78RyqJK");

        return this.has(key, options);
    }

    /**
     * Identical to Array.forEach
     * @param {Function} fn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param {Object} options Options
     */
    forEach(fn, options = {}) {
        return this.all(options).forEach(fn);
    }

    /**
     * Identical to Array.map
     * @param {Function} fn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param {Object} options Options
     */
    map(fn, options = {}) {
        return this.all(options).map(fn);
    }

    /**
     * Identical to Array.some
     * @param {Function} fn A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
     * @param {Object} options Options
     */
    some(fn, options = {}) {
        return this.all(options).some(fn);
    }

    /**
     * Identical to Array.every
     * @param {Function} fn A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.
     * @param {Object} options Options
     */
    every(fn, options = {}) {
        return this.all(options).every(fn);
    }

    /**
     * Identical to Array.sort
     * @param {Function} fn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * @param {Object} options Options
     */
    sort(fn, options = {}) {
        return this.all(options).sort(fn);
    }

    /**
     * Identical to Array.filter
     * @param {Function} fn A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param {Object} options Options
     */
    filter(fn, options = {}) {
        return this.all(options).filter(fn);
    }

    /**
     * Identical to Array.flatMap
     * @param {Function} fn Function that produces an element of the new Array, taking three arguments.
     * @param {Object} options Options
     */
    flatMap(fn, options = {}) {
        return this.all(options).flatMap(fn);
    }

    /**
     * Identical to Array.reduce
     * @param {Function} fn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param {Object} initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     * @param {Object} options Options
     */
    reduce(fn, initialValue, options = {}) {
        return this.all(options).reduce(fn, initialValue);
    }

    /**
     * Identical to Array.reduceRight
     * @param {Function} fn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param {Object} initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     * @param {Object} options Options
     */
    reduceRight(fn, initialValue, options = {}) {
        return this.all(options).reduceRight(fn, initialValue);
    }

    /**
     * Identical to Array.find
     * @param {Function} fn find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param {Object} options Options
     */
    find(fn, options = {}) {
        return this.all(options).find(fn);
    }

    /**
     * Identical to Array.findIndex
     * @param {Function} fn find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param {Object} options Options
     */
    findIndex(fn, options = {}) {
        return this.all(options).findIndex(fn);
    }

    /**
     * Identical to Array.indexOf
     * @param {any} searchElement The value to locate in the array.
     * @param {Number} fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     * @param {Object} options Options
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
     * @param {Object} options Options
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
     * @param {Object} options Export options
     * @deprecated 
     */
    export(options = { stringify: false, format: false, tableName: null, allTable: false }) {
        let data = {
            data: options.allTable ? this.allTableArray() : this.all({ table: options.tableName || this.options.table }),
            mod: "quick.db",
            generatedTimestamp: new Date().getTime()
        };

        if (options.stringify) data = JSON.stringify(data, null, options.format ? (typeof options.format === "number" ? options.format : "\t") : null);

        this.emit("warn", "[DEPRECATED] Database.export is deprecated. This function will be remove on future version.");
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
                ID: index,
                Table: table,
                Data: this.all({ table: table })
            })
        })

        return arr;
    }

    /**
     * 
     * @returns {Array<Object>}
     * @deprecated
     */
    flat() {
        const { tables } = this.tables();

        const data = [];
        for (const table of tables) {
            data.push(this.all({ table }));
        }

        return Array.prototype.flat.call(data)
    }

}

module.exports = Database;
