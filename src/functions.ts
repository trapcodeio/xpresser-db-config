import type { DBConfiguration, DbDataArray } from "./custom-types";
import kindOf from "kind-of";
import { Obj } from "object-collection/exports";

/**
 *
 * @param configs
 * @constructor
 */
export function ConvertToDBData(configs: DBConfiguration) {
    if (!Array.isArray(configs)) throw new Error(`Db config file must return an array!`);

    const dbData: DbDataArray = [];

    for (const config of configs) {
        let { group, config: children, autoload } = config;

        const entries = Object.entries(children);

        for (const [key, value] of entries) {
            dbData.push({
                group,
                key,
                value,
                type: kindOf(value),
                autoload
            });
        }
    }

    return dbData;
}

/**
 * Convert Data from db to object.
 * @param dbData
 * @constructor
 */
export function ConvertDbDataToObject(dbData: DbDataArray) {
    const data = Obj({});

    for (const d of dbData) {
        if (d.group) {
            data.path(d.group).set(d.key, d.value);
        } else {
            data.set(d.key, d.value);
        }
    }

    return data.all();
}
