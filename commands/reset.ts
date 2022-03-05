import type JobHelper from "xpresser/src/Console/JobHelper";
import migrate from "./migrate";
import { getActiveDbConfig } from "../src/functions";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    const CustomDbConfig = getActiveDbConfig($);
    await CustomDbConfig.deleteAll();

    $.logSuccess("Db config cleared... Re-installing...");
    await migrate(args, { helper });
};
