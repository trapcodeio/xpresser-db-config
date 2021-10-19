// noinspection JSUnusedLocalSymbols

import type { DbDataArray } from "./custom-types";

export type GetConfigQuery = { group?: string; key: string };

export class DbConfig {
    /**
     * AutoLoaded Data Getter.
     */
    static async fetchAutoLoadedData(): Promise<any | undefined> {
        return undefined;
    }

    static async addConfig(data: DbDataArray): Promise<boolean | undefined> {
        // save to your db
        return undefined;
    }

    static async getConfig<R = any>(query: GetConfigQuery): Promise<R | undefined> {
        return undefined;
    }

    static async setConfig(query: GetConfigQuery, value: any): Promise<any> {
        return undefined;
    }

    static async getGroup<R = any>(group: string): Promise<Array<R> | undefined> {
        return [];
    }
}
