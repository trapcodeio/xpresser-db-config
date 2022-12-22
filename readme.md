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
    group: "app",
    config: {
      name: "App Name",
      slogan: "App slogan"
    },
    autoload: true,
  }
];

/// Will be saved to memory as.
({
  allowLogin: true,
  backup: true,
  cronjobs: false,
  app: {
    name: "App Name",
    slogan: "App slogan"
  }
});

/// Will be stored to your configured db as
[
  {key: "allowLogin", value: true, type: "boolean", autoload: true, ...},
  {key: "backup", value: true, type: "boolean", autoload: true, ...},
  {key: "cronjobs", value: false, type: "boolean", autoload: true, ...},
  {group: "app", key: "key", value: "App Name", type: "string", autoload: true, ...},
  {group: "app", key: "slogan", value: "App Slogan", type: "string", autoload: true, ...},
]
```

### Getting/Setting configuration

```javascript
const {getConfig, setConfig} = require("xpresser-db-config");

await getConfig('app.name'); // App Name
await getConfig('app.slogan'); // App Slogan

await setConfig('app.name', "New Name");
```