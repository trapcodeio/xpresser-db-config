import { DbConfig, GetConfigQuery } from "../../src/DbConfig";
import type { DbDataArray } from "../../src/custom-types";
import ConfigModel from "./ConfigModel";

class DbConfigClass extends DbConfig {
    static async fetchAutoLoadedData() {
        return ConfigModel.find({ autoload: true });
    }

    static async addConfig(data: DbDataArray) {
        const all: { group: string; key: string }[] = await ConfigModel.find(
            {},
            { projection: { _id: 0, group: 1, key: 1 } }
        );

        const newData: DbDataArray = [];

        for (const i of data) {
            // Check if config already exists
            if (all.some((a) => a.group === i.group && a.key === i.key)) continue;
            newData.push(i);

            if (i.group !== "__system__")
                console.log(`${i.group ? i.group + "." : ""}${i.key} ==>`, i.value);
        }

        await ConfigModel.native().insertMany(data);

        return newData.length;
    }

    static async getConfig(query: GetConfigQuery) {
        return ConfigModel.native().findOne(query, { projection: { _id: 0 } });
    }

    static async setConfig(query: GetConfigQuery, value: any) {
        return ConfigModel.native().findOneAndUpdate(query, { $set: { value } });
    }

    static async getGroup(group: string) {
        return ConfigModel.find({ group }, { projection: { _id: 0 } });
    }

    static deleteAll() {
        return ConfigModel.native().deleteMany({});
    }
}

export = DbConfigClass;
