import type { DbConfig } from "../src/db-config";
import type { DBConfiguration } from "../src/custom-types";
import type JobHelper from "xpresser/src/Console/JobHelper";
import {
    ConvertGroupDotKeyToObject,
    ConvertToDBData,
    ConvertToGroupDotKeyArray
} from "../src/functions";

/**
 * Add new configs to database
 */
export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    let dbConfigFile = $.config.get("paths.dbConfig");
    const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

    /**
     * Resolve paths just in-case a smart path is used
     * e.g. backend://, base:// e.t.c
     */
    dbConfigFile = $.path.resolve(dbConfigFile);
    let dbConfig: DBConfiguration = [];

    dbConfig.push({
        group: "__system__",
        autoload: true,
        config: { installed: new Date() }
    });

    /**
     * Try loading db config file.
     */
    try {
        dbConfig = dbConfig.concat(require(dbConfigFile));
    } catch (e: any) {
        return $.logErrorAndExit(e.message);
    }

    /**
     * Process Loaded Db Config
     */
    const dbData = ConvertToDBData(dbConfig);
    const groupDotKey = ConvertToGroupDotKeyArray(dbData);
    const dbGroupDotKey = await CustomDbConfig.groupDotKeyArray();

    const added = await CustomDbConfig.add(dbData);
    let removed: string[] = [];

    /**
     * Check if any configs have been removed if
     * `groupDotKey` & `dbGroupDotKey` is not empty
     */
    if (groupDotKey.length && dbGroupDotKey.length) {
        // find strings that are in dbGroupDotKey but not in groupDotKey to remove them
        removed = dbGroupDotKey.filter((item: string) => !groupDotKey.includes(item));

        if (removed.length) {
            removed.forEach((i) => {
                console.log(`Removed ==> {${i}}`);
            });

            await CustomDbConfig.delete(ConvertGroupDotKeyToObject(removed));
        }
    }

    $.logSuccess(`Added: (${added}) configs to database`);
    if (removed.length) $.logSuccess(`Removed: (${removed.length}) configs from database`);

    return helper.end(true);
};
