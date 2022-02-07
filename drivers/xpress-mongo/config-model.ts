import { XMongoModel } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

class ConfigModel extends XMongoModel {}

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
