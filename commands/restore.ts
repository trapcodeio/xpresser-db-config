import type JobHelper from "xpresser/src/Console/JobHelper";
import { getActiveDbConfig } from "../src/functions";
import { ConfigData } from "../src/custom-types";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;
    let file = args[0] || "db-config-backup";
    file = file + ".json";

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

    const fileContent = $.file.readJson(file) as ConfigData[];

    // set many
    const modifiedCount = await DbConfig.setMany(fileContent);

    $.logSuccess(`(${modifiedCount}/${fileContent.length}) configs RESTORED from:`);
    $.logSuccess(file);

    helper.end(true);
};
