import MySQL, { ConnectionConfig } from "promise-mysql";
import { IDataSet, IMySQLDriver } from "../interfaces";
import { get, set, unset } from "lodash";

export class MySQLDriver {
    /**
     * The configuration of the database
     */
    private config: ConnectionConfig;

    /**
     * The database connection
     */
    private connection?: MySQL.Connection;

    /**
     * The MySQL database module
     */
    private database: MySQL.mysqlModule;

    /**
     * The MySQL database driver options
     */
    public options: IMySQLDriver;

    /**
     * The table name of the database
     */
    public table: string;

    /**
     * Creates a new instance of the MySQL database driver
     * @param config The configuration of the MySQL database
     * @param options The options for the MySQL driver
     * @param options.tableName The table name of the database
     */
    constructor(config: MySQL.ConnectionConfig, options: IMySQLDriver) {
        this.config = config;
        /* eslint-disable-next-line */
        this.database = require("promise-mysql");
        this.options = Object.assign(
            {
                tableName: "json",
            },
            options
        );
        this.table = this.options.tableName;
    }

    /**
     * Adds a number to a key value in the database
     * @param key The key of the database
     * @param value The value to add to the key value
     * @returns {Promise<number>}
     */
    public async add(key, value: number): Promise<number> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (typeof value !== "number") {
            throw new TypeError(
                `value parameter should be a number. (val=${value})`
            );
        }

        let has = await this.get<number>(key);

        if (!has) has = 0;

        if (typeof has !== "number") {
            throw new TypeError(
                `The value key is not a number therefore cannot be parsed into a number. (val=${
                    has ?? undefined
                })`
            );
        }

