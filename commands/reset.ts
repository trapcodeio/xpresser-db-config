import type { DbConfig } from "../src/db-config";
import type JobHelper from "xpresser/src/Console/JobHelper";
import migrate from "./migrate";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;
    await CustomDbConfig.deleteAll();

    $.logSuccess("Db config cleared... Re-installing...");
    await migrate(args, { helper });
};
