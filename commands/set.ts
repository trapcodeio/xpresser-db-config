import type JobHelper from "xpresser/src/Console/JobHelper";
import { ConvertGroupDotKeyToObject, getActiveDbConfig } from "../src/functions";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;
    const [groupDotKey, value] = args;

    if (!groupDotKey) return $.logErrorAndExit(`"group.key" kind of query is required`);
    if (!value) return $.logErrorAndExit("value is required");

    // Get DbConfig Class
    const dbConfig = getActiveDbConfig($);
    const query = ConvertGroupDotKeyToObject([groupDotKey])[0];
    const config = await dbConfig.get(query);

    if (!config) return $.logErrorAndExit(`Config: "${groupDotKey}" not found!`);

    if (!["string", "number"].includes(config.type)) {
        return $.logErrorAndExit(`Config: "${groupDotKey}" is not a string or number!`);
    }

    if (config.type === "string") {
        config.value = value;
    } else if (config.type === "number") {
        config.value = Number(value);
    }

    // Set value
    await dbConfig.set(query, config.value);

    $.logSuccess(`Config: "${groupDotKey}" set to`, config.value);

    helper.end(true);
};
