import { init } from "xpresser";

/**
 * Initialize Test Server
 */
const $ = init({
    name: "Test DbConfig Plugin",
    env: "development",

    paths: {
        base: __dirname,
        backend: __dirname,
        npm: "base://../node_modules",

        // Add db config path.
        dbConfig: "backend://db-config",
        dbConfigClass: "backend://../drivers/xpress-mongo/XpressMongoDbConfig",
        dbConfigBackupFolder: "base://storage/db-config"
    },

    // dbConfig: {
    //     autoload: true
    // },

    /**
     * If Enabled, xjs make:model will generate Models
     * that requires you to define all data types.
     */
    useStrictTypescriptModels: true, // >=v1.0.0

    // Connection Config
    mongodb: {
        url: "mongodb://127.0.0.1:27017",
        database: "db-config",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}).initializeTypescript(__filename);

$.on.boot((next) => {
    $.router.get("/", "Test@index");
    next();
});

// Boot
$.boot();
