/**
 * This file contains exports that will be required frequently
 */
import { getInstance } from "xpresser";
import { Obj } from "object-collection/exports";
import { GetConfigQuery } from "./src/db-config";
import { ConvertDbDataToObject, getActiveDbConfig } from "./src/functions";
import type { ConfigData, DbData } from "./src/custom-types";

const $ = getInstance();

/**
 * Check DBConfigClass has been set
 */
if (!$.engineData.has("DbConfigClass")) {
    throw Error(`Trying to access db-config helpers before initialization!`);
}

// Get lodash
const lodash = $.modules.lodash();

// Get synced autoloaded functions
const autoLoaded = $.engineData.sync("AutoLoadedDbConfig");

// Get activeDbConfig class
const activeDbConfig = getActiveDbConfig($);

/**
 * Get an auto-loaded config value.
 * @param id
 * @param def
 */
export function autoLoadedConfig<R = any>(id: string, def?: R): R {
    return lodash.get(autoLoaded.sync, id, def);
}

/**
 * Refresh autoloaded config
 */
export async function refreshAutoLoadedConfig() {
    const autoLoaded = await activeDbConfig.autoLoadedConfig();
    $.engineData.set("AutoLoadedDbConfigRaw", autoLoaded);
    $.engineData.set("AutoLoadedDbConfig", ConvertDbDataToObject(autoLoaded));
}

/**
 * Get all auto-loaded config data as a collection
 */
export function autoLoadedConfigAsCollection() {
    return Obj(autoLoaded.sync);
}

/**
 * Get a config (Both Auto loaded and not autoloaded)
 * @param id
 * @param def
 */
export async function getConfig<R = any>(id: string, def?: R): Promise<R | undefined> {
    const autoLoadedConfig = autoLoadedConfigAsCollection();

    if (autoLoadedConfig.has(id)) {
        return autoLoadedConfig.get(id, def);
    }

    // Build query that will match db result
    const where: GetConfigQuery = { key: id };

    if (id.includes(".")) {
        const dots = id.split(".");

        where.group = dots[0];
        where.key = dots[1];
    }

    const result = await activeDbConfig.get<DbData>(where);

    if (!result) return def;

    return result.value as R;
}

/**
 * Get a config group
 * @param group
 * @param keys
 */
export async function getConfigGroup<R = any>(group: string, keys?: string[]) {
    const result = await activeDbConfig.group<DbData>(group, keys);

    if (!result) return {} as R;

    return ConvertDbDataToObject(result)[group] as R;
}

/**
 * Get a config group as an object collection.
 * @param group
 */
export async function getConfigGroupAsCollection(group: string) {
    const data = await getConfigGroup(group);
    return Obj(data);
}

/**
 * Set config value.
 * @param id
 * @param value
 */
export async function setConfig(id: string, value: any) {
    // Build query that will match db result
    const where = makeConfigQuery(id);

    // Call set
    await activeDbConfig.set(where, value);

    // if auto loaded data has id, update value.
    if (lodash.has(autoLoaded.sync, id)) {
        lodash.set(autoLoaded.sync, id, value);
    }
}

/**
 * Set Many config values.
 */
export async function setManyConfig(many: ConfigData[] | Record<string, any>) {
    let modifiedCount = 0;
    if (Array.isArray(many)) {
        modifiedCount = await activeDbConfig.setMany(many);
    } else {
        const data: ConfigData[] = [];

        for (const key in many) {
            data.push({
                ...makeConfigQuery(key),
                value: many[key]
            });
        }

        modifiedCount = await activeDbConfig.setMany(data);
    }

    // Refresh auto loaded data
    await refreshAutoLoadedConfig();

    return modifiedCount;
}

/**
 * Make config query from this
 * @param id
 */
function makeConfigQuery(id: string) {
    // Build query that will match db result
    const where: GetConfigQuery = { key: id };

    if (id.includes(".")) {
        const dots = id.split(".");

        where.group = dots[0];
        where.key = dots[1];
    }

    return where;
}
