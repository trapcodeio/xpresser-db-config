import { DbData } from "./Converters";
import { DollarSign } from "xpresser/types";

class DbConfig {
    /**
     * AutoLoaded Data Getter.
     */
    static async fetchAutoLoadedData(): Promise<any | undefined> {
        return undefined;
    }

    static async addConfig(data: DbData): Promise<boolean | undefined> {
        // save to your db
        return undefined;
    }

    // static async updateConfig(data: DBConfiguration): Promise<>
    static onBoot(next: () => void, $: DollarSign) {
        $.engineData.set("DbConfigClass", this);
        return next();
    }
}

export = DbConfig;
