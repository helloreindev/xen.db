import SQLite from "better-sqlite3";
import { EventEmitter } from "events";

/**
 * Xen.db Definitions & Typings By: Reinhardt (<notmarx.tech@gmail.com>)
 */
declare module "xen.db" {

    /**
     * Parse A Key
     */
    export interface ParsedKey {
        id?: string;
        target?: string;
    }

    /**
     * The Database's Options
     */
    export interface DatabaseOptions extends SQLite.Options {
        /**
         * The Path Of The Database
         */
        path?: string;

        /**
         * The Database Table
         */
        table?: string;

        /**
         * SQLite Database Itself
         */
        database?: SQLite.Database;

        /**
         * Whether To Use Wal Mode
         */
        useWalMode?: boolean;
    }

    /**
     * Xen.db Util Class & Internal Method Used To Parse Key
     */
    export class Util {

        /**
         * Internal Method Used To Parse Key
         * @param key Key To Be Parsed
         */
        public static parseKey(key: string): ParsedKey;
    }

    /**
     * Data Sets
     */
    export interface DataSet {
        /**
         * The Key's ID
         */
        ID: string;

        /**
         * Value Data
         */
        Data: any;
    }

    /**
     * Options To Be Added To The Methods
     */
    export interface Options {
        /**
         * The Database's Table Where Value Need To Be Stored In A Specific Key
         */
        table?: string;

        /**
         * The Amount Of Items That Wanted To Be Execute A Function On
         */
        limit?: number;
    }

    export interface DatabaseEvents {
        ready: [];
        warn: [message: string];
    }

    export type Callbackfn<T> = (value: DataSet, index: number, array: DataSet[]) => T;
    export type Reducer = (previousValue: DataSet, currentValue: DataSet, currentIndex: number, array: DataSet[]) => any;

    /**
     * The Database Class
     */
    export class Database extends EventEmitter {
        
        name: string;
        options: DatabaseOptions;

        /**
         * Represents XenDB Database class
         * @param databaseFile Database File Name
         * @param options Database Options
         */
        constructor(databaseFile?: string, options?: DatabaseOptions);

        public [Symbol.iterator](): IterableIterator<DataSet>;

        /**
         * Returns The SQLite3 Database
         */
        public get database(): SQLite.Database;

        /**
         * Returns A Number Of Row Count
         */
        public get rowCount(): number;

        /**
         * Prepares A Database Table
         * @param name The Table Name
         */
        public prepareTable(name: string): void;

        /**
         * Evaluate A Values Inside The `Database` Class
         * @param x Value To Be Evaluated
         */
        public eval(x: any): any;

        /**
         * Returns An Array Of This Table
         */
        public array(): DataSet[];

        /**
         * Returns The Database File Size In Bytes
         */
        public size(): number;

        /**
         * Delete Everything In The Database
         * @param options Options
         */
        public deleteAll(options?: Options): void;

        /**
         * Creates New Instance Of The Database With The Specified Table
         * @param name The Table Name
         */
        public createTable(name?: string): Database;

        /**
         * Fetches Data In A Database's Key
         * @param key The Database's Key
         * @param options Options
         */
        public get(key: string, options?: Options): any;

        /**
         * Fetchs Data In Database's Key
         * @param key The Database's Key
         * @param options Options
         */
        public fetch(key: string, options?: Options): any;

        /**
         * Set Or Re-write Values In The Database's Key
         * @param key The Database's Key
         * @param value Value To Be Stored
         * @param options Options
         */
        public set(key: string, value: any, options?: Options): any;

        /**
         * Returns Boolean If Data In The Database's Key Are Exist Or Not
         * @param key The Database's Key
         * @param options Options
         */
        public has(key: string, options?: Options): boolean;

        /**
         * Returns The Type Of The Database's Key
         * @param key The Database's Key
         * @param options Options
         */
        public type(key: string, options?: Options): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";

        /**
         * Delete Specific Key From The Database
         * @param key The Database's Key
         * @param options Options
         */
        public delete(key: string, options?: Options): boolean;

        /**
         * Returns All Data In The Database As An Array
         * @param options Options
         */
        public all(options?: Options): DataSet[];

