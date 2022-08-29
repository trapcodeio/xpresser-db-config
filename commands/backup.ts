import type JobHelper from "xpresser/src/Console/JobHelper";
import { getActiveDbConfig } from "../src/functions";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    const backupFolder = $.path.resolve($.config.get("paths.dbConfigBackupFolder"));
    $.file.makeDirIfNotExist(backupFolder);

    const CustomDbConfig = getActiveDbConfig($);

    // backup only
    const all = (await CustomDbConfig.getAll()).map((item) => ({
        group: item.group,
        key: item.key,
        value: item.value
    }));

    // const now = new Date();

    const file = $.path.resolve([
        backupFolder,
        // `${now.getTime()}-${now.toLocaleDateString().split("/").join("-")}.json`
        "db-config-backup.json"
    ]);

    $.file.saveToJson(file, all, {
        checkIfFileExists: false
    });

    $.logSuccess(`Db config backed up to:`);
    $.logSuccess(file);

    helper.end(true);
};
