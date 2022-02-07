import type { DBConfiguration } from "../src/custom-types";

export = <DBConfiguration>[
    {
        group: "app",
        config: {
            name: "App Name",
            slogan: "App slogan",
            launchYear: 2020
        },
        autoload: true
    },
    {
        group: "exchange",
        config: {
            rates: {
                USD_NGN: 560,
                AED_NGN: 150
            }
        },
        autoload: false
    }
];
