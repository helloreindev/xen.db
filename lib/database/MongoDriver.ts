import { createConnection, Connection, ConnectOptions } from "mongoose";
import { modelSchema } from "../utils";
import { IDataSet, IMongoDriver } from "../interfaces";
import { get, set, unset } from "lodash";

export class MongoDriver {
    /**
     * MongoDB connection instance
     */
    private connection: Connection;

    /**
     * The models
     */
    private models = new Map<string, ReturnType<typeof modelSchema>>();

    /**
     * The mongoose options
     */
    private mongoOptions: ConnectOptions;

    /**
     * The MongoDB driver options
     */
    public options: IMongoDriver;

    /**
     * The table name of the database
     */
    public table: string;

    /**
     * The MongoDB URI connection
     */
    public uri: string;

    public constructor(options: IMongoDriver, mongoOptions: ConnectOptions) {
        this.mongoOptions = mongoOptions;
        this.options = Object.assign(
            {
                tableName: "json",
                uri: options.uri,
            },
            options
        );
        this.table = this.options.tableName;
        this.uri = this.options.uri;
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
        this.checkConnection();

        const model = await this.getModel(this.table);

        return (await model.find()).map((row: any) => ({
            id: row.ID,
            value: row.Data,
        }));
    }

    private checkConnection() {
        if (this.connection === null) {
            throw new Error("MongoDB connection is not established");
        }
    }

    /**
     * Closes the connection
     * @param force Force to close the connection
     * @returns {Promise<void>}
     */
    public close(force?: boolean): Promise<void> {
        return this.connection?.close(force);
    }

    /**
     * Connect to MongoDB
     * @returns {Promise<MongoDriver>}
     */
    public connect(): Promise<MongoDriver> {
        return new Promise(async (res, rej) => {
            createConnection(this.uri, this.mongoOptions, (err, conn) => {
                if (err) return rej(err);
                this.connection = conn;
                res(this);
            });
        });
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
        this.checkConnection();

        const model = await this.getModel(this.table);
        await model.deleteMany({
            ID: key,
        });

        return true;
    }

    private async deleteRows(): Promise<boolean> {
        this.checkConnection();

        const model = await this.getModel(this.table);
        await model.deleteMany();

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

        return this.getRowKey(key) as any;
    }

    private async getModel(table: string) {
        await this.prepare(table);

        return this.models.get(table);
    }

    private async getRowKey<T>(key: string): Promise<T[]> {
        this.checkConnection();

        const model = await this.getModel(this.table);
        const res = await model.find({ ID: key });

        return res.map((r: any) => r.Data);
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
        this.checkConnection();

        if (!this.models.has(table)) {
            this.models.set(table, modelSchema(this.connection, table));
        }
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
        this.checkConnection();

        const model = await this.getModel(this.table);

        await model.findOneAndUpdate(
            {
                ID: key
            },
            {
                $set: { Data: value }
            },
            { upsert: true }
        );

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
