import type { DBConfiguration, DBConfigurationFn, DbData, DbDataArray } from "./custom-types";
import kindOf from "kind-of";
import { Obj } from "object-collection/exports";
import type { DollarSign } from "xpresser/types";
import type { DbConfig } from "./db-config";
import { DbConfigMeta } from "./DbConfigMeta";

/**
 * Define DbConfig Wrapper function
 * @param config
 */
export function defineDbConfig<Meta = any>(config: DBConfigurationFn<Meta> | DBConfiguration) {
    return typeof config === "function" ? config({ v: (v, m) => new DbConfigMeta(v, m) }) : config;
}

/**
 * Get Current Custom DbConfig
 * @param $
 */
export function getActiveDbConfig($: DollarSign) {
    return $.engineData.get("DbConfigClass") as typeof DbConfig;
}

/**s
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
            if (value instanceof DbConfigMeta) {
                // noinspection PointlessBooleanExpressionJS
                const data: DbData = {
                    group,
                    key,
                    value: value.value,
                    type: value.customContext.type || [kindOf(value.value)],
                    autoload: !!autoload
                };

                if (value.meta) data.meta = value.meta;

                dbData.push(data);
            } else {
                // noinspection PointlessBooleanExpressionJS
                dbData.push({
                    group,
                    key,
                    value,
                    type: [kindOf(value)],
                    autoload: !!autoload
                });
            }
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

    return data.all() as any;
}

/**
 * Convert Data to array of group.key strings.
 * @param dbDataArray
 * @constructor
 */
export function ConvertToGroupDotKeyArray(dbDataArray: DbDataArray) {
    const groupDotKey: string[] = [];

    for (const d of dbDataArray) {
        // ignore if __system__
        if (d.group === "__system__") continue;

        // convert to group.key
        if (d.group) {
            groupDotKey.push(`${d.group}.${d.key}`);
        } else {
            groupDotKey.push(d.key);
        }
    }

    return groupDotKey;
}

/**
 * Convert group.key to object {group: string, key: string}
 */
export function ConvertGroupDotKeyToObject(groupDotKey: string[]) {
    const groupKey: { group: string; key: string }[] = [];

    for (const gk of groupDotKey) {
        const [group, key] = gk.split(".");

        groupKey.push({ group, key });
    }

    return groupKey;
}
