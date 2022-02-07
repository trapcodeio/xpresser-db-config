import type { DollarSign } from "xpresser/types";
import type JobHelper from "xpresser/src/Console/JobHelper";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $: DollarSign = helper.$;

    $.logDeprecated(
        "0.0.18",
        "0.0.18",
        "{{dbc:install}} is deprecated, use {{dbc:migrate}} instead"
    );

    helper.end(true);
};
