# Xen.db
A Node Module Which Is Very Similar To [Quick.db](https://www.npmjs.com/package/quick.db).

- Supports Non-Xen.db API
- Simple & Easy-To-Use For Beginners.

---

# Example

Code A Sandbox Demo

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

- If You Need Help, Please Join Our [Support Server](https://discord.gg/78RyqJK)



