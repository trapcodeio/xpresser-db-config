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

    const allowedTypes = ["string", "number", "boolean"];
    if (!allowedTypes.includes(config.type)) {
        return $.logErrorAndExit(`Config: "${groupDotKey}" must be type of ${allowedTypes.join(", ")}!`);
    }

    if (config.type === "string") {
        config.value = value;
    } else if (config.type === "number") {
        config.value = Number(value);
    } else if (config.type === "boolean") {
        config.value = value.toLowerCase() === "true";
    }

    // Set value
    await dbConfig.set(query, config.value);

    $.logSuccess(`Config: "${groupDotKey}" set to`, config.value);

    helper.end(true);
};
