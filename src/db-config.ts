// noinspection JSUnusedLocalSymbols

import type { DbDataArray } from "./custom-types";

export type GetConfigQuery = { group?: string; key: string };

export interface DbConfigDriver {
    /**
     * AutoLoaded Data Getter.
     */
    autoLoadedConfig(): Promise<any | undefined>;

    /**
     * Add Config
     * @param data
     */
    add(data: DbDataArray): Promise<number | undefined>;

    /**
     * Get Config
     * @param query
     */
    get<R = any>(query: GetConfigQuery): Promise<R | undefined>;

    /**
     * Get all
     */
    getAll(): Promise<DbDataArray>;

    /**
     * Set Config
     * @param query
     * @param value
     */
    set(query: GetConfigQuery, value: any): Promise<any>;

    /**
     * Get Config Group
     */
    group<R = any>(group: string, keys?: string[]): Promise<Array<R> | undefined>;

    /**
     * Delete Config
     * @param query
     */
    delete(query: GetConfigQuery | GetConfigQuery[]): Promise<any>;

    /**
     * Delete All
     */
    deleteAll(): Promise<any>;

    /**
     * Get Group key Map
     */
    groupDotKeyArray(): Promise<string[]>;
}

export function DbConfigDriver(config: DbConfigDriver) {
    return config;
}