        /**
         * Push Or Set Multiples Values Into The Database's Key
         * @param key The Database's Key
         * @param value Values To Be Stored
         * @param options Options
         */
        public push(key: string, value: any | any[], options?: Options): any;

        /**
         * Pull Values From The Database's Key
         * @param key The Database's Key
         * @param value Values To Be Extract
         * @param options Options
         */
        public pull(key: string, value: any | any[], options?: Options): any;

        /**
         * Extract Values From The Database's Key
         * @param key The Database's Key
         * @param value Values To Be Extract
         * @param options Options
         */
        public extract(key: string, value: any | any[], options?: Options): any;

        /**
         * Fetch A Specific Value(s) In A Database's Key
         * @param key The Database's Key
         * @param value The Specific Value To Be Fetch
         * @param options Options
         */
        public fetchOne(key: string, value: any | any[], options?: Options): any;

        /**
        * Fetch A Specific Value(s) In A Database's Key
        * @param key The Database's Key
        * @param value The Specific Value To Be Fetch
        * @param options Options
        */
        public getOne(key: string, value: any | any[], options?: Options): any;

        /**
         * Easier To Sort Out By Database's Keys
         * @param key The Database's Key
         * @param options Options
         */
        public startsWith(key: string, options?: Options): DataSet[];

        /**
         * Easier To Sort Out By Database's Keys
         * @param key The Database's Key
         * @param options Options
         */
        public endsWith(key: string, options?: Options): DataSet[];

        /**
         * Returns All Data In The Database's As An Array
         * @param options Options
         */
        public fetchAll(options?: Options): DataSet[];

        /**
         * Add Any Numerical Value Into The Database's Key
         * @param key The Database's Key
         * @param value Value To Be Add
         * @param options Options
         */
        public add(key: string, value: number, options?: Options): any;

        /**
         * Subtract Any Numerical Value From The Database's Key
         * @param key The Database's Key
         * @param value Value To Be Subtract
         * @param options Options
         */
        public subtract(key: string, value: number, options?: Options): any;

        /**
         * Multiply Any Numerical Value From The Database's Key
         * @param key The Database's Key
         * @param value Value To Be Multiply
         * @param options Options
         */
        public multiply(key: string, value: number, options?: Options): any;

        /**
         * Divde Any Numerical Value From The Database
         * @param key The Database's Key
         * @param value Value To Be Divide
         * @param options Options
         */
        public divide(key: string, value: number, options?: Options): any;

        /**
         * Modulus FOr Existing Data With The Given Numerical Value
         * @param key The Database's Key
         * @param value Numerical Value
         * @param options Options
         */
        public modulus(key: string, value: number, options?: Options): any;

        /**
         * Returns All Of The Database Keys As An Array
         * @param options Options
         */
        public keyArray(options?: Options): string;

        /**
         * Returns All Of The Values In The Database Keys As An Array
         * @param options Options
         */
        public valueArray(options?: Options): any;

        /**
         * Drops Current Active/Specified Database's Table
         * @param options Options
         */
        public drop(options?: Options): boolean;

        /**
         * Returns The Length Of This Database
         */
        public get length(): number;

        /**
         * Returns Boolean If Data In The Database's Key Are Exist Or Not
         * @param key The Database's Key
         * @param options Options
         */
        public includes(key: string, options?: Options): boolean;

        /**
         * Identical To `Array.forEach`
         * @param fn Callbackfn
         * @param options Options
         */
        public forEach(fn: Callbackfn<void>, options?: Options): void;

        /**
         * Identical To `Array.map`
         * @param fn Callbackfn
         * @param options Options
         */
        public map(fn: Callbackfn<any>, options?: Options): any[];

        /**
         * Identical To `Array.some`
         * @param fn Callbackfn
         * @param options Options
         */
        public some(fn: Callbackfn<unknown>, options?: Options): boolean;

        /**
         * Identical To `Array.every`
         * @param fn Callbackfn
         * @param options Options
         */
        public every(fn: Callbackfn<unknown>, options?: Options): boolean;

