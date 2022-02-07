import { DbConfig, GetConfigQuery } from "../../src/db-config";
import type { DbDataArray } from "../../src/custom-types";
import ConfigModel from "./config-model";
import kindOf from "kind-of";

class DbConfigClass extends DbConfig {
    /**
     * Get AutoLoaded Data
     */
    static async autoLoadedConfig() {
        return ConfigModel.find({ autoload: true });
    }

    /**
     * Add Config Option.
     * @param data
     */
    static async add(data: DbDataArray) {
        const all: { group: string; key: string }[] = await ConfigModel.find(
            {},
            { projection: { _id: 0, group: 1, key: 1 } }
        );

        const newData: DbDataArray = [];

        for (const i of data) {
            // Check if config already exists
            if (all.some((a) => a.group === i.group && a.key === i.key)) continue;

            // push new data.
            newData.push(i);

            // Omit log for `__system__`
            if (i.group !== "__system__")
                console.log(`${i.group ? i.group + "." : ""}${i.key} ==>`, i.value);
        }

        // Insert if newData has items.
        if (newData.length) await ConfigModel.native().insertMany(newData);

        // Return number of data received.
        return newData.length;
    }

    /**
     * Get Config
     * @param query
     */
    static async get(query: GetConfigQuery) {
        return ConfigModel.native().findOne(query, { projection: { _id: 0 } });
    }

    /**
     * Set Config
     * @param query
     * @param value
     */
    static async set(query: GetConfigQuery, value: any) {
        return ConfigModel.native().findOneAndUpdate(query, {
            $set: { value, type: kindOf(value) }
        });
    }

    /**
     * Get Group
     * @param group
     */
    static async group(group: string) {
        return ConfigModel.find({ group }, { projection: { _id: 0 } });
    }

    /**
     * Delete Config
     * @param query
     */
    static delete(query: GetConfigQuery | GetConfigQuery[]) {
        if (Array.isArray(query)) {
            return ConfigModel.native().deleteMany({ $or: query });
        }

        return ConfigModel.native().findOneAndDelete(query);
    }

    /**
     * Delete All
     */
    static deleteAll() {
        return ConfigModel.native().deleteMany({});
    }

    /**
     * Get Group key Map
     */
    static async groupDotKeyArray() {
        const configs = await ConfigModel.find(
            { group: { $ne: "__system__" } },
            { projection: { _id: 0, group: 1, key: 1 } }
        );

        return configs.map((c) => (c.group ? `${c.group}.${c.key}` : c.key));
    }
}

export = DbConfigClass;