        return this.set<number>(key, has + value);
    }

    /**
     * Get all data from the database
     * @returns {Promise<IDataSet[]>}
     */
    public async all(): Promise<IDataSet[]> {
        await this.checkConnection();

        const datas: IDataSet[] = await this.connection?.query(
            `SELECT * FROM ${this.table}`
        );

        return datas.map((row: any) => ({
            id: row.ID,
            value: JSON.parse(row.JSON),
        }));
    }

    private checkConnection() {
        if (this.connection === null) {
            throw new Error("MySQL is not connected yet!");
        }
    }

    /**
     * Connect to MySQL database
     */
    public async connect(): Promise<void> {
        this.connection = (await this.database.createConnection(
            this.config
        )) as any;

        this.prepare(this.table);
    }

    /**
     * Delete a key value from the database
     * @param key The key of the database
     * @returns {Promise<boolean>}
     */
    public async delete(key: string): Promise<boolean> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (key.includes(".")) {
            const split = key.split(".");
            const obj = await this.get<any>(split[0]);

            unset(obj ?? {}, split.slice(1).join("."));

            return this.setRowKey(split[0], obj);
        }

        return this.deleteRowKey(key);
    }

    /**
     * Delete everything from the database
     * @returns {Promise<boolean>}
     */
    public async deleteAll(): Promise<boolean> {
        return this.deleteRows();
    }

    private async deleteRowKey(key: string): Promise<boolean> {
        await this.checkConnection();

        await this.connection?.query(`DELETE FROM ${this.table} WHERE ID = ?`, [
            key,
        ]);

        return true;
    }

    private async deleteRows(): Promise<boolean> {
        await this.connection?.query(`DELETE FROM ${this.table}`);

        return true;
    }

    /**
     * Get a value from the database
     * @param key The key of the database
     * @returns {Promise<T>}
     */
    public async get<T>(key: string): Promise<T> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (key.includes(".")) {
            const split = key.split(".");
            const val = await this.getRowKey<any>(split[0]);

            return get(val, split.slice(1).join("."));
        }

        return this.getRowKey(key);
    }

    private async getRowKey<T>(key: string): Promise<T> {
        await this.checkConnection();

        const datas: any[] = await this.connection?.query(
            `SELECT JSON FROM ${this.table} WHERE ID = ?`,
            [key]
        );

        return datas.length === 0 ? undefined : JSON.parse(datas[0].JSON);
    }

    /**
     * Check whether a key in a database exists or not
     * @param key The key of the database to check
     * @returns {Promise<boolean>}
     */
    public async has(key: string): Promise<boolean> {
        return typeof (await this.get(key)) === "undefined" ? false : true;
    }

    /**
     * Prepare a new database table
     * @param table The table name of the database
     */
    public async prepare(table: string): Promise<void> {
        await this.checkConnection();

        await this.connection?.query(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, JSON TEXT)`
        );
    }

    /**
     * Remove a value from an array in the database
     * @param key The key of the database
     * @param value The value to remove from the array
     * @returns {Promise<T[]>}
     */
    public async pull<T>(
        key: string,
        value: any | any[] | ((data: any) => boolean)
    ): Promise<T[]> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (!value) {
            throw new TypeError(`value parameter is missing. (val=${value})`);
        }

        let arr = (await this.get<T[]>(key)) ?? [];

        if (!Array.isArray(arr)) {
            throw new TypeError(`The value key is not an array. (val=${arr})`);
        }

        if (!Array.isArray(value) && typeof value !== "function") {
            value = [value];
        }

        arr = arr.filter((x) => {
            return Array.isArray(value) ? !value.includes(x) : !value(x);
        });

        return this.set(key, arr);
    }

    /**
     * Push an array of value to a key in the database
     * @param key The key of the database
     * @param value The value to push to the key value
     * @returns {Promise<T[]>}
     */
    public async push<T>(key: string, value: any | any[]): Promise<T[]> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (!value) {
            throw new TypeError(`value parameter is missing. (val=${value})`);
        }

        let arr = (await this.get<T[]>(key)) ?? [];

        if (!Array.isArray(arr)) {
            throw new TypeError(`The value key is not an array. (val=${arr})`);
        }

        if (Array.isArray(value)) {
            arr = arr.concat(value);
        } else {
            arr.push(value);
        }

        return this.set(key, arr);
    }

    /**
     * Set a value in the database
     * @param key The key of the database
     * @param value The key value of the database
     * @returns {Promise<T>}
     */
    public async set<T>(key: string, value: any): Promise<T> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (!value) {
            throw new TypeError(`value parameter is missing. (val=${value})`);
        }

        if (key.includes(".")) {
            const split = key.split(".");
            let obj = await this.get<any>(split[0]);

            if (obj instanceof Object === false) {
                obj = {};
            }

            const valSet: T = set(obj ?? {}, split.slice(1).join("."), value);

            return this.setRowKey(split[0], valSet);
        }

        return this.setRowKey(key, value);
    }

    private async setRowKey<T>(key: string, value: T): Promise<T> {
        await this.checkConnection();

        const json = JSON.stringify(value);
        const data = await this.has(key);

        if (data) {
            this.connection?.query(
                `UPDATE ${this.table} SET JSON = (?) WHERE ID = (?)`,
                [json, key]
            );
        } else {
            this.connection?.query(
                `INSERT INTO ${this.table} (ID, JSON) VALUES (?, ?)`,
                [key, json]
            );
        }

        return value;
    }

    /**
     * Subtracts a number from a key value in the database
     * @param key The key of the database
     * @param value The value to subtract from the key value
     * @returns {Promise<number>}
     */
    public async subtract(key: string, value: number): Promise<number> {
        if (typeof key !== "string") {
            throw new TypeError(
                `key parameter should be a string. (val=${key})`
            );
        }

        if (typeof value !== "number") {
            throw new TypeError(
                `value parameter should be a number. (val=${value})`
            );
        }

        let has = await this.get<number>(key);

        if (!has) has = 0;

        if (typeof has !== "number") {
            throw new TypeError(
                `The value key is not a number therefore cannot be parsed into a number. (val=${
                    has ?? undefined
                })`
            );
        }

        return this.set<number>(key, has - value);
    }
}
