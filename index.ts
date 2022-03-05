/**
 * This file contains exports that will be required frequently
 */
import { getInstance } from "xpresser";
import { Obj } from "object-collection/exports";
import { GetConfigQuery } from "./src/db-config";
import { ConvertDbDataToObject, getActiveDbConfig } from "./src/functions";
import type { DbData } from "./src/custom-types";

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

// Get CustomDbConfig class
const CustomDbConfig = getActiveDbConfig($);

/**
 * Get an auto-loaded config value.
 * @param id
 * @param def
 */
export function autoLoadedConfig<R = any>(id: string, def?: R): R {
    return lodash.get(autoLoaded.sync, id, def);
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

    const result = await CustomDbConfig.get<DbData>(where);

    if (!result) return def;

    return result.value as R;
}

/**
 * Get a config group
 * @param group
 * @param keys
 */
export async function getConfigGroup<R = any>(group: string, keys?: string[]) {
    const result = await CustomDbConfig.group<DbData>(group, keys);

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
    await CustomDbConfig.set(where, value);

    // if auto loaded data has id, update value.
    if (lodash.has(autoLoaded.sync, id)) {
        lodash.set(autoLoaded.sync, id, value);
    }
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
