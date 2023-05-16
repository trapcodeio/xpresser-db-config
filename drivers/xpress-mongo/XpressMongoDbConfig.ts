import { DbConfigDriver, GetConfigQuery } from "../../src/db-config";
import type { DbDataArray } from "../../src/custom-types";
import ConfigModel from "./ConfigModel";
import { ConfigData } from "../../src/custom-types";

export = DbConfigDriver({
    /**
     * Get AutoLoaded Data
     */
    async autoLoadedConfig() {
        return ConfigModel.find({ autoload: true });
    },

    /**
     * Add Config Option.
     * @param data
     */
    async add(data: DbDataArray) {
        const all: { group: string | null; key: string }[] = await ConfigModel.find(
            {},
            { projection: { _id: 0, group: 1, key: 1 } }
        );

        const newData: DbDataArray = [];

        for (const i of data) {
            // Check if config already exists
            if (i.group && all.some((a) => a.group === i.group && a.key === i.key)) continue;
            else if (!i.group && all.some((a) => a.key === i.key)) continue;

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
    },

    /**
     * Get Config
     * @param query
     */
    async get(query: GetConfigQuery) {
        return ConfigModel.native().findOne(query, { projection: { _id: 0 } });
    },

    /**
     * Set Config
     * @param query
     * @param value
     */
    async set(query: GetConfigQuery, value: any) {
        return ConfigModel.native().findOneAndUpdate(query, {
            $set: { value }
        });
    },

    /**
     * Set Many Config
     * @param data
     */
    async setMany(data: ConfigData[]) {
        let set = 0;

        // generate bulk update query.
        const bulkWriteQuery = data.map((i) => {
            const filter = i.group ? { group: i.group, key: i.key } : { key: i.key };

            return {
                updateOne: {
                    filter,
                    update: { $set: { value: i.value } }
                }
            };
        });

        // execute bulk update.
        if (bulkWriteQuery.length) {
            const result = await ConfigModel.native().bulkWrite(bulkWriteQuery);
            set = result.modifiedCount;
        }

        return set;
    },

    /**
     * Get Group
     * @param group
     * @param keys
     */
    async group(group: string, keys?: string[]) {
        const query = keys ? { group, key: { $in: keys } } : { group };
        return ConfigModel.find(query, { projection: { _id: 0 } });
    },

    /**
     * Delete Config
     * @param query
     */
    delete(query: GetConfigQuery | GetConfigQuery[]) {
        if (Array.isArray(query)) {
            return ConfigModel.native().deleteMany({ $or: query });
        }

        return ConfigModel.native().findOneAndDelete(query);
    },

    /**
     * Delete All
     */
    deleteAll() {
        return ConfigModel.native().deleteMany({});
    },

    /**
     * Get all configs
     */
    async getAll() {
        return await ConfigModel.find({ group: { $ne: "__system__" } }, { projection: { _id: 0 } });
    },

    /**
     * Get Group key Map
     */
    async groupDotKeyArray() {
        const configs = await this.getAll();

        return configs.map((c) => (c.group ? `${c.group}.${c.key}` : c.key));
    }
});
