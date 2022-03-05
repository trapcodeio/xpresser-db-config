import { is, ObjectId, XMongoModel, XMongoSchema } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import type { DbData } from "../../src/custom-types";

type ConfigModelData = DbData & { _id: ObjectId };

class ConfigModel extends XMongoModel {
    static schema: XMongoSchema<ConfigModelData> = {
        group: is.String().optional(),
        key: is.String().required(),
        value: is.Any().required(),
        type: is.String().optional(),
        meta: is.Object().optional(),
        autoload: is.Boolean().optional()
    };
}

/**
 * Map Model to Collection: `configs`
 * .native() will be made available for use.
 */
UseCollection(ConfigModel, "db-configs");

Promise.all([
    ConfigModel.native().createIndex({ key: 1 }),
    ConfigModel.native().createIndex({ group: 1 }),
    ConfigModel.native().createIndex({ group: 1, key: 1 }),
    ConfigModel.native().createIndex({ autoload: 1 })
]).catch(console.log);

// Export Model as Default
export default ConfigModel;
