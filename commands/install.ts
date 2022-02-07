import type JobHelper from "xpresser/src/Console/JobHelper";

export = async (args: string[], { helper }: { helper: JobHelper }) => {
    const $ = helper.$;

    $.logDeprecated(
        "0.0.18",
        "0.0.18",
        "{{dbc:install}} is deprecated, use {{dbc:migrate}} instead"
    );

    helper.end(true);
};
