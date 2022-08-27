// noinspection JSUnusedLocalSymbols

import type { DbDataArray } from "./custom-types";

export type GetConfigQuery = { group?: string; key: string };

export declare class DbConfig {
    /**
     * AutoLoaded Data Getter.
     */
    static autoLoadedConfig(): Promise<any | undefined>;

    /**
     * Add Config
     * @param data
     */
    static add(data: DbDataArray): Promise<number | undefined>;

    /**
     * Get Config
     * @param query
     */
    static get<R = any>(query: GetConfigQuery): Promise<R | undefined>;

    /**
     * Get all
     */
    static getAll(): Promise<DbDataArray>;

    /**
     * Set Config
     * @param query
     * @param value
     */
    static set(query: GetConfigQuery, value: any): Promise<any>;

    /**
     * Get Config Group
     */
    static group<R = any>(group: string, keys?: string[]): Promise<Array<R> | undefined>;

    /**
     * Delete Config
     * @param query
     */
    static delete(query: GetConfigQuery | GetConfigQuery[]): Promise<any>;

    /**
     * Delete All
     */
    static deleteAll(): Promise<any>;

    /**
     * Get Group key Map
     */
    static groupDotKeyArray(): Promise<string[]>;
}

// export function DbConfig(config: DbConfig){
//     return config;
// }
