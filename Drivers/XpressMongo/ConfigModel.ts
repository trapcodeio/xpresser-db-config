import { XMongoModel } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

class ConfigModel extends XMongoModel {}

/**
 * Map Model to Collection: `configs`
 * .native() will be made available for use.
 */
UseCollection(ConfigModel, "db-configs");

// Export Model as Default
export default ConfigModel;
