# Xpresser Db Config

#### STILL IN DEVELOPMENT

Every app that connects to a database at some point saves some configuration data that should be modified by the
application.

This plugin makes that process easy for you.

- Provide driver to use any Database.
- Autoload configs in memory
- AutoUpdate configs in realtime with changes.
- Provide access functions to get configs.

## Looks Like

File: db-config.js (Where default db configuration is defined)

```javascript
module.exports = [
  // standalone configs
  {
    config: {
      allowLogin: true,
      backup: true,
      cronjobs: false,
    },
    autoload: true,
  },
  // Grouped configs
  {
    group: 'app',
    config: {
      name: 'App Name',
      slogan: 'App slogan',
    },
    autoload: true,
  },
];

/// Will be saved to memory as.
({
  allowLogin: true,
  backup: true,
  cronjobs: false,
  app: {
    name: 'App Name',
    slogan: 'App slogan',
  },
});

/// Will be stored to your configured db as
[
  {key: 'allowLogin', value: true, type: 'boolean', autoload: true, ...},
  {key: 'backup', value: true, type: 'boolean', autoload: true, ...},
  {key: 'cronjobs', value: false, type: 'boolean', autoload: true, ...},
  {group: 'app', key: 'key', value: 'App Name', type: 'string', autoload: true, ...},
  {group: 'app', key: 'slogan', value: 'App Slogan', type: 'string', autoload: true, ...},
];
```

### Getting/Setting configuration

```javascript
const {getConfig, setConfig} = require("xpresser-db-config");

await getConfig('app.name'); // App Name
await getConfig('app.slogan'); // App Slogan

await setConfig('app.name', "New Name");
```


##  Setup
Install `xpresser-db-config`

```bash
npm i xpresser-db-config
# or
yarn add xpresser-db-config
```

Add to your `plugins.json` before other plugins.
**Note:** If you have a plugin that initializes database connection used by the db-config, add this plugin after it.

```json
{
  "npm://xpresser-db-config": true
}
```

Add to your xpresser `config`.

```js
({
    paths: {
        // db-config declaration file
        dbConfig: "backend://db-config",
        // db-config driver
        dbConfigClass: "npm://xpresser-db-config/drivers/xpress-mongo/XpressMongoDbConfig",
        // db-config backup folder
        dbConfigBackupFolder: "base://storage/db-config-backup",
    }
})
```

Create `db-config.(js|ts)` file in your `backend` folder.

```ts
import { defineDbConfig } from "xpresser-db-config/src/functions";

type Meta = {
    title: string;
    desc: string;
    example?: any;
    options?: Record<any, any>;
};

export = defineDbConfig<Meta>(({ v }) => {
    return [
        {
            // Active Providers Config
            group: "app",
            autoload: true,
            config: {
                name: "My App Name",

                // Value with meta
                slogan: v("We are the best", {
                    title: "Slogan",
                    desc: "This is the slogan of our app"
                })
            }
        }
    ];
});
```

Add `extensions` to your `use-xjs-cli.json` file.

```json
{
  "extensions": [
    "npm://xpresser-db-config"
  ]
}
```

The setup is complete!. 
Next, we need to migrate our configs to the database.
Run the command below to migrate configs.

```bash
npx xjs dbc:migrate
```

Other commands are below.

## Commands

```bash
# Migrate configs to database
npx xjs dbc:migrate

# Find config
npx dbc:find <query> [format] 

# Set config
npx dbc:set <key> <value>

# Reset config
npx dbc:reset

# Backup configs
npx dbc:backup

# Restore configs
npx dbc:restore <file>
```