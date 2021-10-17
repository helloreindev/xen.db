# Xen.db

[![downloadsBadge](https://img.shields.io/npm/dt/xen.db?color=7289DA&label=Total%20Downloads&logo=Xen.db&style=for-the-badge)](https://www.npmjs.com/package/xen.db)
[![versionBadge](https://img.shields.io/npm/v/xen.db?color=7289DA&label=Version&logo=Xen.db&style=for-the-badge)](https://www.npmjs.com/package/xen.db)
[![docs](https://img.shields.io/badge/Documentation-Click%20here-7289DA?style=for-the-badge)](https://xendb.js.org)

[Xen.db](https://www.npmjs.com/package/xen.db) is an open-sourced SQLite3 Database designed to be easy-to-use and beginner friendly. This Database access and store various of data persistently via [BetterSQLite3](https://github.com/JoshuaWise/better-sqlite3).

### Features

- **Powerful** - Supports **Non-Xen.db** Method.
- **Customizable** - More Utility Method.
- **Family-Friendly** - Simple & Easy-To-Use For Beginners.
- **100% Based** - Key Value Based.
- **Persistent Database** - Value Will Not Lost When On Retstarting Session.
- **Free-To-Use** - Not Needed To Set Up A SQL Database Server! All Data Is Stored Locally In The Same Project.
- **Custom Database File** - **Xen.db** Allow Users To Create Custom Database File And Its Path!

---

# Example (Default)

Coding A Sandbox (Demo)

```js

const { Database } = require("xen.db");
const db = new Database(); 

// Setting an object in the database:
db.set('userInfo', { difficulty: 'Easy' });
// -> { difficulty: 'Easy' }
 
// Pushing an element to an array (that doesn't exist yet) in an object:
db.push('userInfo.items', 'Sword');
// -> { difficulty: 'Easy', items: ['Sword'] }
 
// Adding to a number (that doesn't exist yet) in an object:
db.add('userInfo.balance', 500);
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }
 
// Repeating previous examples:
db.push('userInfo.items', 'Watch');
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
db.add('userInfo.balance', 500);
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }
 
// Fetching individual properties
db.get('userInfo.balance'); // -> 1000
db.get('userInfo.items'); // ['Sword', 'Watch']

```

# Example (Custom)

```js

const { Database } = require("xen.db");
const db = new Database("Database/xen.db", { path: "Database", table: "JSON"});
// Creates a Database File called "xen.db" inside a "Database" folder instead of "json.sqlite"

// Setting an object in the database:
db.set('userInfo', { difficulty: 'Easy' });
// -> { difficulty: 'Easy' }
 
// Pushing an element to an array (that doesn't exist yet) in an object:
db.push('userInfo.items', 'Sword');
// -> { difficulty: 'Easy', items: ['Sword'] }
 
// Adding to a number (that doesn't exist yet) in an object:
db.add('userInfo.balance', 500);
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }
 
// Repeating previous examples:
db.push('userInfo.items', 'Watch');
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
db.add('userInfo.balance', 500);
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }
 
// Fetching individual properties
db.get('userInfo.balance'); // -> 1000
db.get('userInfo.items'); // ['Sword', 'Watch']

```

---

# Creating A Table

```js

// Creates New Table
const table = db.createTable("MyTable");

db.set("Inv", "Sword");
table.set("Inv", "Diamond");

db.get("Inv");
// -> Sword

table.get("Inv");
// -> Diamond

```

---

# List All Tables

```js

const tables = db.tables();

console.log(tables);

```

---

# Why Xen.db?

- **Lightweight**
- **Consistent**
- **Easy-To-Use**
- **Customizable**
- **Key & Value Based**
- **Persistent Database**

We've Over ***2,000+*** Downloads On **NPM**!   

Check Out Our [GitHub](https://github.com/NotMarx/xen.db) For Contributions!

---

# Installation

If You Have Trouble Installing **Xen.db**. Please Follow This [Troubleshooting Guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

##### Windows Platform

1. **Open**: Any Terminal (Eg. PowerShell, Command Prompt)
2. **Run**: `npm i xen.db`

- If you want to be more updated, you can install the dev version instead: `npm i NotMarx/xen.db#dev`

**Note:** Windows Users Might Need To Do The Following [Additional Steps](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

##### Mac Platform

1. **Install**: XCode
2. **Run**: `npm i -g node-gyp` In Your Console Or Terminal
3. **Run**: `node-gyp --python /path/to/python2.7` 
4. **Finally, Run**: `npm i xen.db`

---

# Documentation

- Please [Click Here](https://xendb.js.org) For **Xen.db** Documentation!

---

- If You Need Help, Please Join Our [Support Server](https://discord.gg/78RyqJK) And Ask In The [#xen-db](https://discord.com/channels/750546490614743150/756354697077719100) Channel.



