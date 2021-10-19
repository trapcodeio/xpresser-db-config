import { DollarSign } from "xpresser/types";
import { DbConfig } from "../src/DbConfig";
import type { DBConfiguration } from "../src/custom-types";
import { ConvertToDBData } from "../src/functions";

export = async (args: string[], { helper }: any) => {
    const $: DollarSign = helper.$;
    let dbConfigFile = $.config.get("paths.dbConfig");

    const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

    /**
     * Resolve paths just in-case a smart path is used
     * e.g backend://, base:// e.t.c
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
    await CustomDbConfig.addConfig(dbData);

    $.logSuccess("Db Configs successfully added to database.");
    return helper.end(true);
};