        /**
         * Identical To `Array.sort`
         * @param fn Callbackfn
         * @param options Options
         */
        public sort(fn: Callbackfn<number>, options?: Options): DataSet[];

        /**
         * Identical To `Array.filter`
         * @param fn Callbackfn
         * @param options Options
         */
        public filter(fn: Callbackfn<unknown>, options?: Options): DataSet[];

        /**
         * Identical To `Array.flatMap`
         * @param fn Callbackfn
         * @param options Options
         */
        public flatMap(fn: Callbackfn<any>, options?: Options): DataSet[];

        /**
         * Identical To `Array.reduce`
         * @param fn Callbackfn
         * @param initialValue Initial Value
         * @param options Options
         */
        public reduce(fn: Reducer, initialValue?: any, options?: Options): DataSet;

        /**
         * Identical To `Array.reduceRight`
         * @param fn Callbackfn
         * @param initialValue Initial Value
         * @param options Options
         */
        public reduceRight(fn: Reducer, initialValue?: any, options?: Options): DataSet;

        /**
         * Identical To `Array.find`
         * @param fn Callbackfn
         */
        public find(fn: Callbackfn<unknown>): DataSet;

        /**
         * Identical To `Array.findIndex`
         * @param fn Callbackfn
         */
        public findIndex(fn: Callbackfn<unknown>): number;

        /**
         * Identical To `Array.indexOf`
         * @param searchElement Value To Locate In The Array
         * @param fromIndex The Array Index At Which To Begin The Search.
         */
        public indexOf(searchElement: DataSet, fromIndex?: number): number;

        /**
         * Returns A Value As An Array
         */
        public toString(): string;

        /**
         * Serialize JSON
         * @param options Options
         */
        public toJSON(options?: Options): DataSet[];

        /**
         * Returns All Database Tables Name
         */
        public tables(): { count: number; tables: string[] };

        /**
         * 
         * @param options Options
         */
        public export(options: { allTable: true }): { data: { id: number, table: string, data: DataSet[] }[]; mod: string; generatedTimestamp: number; };
        /**
         * 
         * @param options Options
         */
        public export(options: { allTable: false }): { data: DataSet[]; mod: string; generatedTimestamp: number; }

        /**
         * 
         * @param options Options
         */
        public export(options: { stringify: true }): string;

        /**
         * 
         * @param options Options
         */
        public export(options?: { stringify?: boolean, format?: boolean | number, tableName?: string, allTable?: boolean }): { data: DataSet[] | { id: number, table: string, data: DataSet[] }[]; mod: string; generatedTimestamp: number; } | string;

        /**
         * Updates Current Database Manager
         * @param database The Database
         */
        public use(database: SQLite.Database | Database): void;

        /**
         * Returns All Database Table(s) As An Array
         */
        public allTableArray(): { ID: number; Table: string; Data: DataSet[] }[];
        public flat(): DataSet[];

        public on<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K]) => void): this;
        public on<S extends string | symbol>(
            event: Exclude<S, keyof DatabaseEvents>,
            listener: (...args: any[]) => void,
        ): this;

        public once<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K]) => void): this;
        public once<S extends string | symbol>(
            event: Exclude<S, keyof DatabaseEvents>,
            listener: (...args: any[]) => void,
        ): this;

        public emit<K extends keyof DatabaseEvents>(event: K, ...args: DatabaseEvents[K]): boolean;
        public emit<S extends string | symbol>(event: Exclude<S, keyof DatabaseEvents>, ...args: any[]): boolean;

        public off<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K]) => void): this;
        public off<S extends string | symbol>(
            event: Exclude<S, keyof DatabaseEvents>,
            listener: (...args: any[]) => void,
        ): this;

        public removeAllListeners<K extends keyof DatabaseEvents>(event?: K): this;
        public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof DatabaseEvents>): this;
    }
    /**
     * Xen.db Statics
     * @param databaseFile The Database File
     * @param path The Path
     * @param table The Database Table
     */
    export function Static(databaseFile?: string, path?: string, table?: string): Database;

    /**
     * Xen.db Versions
     * ```
     * console.log(require("xen.db").version);
     * ```
     */
    export const VERSION: string;
}