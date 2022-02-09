import { Controller, Http } from "xpresser/types/http";
import { getConfigGroup } from "../../index";

/**
 * AppController
 */
export = <Controller.Object>{
    // Controller Name
    name: "TestController",

    // Controller Default Error Handler.
    e: (http: Http, error: string) => http.status(401).json({ error }),

    /**
     * Example Action.
     * @param http - Current Http Instance
     */
    async index(http) {
        return http.send({
            app: await getConfigGroup("app", ["slogan", "name"]),
            exchange: await getConfigGroup("exchange")
        });
    }
};
