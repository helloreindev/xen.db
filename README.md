**XenDB** is an open-source NodeJS database.

[![Discord](https://discord.com/api/guilds/750546490614743150/widget.png?style=shield)](https://discord.gg/78RyqJK)
[![GitHub Release](https://img.shields.io/github/v/release/helloreindev/xen.db?include_prereleases)](https://github.com/helloreindev/xen.db/releases/latest)
[![NPM](https://img.shields.io/npm/v/xen.db?color=green)](https://npmjs.com/package/xen.db)

- Discord: [discord.gg/78RyqJK](https://discord.78RyqJK)
- GitHub: [github.com/helloreindev/xen.db](https://github.com/helloreindev/xen.db)
- NPM: [npmjs.com/package/xen.db](https://npmjs.com/package/xen.db)

## Installation

```
npm install xen.db
```

> Please follow the provided [troubleshooting guide](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md) if you are having issues installing it.

## Example

```js
// Uses a SQLite database. (MySQL and Mongoose will be supported in future versions)
const { SQLiteDriver } = require("xen.db");
// For custom file path, use the 'fileName' option.
// Eg. new SQLiteDriver({ fileName: "path/mydb.sqlite" });
const db = new SQLiteDriver();

db.set("Name", "Hellorein");
// -> { Name: "Hellorein" } <-

db.set("World", { Time: "Day", Money: 15000 });
// -> { World: { Time: "Day", Money: 15000 } } <-

db.get("World");
// -> { World: { Time: "Day", Money: 15000 } } <-

db.push("Cart", ["Weapon A", "Weapon B"]);
// -> { Cart: ["Weapon A", "Weapon B"] } <-

db.add("World.Money", 5000);
// -> { World: { Time: "Day", Money: 20000 } } <-
```
