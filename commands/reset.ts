import { DollarSign } from "xpresser/types";
import { DbConfig } from "../src/DbConfig";
import install from "./install";

export = async (args: string[], { helper }: any) => {
    const $: DollarSign = helper.$;
    const CustomDbConfig = $.engineData.get("DbConfigClass") as typeof DbConfig;

    await CustomDbConfig.deleteAll();

    $.logSuccess("Db config cleared... Re-installing...");
    await install(args, { helper });
};
