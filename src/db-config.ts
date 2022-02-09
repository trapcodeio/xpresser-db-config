// noinspection JSUnusedLocalSymbols

import type { DbDataArray } from "./custom-types";

export type GetConfigQuery = { group?: string; key: string };

export class DbConfig {
    /**
     * AutoLoaded Data Getter.
     */
    static async autoLoadedConfig(): Promise<any | undefined> {
        return undefined;
    }

    static async add(data: DbDataArray): Promise<number | undefined> {
        // save to your db
        return undefined;
    }

    static async get<R = any>(query: GetConfigQuery): Promise<R | undefined> {
        return undefined;
    }

    static async set(query: GetConfigQuery, value: any): Promise<any> {
        return undefined;
    }

    static async group<R = any>(group: string, keys?: string[]): Promise<Array<R> | undefined> {
        return [];
    }

    static delete(query: GetConfigQuery | GetConfigQuery[]): Promise<any> {
        return undefined as any;
    }

    static async deleteAll(): Promise<any> {
        return undefined;
    }

    static async groupDotKeyArray(): Promise<string[]> {
        return [];
    }
}
