import SQLite from "better-sqlite3";


declare module "xen.db" {

    export interface ParsedKey {
        id?: string;
        target?: string;
    }

    export interface DatabaseOptions extends SQLite.Options {
        path?: string;
        table?: string;
        database?: SQLite.Database;
        useWalMode?: boolean;
    }

    export class Util {
        public static parseKey(key: string): ParsedKey;
    }

    export interface DataSet {
        ID: string;
        data: any;
    }

    export interface Options {
        table?: string;
        limit?: number;
    }

    export type Callbackfn<T> = (value: DataSet, index: number, array: DataSet[]) => T;
    export type Reducer = (previousValue: DataSet, currentValue: DataSet, currentIndex: number, array: DataSet[]) => any;

    export class Database {
        databaseFile: string;
        path: string;
        table: string;

        constructor(databaseFile?: string, options?: DatabaseOptions);

        public [Symbol.iterator](): IterableIterator<DataSet>;

        public get database(): SQLite.Database;
        public get rowCount(): number;

        
        public prepareTable(name: string): void;
        public eval(x: any): any;
        public array(): DataSet[];
        public size(): number;
        public deleteAll(options?: Options): void;
        public createTable(name?: string): Database;
        public get(key: string, options?: Options): any;
        public fetch(key: string, options?: Options): any;
        public set(key: string, value: any, options?: Options): any;
        public has(key: string, options?: Options): boolean;
        public type(key: string, options?: Options): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";
        public delete(key: string, options?: Options): boolean;
        public all(options?: Options): DataSet[];
        public push(key: string, value: any | any[], options?: Options): any;
        public pull(key: string, value: any | any[], options?: Options): any;
        public remove(key: string, value: any | any[], options?: Options): any;
        public fetchOne(key: string, value: any | any[], options?: Options): any;
        public getOne(key: string, value: any | any[], options?: Options): any;
        public startsWith(key: string, options?: Options): DataSet[];
        public endsWith(key: string, options?: Options): DataSet[];
        public fetchAll(options?: Options): DataSet[];
        public add(key: string, value: number, options?: Options): any;
        public subtract(key: string, value: number, options?: Options): any;
        public multiply(key: string, value: number, options?: Options): any;
        public divide(key: string, value: number, options?: Options): any;
        public modulus(key: string, value: number, options?: Options): any;
        public keyArray(options?: Options): string;
        public valueArray(options?: Options): any;
        public drop(options?: Options): boolean;
        public get length(): number;
        public includes(key: string, options?: Options): boolean;
        public forEach(fn: Callbackfn<void>, options?: Options): void;
        public map(fn: Callbackfn<any>, options?: Options): any[];
        public some(fn: Callbackfn<unknown>, options?: Options): boolean;
        public every(fn: Callbackfn<unknown>, options?: Options): boolean;
        public sort(fn: Callbackfn<number>, options?: Options): DataSet[];
        public filter(fn: Callbackfn<unknown>, options?: Options): DataSet[];
        public flatMap(fn: Callbackfn<any>, options?: Options): DataSet[];
        public reduce(fn: Reducer, initialValue?: any, options?: Options): DataSet;
        public reduceRight(fn: Reducer, initialValue?: any, options?: Options): DataSet;
        public find(fn: Callbackfn<unknown>): DataSet;
        public findIndex(fn: Callbackfn<unknown>): number;
        public indexOf(searchElement: DataSet, fromIndex?: number): number;
        public toString(): string;
        public toJSON(options?: Options): DataSet[];
        public tables(): { count: number; tables: string[] };

        public export(options: { allTable: true }): { data: { id: number, table: string, data: DataSet[] }[]; mod: string; generatedTimestamp: number; };
        public export(options: { allTable: false }): { data: DataSet[]; mod: string; generatedTimestamp: number; }
        public export(options: { stringify: true }): string;
        public export(options?: { stringify?: boolean, format?: boolean | number, tableName?: string, allTable?: boolean }): { data: DataSet[] | { id: number, table: string, data: DataSet[] }[]; mod: string; generatedTimestamp: number; } | string;
        
        public use(database: SQLite.Database | Database): void;
        public allTableArray(): { id: number; table: string; data: DataSet[] }[];
        public flat(): DataSet[]
    }

    export function static(databaseFile?: string, path?: string, table?: string): Database;

    export const version: string;
}