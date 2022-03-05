import { defineDbConfig } from "../src/functions";

type Meta = {
    title?: string;
    input?: string;
    label?: string;
    help?: string;
    example?: any;
};

export = defineDbConfig<Meta>(({ v }) => {
    return [
        {
            group: "app",
            config: {
                name: v("App Name", {
                    title: "App Name",
                    input: "text",
                    help: "The name of this website."
                }),
                slogan: v("App slogan", {
                    title: "App slogan",
                    input: "text",
                    help: "The slogan of this website."
                }),
                launchYear: v(2020, {
                    title: "Launch year",
                    input: "number",
                    help: "The year this app was launched"
                })
            },
            autoload: true
        },
        {
            group: "exchange",
            config: {
                rates: v({
                    USD_NGN: 560,
                    AED_NGN: 150
                })
            },
            autoload: false
        }
    ];
});
