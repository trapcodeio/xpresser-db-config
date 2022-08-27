import type JobHelper from "xpresser/src/Console/JobHelper";
import { getActiveDbConfig } from "../src/functions";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    const backupFolder = $.path.resolve($.config.get("paths.dbConfigBackupFolder"));
    $.file.makeDirIfNotExist(backupFolder);

    const CustomDbConfig = getActiveDbConfig($);
    const all = await CustomDbConfig.getAll();

    // const now = new Date();

    const file = $.path.resolve([
        backupFolder,
        // `${now.getTime()}-${now.toLocaleDateString().split("/").join("-")}.json`
        "db-config-backup.json"
    ]);

    $.file.saveToJson(file, all, {
        checkIfFileExists: false
    });

    $.logSuccess(`Db config backed up to ${file}`);

    helper.end(true);
};
