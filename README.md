# Xen.db

[![downloadsBadge](https://img.shields.io/npm/dt/xen.db?style=for-the-badge)](https://www.npmjs.com/package/xen.db)
[![versionBadge](https://img.shields.io/npm/v/xen.db?style=for-the-badge)](https://www.npmjs.com/package/xen.db)

[Xen.db](https://www.npmjs.com/package/xen.db) Is An Open-Sourced Database Package Designed To Be Easy-To-Use & Friendly For Beginners. This Package Meant To Provide Easy Way For Users To **Access & Store Various Data** Persistently In A Database Via [BetterSQLite3](https://github.com/JoshuaWise/better-sqlite3).

- **Powerful** - Supports Non-Xen.db API.
- **Customizable** - More Utility Method.
- **Family-Friendly & Easy** - Simple & Easy-To-Use For Beginners.
- **100% Based** - Key Value Based.
- **Persistent Database** - Value Will Not Lost When Retstarting.
- **Free-To-Use** - Not Needed To Set Up A SQL Database Server! All Data Is Stored Locally In The Same Project.
- **Best Friends** - Supports Your Existing [Quick.db](https://www.npmjs.com/package/quick.db) `json.sqlite` Database.
- **Free Vehicles** - Easily Switch/Migrate Library Between [Xen.db](https://www.npmjs.com/package/xen.db) & [Quick.db](https://www.npmjs.com/package/quick.db) Library If You're Using `json.sqlite` File As Database. 
- **Work Together** - Support Various Of Supported Library Such As Above.

---

# Example

Coding A Sandbox (Demo)

```js
const { Database } = require("xen.db") 
const db = new Database() 

// Setting an object in the database:
db.set('userInfo', { difficulty: 'Easy' })
// -> { difficulty: 'Easy' }
 
// Pushing an element to an array (that doesn't exist yet) in an object:
db.push('userInfo.items', 'Sword')
// -> { difficulty: 'Easy', items: ['Sword'] }
 
// Adding to a number (that doesn't exist yet) in an object:
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }
 
// Repeating previous examples:
db.push('userInfo.items', 'Watch')
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }
db.add('userInfo.balance', 500)
// -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }
 
// Fetching individual properties
db.get('userInfo.balance') // -> 1000
db.get('userInfo.items') // ['Sword', 'Watch']

```

---

# Creating A Table

```js

const table = db.createTable("MyTable")

db.set("Inv", "Sword")
table.set("Inv", 123)

db.get("Inv") // Returns "Sword"
table.get("Inv") // Returns "123"

```

---

# List All Tables

```js

const tables = db.tables()

console.log(tables)

```

---

# Installation

If you're having some troubles installing this, please follow this [Troubleshooting Guide](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

##### Linux & Windows Platform

- `npm i xen.db`

**Note:** Windows platform users might need to do additional steps [Here](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).


##### Mac Platform

1. **Install**: XCode
2. **Run**: `npm i -g node-gyp` in your console/terminal
3. **Run**: `node-gyp --python /path/to/python2.7` (Skip this step if you didn't install Python 3.x)
4. **Finally, Run**: `npm i xen.db`

---

# Documentation

- Soon!

---

- If You Need Help, Please Join Our [Support Server](https://discord.gg/78RyqJK)



