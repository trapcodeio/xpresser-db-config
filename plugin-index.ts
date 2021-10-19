import { DollarSign } from "xpresser/types";
import type DbConfig from "./src/DbConfig";
import { ConvertDbDataToObject } from "./src/Converters";

/**
 * Xpresser runs this function before $.on.boot
 * after $.on.boot
 */

export function run({ namespace }: any, $: DollarSign) {
    let dbConfigFile = $.config.get("paths.dbConfig");

    if (!dbConfigFile) return $.logErrorAndExit(`${namespace}: Config {paths.dbConfig} is missing`);

    /**
     * Put process on boot.
     */
    $.on.boot(async (next) => {
        const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

        // Get auto loaded data
        const autoLoaded = await CustomDbConfig.fetchAutoLoadedData();

        // if no auto loaded data and xpresser is not running in console mood
        if (!autoLoaded) {
            if (!$.options.isConsole)
                $.logWarning(`db-config is not yet installed. Run "xjs dbconfig:install" `);

            return next();
        }

        /**
         * Save AutoLoaded data to memory
         */
        $.engineData.set("AutoLoadedDbConfig", ConvertDbDataToObject(autoLoaded));
        $.logSuccess("AutoLoaded Config successfully.");

        return next();
    });
}
