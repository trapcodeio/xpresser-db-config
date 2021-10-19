import { DbConfig, GetConfigQuery } from "../../src/DbConfig";
import type { DbDataArray } from "../../src/custom-types";
import ConfigModel from "./ConfigModel";

class DbConfigClass extends DbConfig {
    static async fetchAutoLoadedData() {
        return ConfigModel.find({ autoload: true });
    }

    static async addConfig(data: DbDataArray) {
        await ConfigModel.native().deleteMany({});
        await ConfigModel.native().insertMany(data);

        return true;
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
}

export = DbConfigClass;
