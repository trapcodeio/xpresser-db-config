import { DollarSign } from "xpresser/types";
import {
    ConvertDbDataToObject,
    ConvertToDBData,
    ConvertToGroupDotKeyArray,
    getActiveDbConfig
} from "./src/functions";
import { DBConfiguration } from "./src/custom-types";

/**
 * Xpresser runs this function before $.on.boot
 * after $.on.boot
 */

export async function run({ namespace }: any, $: DollarSign) {
    /**
     * Don't initialize plugin if is NativeCommands
     */
    if ($.isNativeCliCommand()) return;

    /**
     * Check if required config paths is defined.
     */
    const paths = $.config.get("paths");

    if (!paths.dbConfig)
        return $.logErrorAndExit(`${namespace}: Config {paths.dbConfig} is missing.`);

    if (!paths.dbConfigClass)
        return $.logErrorAndExit(`${namespace}: Config {paths.dbConfigClass} is missing.`);

    $.ifIsConsole(() => {
        const isBackupCommand =
            process.argv.includes("dbc:backup") || process.argv.includes("dbc:restore");

        if (isBackupCommand) {
            if (!paths.dbConfigBackupFolder)
                return $.logErrorAndExit(
                    `${namespace}: Config {paths.dbConfigBackupFolder} is missing.`
                );
        }
    });

    /**
     * Process On Boot
     * 1. Load & Save Custom DbConfigDriver
     */

    // Load Custom DbConfigDriver
    try {
        const resolvedDbConfigClassFile = $.path.resolve(paths.dbConfigClass);
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

    /**
     * Autoload config on boot.
     */
    $.on.boot(async (next) => {
        // Get Class from engine data.
        const CustomDbConfig = getActiveDbConfig($);

        // Get auto loaded data
        const autoLoaded = await CustomDbConfig.autoLoadedConfig();

        // if no autoloaded data and xpresser is not running in console mood
        if (!autoLoaded || !autoLoaded.length) {
            if (!$.options.isConsole)
                $.logWarning(`db-config is not yet installed. Run "xjs dbc:migrate" `);

            return next();
        }

        /**
         * Save AutoLoaded data to memory
         */
        $.engineData.set("AutoLoadedDbConfigRaw", autoLoaded);
        $.engineData.set("AutoLoadedDbConfig", ConvertDbDataToObject(autoLoaded));

        /**
         * Check for changes in db config
         */
        let dbConfigFile = $.config.get("paths.dbConfig");
        /**
         * Try loading db config file.
         */
        let dbConfig: DBConfiguration = [];
        try {
            dbConfig = require($.path.resolve(dbConfigFile));
            // check if dbConfig is object and has default key.
            if (!Array.isArray(dbConfig) && typeof dbConfig === "object" && dbConfig["default"]) {
                dbConfig = dbConfig["default"];
            }
        } catch (e: any) {
            return $.logErrorAndExit(e.message);
        }

        const definedConfigs = ConvertToGroupDotKeyArray(ConvertToDBData(dbConfig));
        const dbConfigs = await CustomDbConfig.groupDotKeyArray();

        // if both arrays does not have same items then there are changes
        const message = `db-config has been updated. Run "xjs dbc:migrate" to update.`;
        if (definedConfigs.length !== dbConfigs.length) $.logWarning(message);
        else if (!definedConfigs.every((item) => dbConfigs.includes(item))) $.logWarning(message);

        $.ifNotConsole(() => {
            $.logSuccess("AutoLoaded DbConfigDriver successfully.");
        });

        return next();
    });
}
