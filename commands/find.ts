import type { DollarSign } from "xpresser/types";
import type JobHelper from "xpresser/src/Console/JobHelper";
import { DbConfig } from "../src/db-config";
import { DbData } from "../src/custom-types";

export = async (args: string[], { helper: h }: { helper: JobHelper }) => {
    const $: DollarSign = h.$;
    // Get Args
    const [find] = args;

    // If no find argument
    if (!find) return $.logErrorAndExit("Please provide a config to find.");

    // Get DbConfig Class
    const dbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

    // Log
    $.logCalmly(`Find: "${find}"`);

    // Parse Group.key
    let group: string | undefined;
    let key: string | undefined;

    if (find.includes(".")) {
        [group, key] = find.split(".");
    } else {
        group = find;
    }

    // Define Configs
    let configs = await (key
        ? dbConfig.get<DbData>({ group, key })
        : dbConfig.group<DbData>(group));

    // if config is an array use table else log
    if (Array.isArray(configs)) {
        if (configs.length) {
            // Trim long string configs
            for (const config of configs) {
                if (typeof config.value === "string" && config.value.length > 250) {
                    config.value = config.value.slice(0, 250) + "...";
                }

                delete (config as any).type;
            }

            console.table(configs);
            return $.logSuccess(`Found ${configs.length} configs.`);
        }
    } else if (configs) {
        console.dir({ [configs.group + "." + configs.key]: configs.value }, { depth: 5 });
        return h.end(true);
    }

    return $.logErrorAndExit(`No config found for "${find}"`);
};
