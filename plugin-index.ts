import { DollarSign } from "xpresser/types";
import { DbConfig } from "./src/DbConfig";
import { ConvertDbDataToObject } from "./src/functions";

/**
 * Xpresser runs this function before $.on.boot
 * after $.on.boot
 */

export function run({ namespace }: any, $: DollarSign) {
    /**
     * Don't initialize plugin if is NativeCommands
     */
    if ($.isNativeCliCommand()) return;

    /**
     * Check if required config paths is defined.
     */
    const dbConfigFile = $.config.get("paths.dbConfig");
    if (!dbConfigFile)
        return $.logErrorAndExit(`${namespace}: Config {paths.dbConfig} is missing.`);

    const dbConfigClassFile = $.config.get("paths.dbConfigClass");
    if (!dbConfigClassFile)
        return $.logErrorAndExit(`${namespace}: Config {paths.dbConfigClass} is missing.`);

    /**
     * Process On Boot
     * 1. Load & Save Custom DbConfigClass
     */
    $.on.boot(async (next) => {
        // Load Custom DbConfigClass
        try {
            const resolvedDbConfigClassFile = $.path.resolve(dbConfigClassFile);
            const CustomClass = require(resolvedDbConfigClassFile);

            if (!CustomClass) {
                throw new Error(
                    `Custom DbConfigClass file must return a class @ ${resolvedDbConfigClassFile}`
                );
            }

            // Save class to xpresser engine data memory.
            $.engineData.set("DbConfigClass", CustomClass);
        } catch (e: any) {
            $.logErrorAndExit(e.message);
        }

        // Get Class from engine data.
        const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

        // Get auto loaded data
        const autoLoaded = await CustomDbConfig.getAutoLoadedConfig();

        // if no auto loaded data and xpresser is not running in console mood
        if (!autoLoaded || !autoLoaded.length) {
            if (!$.options.isConsole)
                $.logWarning(`db-config is not yet installed. Run "xjs dbconfig:install" `);

            return next();
        }

        /**
         * Save AutoLoaded data to memory
         */
        $.engineData.set("AutoLoadedDbConfigRaw", autoLoaded);
        $.engineData.set("AutoLoadedDbConfig", ConvertDbDataToObject(autoLoaded));

        $.ifNotConsole(() => {
            $.logSuccess("AutoLoaded DbConfig successfully.");
        });

        return next();
    });
}
