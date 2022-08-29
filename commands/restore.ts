import type JobHelper from "xpresser/src/Console/JobHelper";
import { getActiveDbConfig } from "../src/functions";
import { DbData } from "../src/custom-types";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;
    let file = args[0] || "db-config-backup.json";

    const backupFolder = $.path.resolve($.config.get("paths.dbConfigBackupFolder"));
    file = $.path.resolve([backupFolder, file]);

    if (!$.file.exists(file)) {
        return $.logErrorAndExit(`Backup File not found: ${file}`);
    }

    const DbConfig = getActiveDbConfig($);
    const keys = await DbConfig.groupDotKeyArray();

    if (!keys.length) {
        return $.logErrorAndExit(`Database must be migrated before restoring.`);
    }

    const fileContent = $.file.readJson(file) as Pick<DbData, "group" | "key" | "value">[];

    for (const config of fileContent) {
        const { group, key, value } = config;
        await DbConfig.set({ group, key }, value);
        console.log(`${group}.${key} =>`, value);
    }

    $.logSuccess(`Db config RESTORED from:`);
    $.logSuccess(file);

    helper.end(true);
};
