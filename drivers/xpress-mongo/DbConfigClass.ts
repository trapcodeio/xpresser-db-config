import { DbConfig, GetConfigQuery } from "../../src/DbConfig";
import type { DbDataArray } from "../../src/custom-types";
import ConfigModel from "./ConfigModel";

class DbConfigClass extends DbConfig {
    /**
     * Get AutoLoaded Data
     */
    static async getAutoLoadedConfig() {
        return ConfigModel.find({ autoload: true });
    }

    /**
     * Add Config Option.
     * @param data
     */
    static async addConfig(data: DbDataArray) {
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

        // Return number of data received..
        return newData.length;
    }

    /**
     * Get Config
     * @param query
     */
    static async getConfig(query: GetConfigQuery) {
        return ConfigModel.native().findOne(query, { projection: { _id: 0 } });
    }

    /**
     * Set Config
     * @param query
     * @param value
     */
    static async setConfig(query: GetConfigQuery, value: any) {
        return ConfigModel.native().findOneAndUpdate(query, { $set: { value } });
    }

    /**
     * Get Group
     * @param group
     */
    static async getGroup(group: string) {
        return ConfigModel.find({ group }, { projection: { _id: 0 } });
    }

    /**
     * Delete All
     */
    static deleteAll() {
        return ConfigModel.native().deleteMany({});
    }
}

export = DbConfigClass;
