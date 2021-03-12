# Documentation

## Xen.db Method

- [(method) Database.all(options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasealloptions)
- [(method) Database.fetchAll(options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchalloptions)
- [(method) Database.add(key, numbers, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databaseaddkey-numbers-options)
- [(method) Database.subtract(key, numbers, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasesubtractkey-numbers-options)
- [(method) Database.multiply(key, numbers, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasemultiplykey-numbers-options)
- [(method) Database.divide(key, numbers, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasedividekey-numbers-options)
- [(method) Database.delete(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasedividekey-numbers-options)
- [(method) Database.fetch(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchkey-options)
- [(method) Database.get(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasegetkey-options)
- [(method) Database.set(key, value, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasesetkey-value-options)
- [(method) Database.has(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasehaskey-options)
- [(method) Database.type(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasetypekey-options)
- [(method) Database.push(key, value[], options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasepushkey-value-options)
- [(method) Database.pull(key, value[], options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasepullkey-value-options)
- [(method) Database.extract(key, value[])](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databaseremovekey-value-options)
- [(method) Database.fetchOne(key, value[], options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchonekey-value-options)
- [(method) Database.getOne(key, value[], options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasegetonekey-value-options)
- [(method) Database.createTable(key, options)](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasecreatetablekey-options)

---

### (method) Database.all(options)

This method returns used (or specific) table as array. Alias of [`(method) Database.fetchAll()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchalloptions)

```js

const { Database } = require("xen.db");
const db = new Database();

db.all();
// -> [Array]

```

---

### (method) Database.fetchAll(options)

This method returns used (or specific) table as array. Alias of [`(method) Database.all()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasealloptions)

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetchAll()

```

---

### (method) Database.add(key, numbers, options)

This method adds a number to a key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Wallet");
// -> 250

db.add("Wallet", 250);
//  -> 500

```

---

### (method) Database.subtract(key, numbers, options)

This method subtracts a number from a key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Wallet");
// -> 500

db.subtract("Wallet", 150);
// -> 350

```

---

### (method) Database.multiply(key, numbers, options)

This method multiply a number from a key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("HealthPoint");
// -> 50

db.multiply("HealthPoint", 2);
// -> 100

```

---

### (method) Database.divide(key, numbers, options)

This method divide a number from a key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Wallet");
// -> 350

db.divide("Wallet", 5);
// -> 70

```

---

### (method) Database.delete(key, options)

This method will deletes a specific key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Key");
// -> ["Hello World!", "My World Say Hello!"]

db.delete("Key");
// -> True

```

---

### (method) Database.fetch(key, options)

This method fetch/get all of the value(s) in a specific key in the database. Alias of [`(method) Database.get()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasegetkey-options)

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Key");
// -> Hello World!

```

---

### (method) Database.get(key, options)

This method fetch/get all of the value(s) in a specific key in the database. Alias of [`(method) Database.fetch()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchkey-options)
```js

const { Database } = require("xen.db");
const db = new Database();

db.get("Key");
// -> Hello World!

```

---

### (method) Database.set(key, value, options)

This method set a value/data in a specific key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetch("Inv");
// -> []

db.set("Inv", "Hello World!");
// -> Hello World!

```

---

### (method) Database.has(key, options)

This method returns a boolean whether a value in a key or its key is exist.

```js

const { Database } = require("xen.db");
const db = new Database();

db.set("Bank", { balance: "$2,056", guard: 20});
// -> { balance: "$2,056", guard: 20 }

db.has("Bank.balance");
// -> True

db.has("Bank.worker");
// -> False

```

--- 

### (method) Database.type(key, options)

This method returns data typed of the value applied to the key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.set("Key", "Hello World!");
// -> Hello World!

db.type("Key");
// -> String

```

---

### (method) Database.push(key, value[], options)

This method set a multiple values in a key in the database.

```js

const { Database } = require("xen.db");
const db = new Database();

db.push("Key", ["Hello World!", "The World Say Hello!"]);
// -> ["Hello World!", "The World Say Hello!"]

```

---

### (method) Database.pull(key, value[], options)

This method pull/extract value(s) from a key in the database. Alias of [`(method) Database.extract()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databaseremovekey-value-options)

```js

const { Database } = require("xen.db");
const db = new Database();

db.pull("Key", "Hello World!");
// -> ["The World Say Hello!"]

```

---

### (method) Database.extract(key, value[], options)

This method pull/extract value(s) from a key in the database. Alias of [`(method) Database.pull()`]

```js

const { Database } = require("xen.db");
const db = new Database();

db.extract("Key", "Hello World!");
// -> ["The World Say Hello!"]

```

---

### (method) Database.fetchOne(key, value[], options)

This method fetch/get specific value(s) from a key in the database. Alias of [`(method) Database.getOne()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasegetonekey-value-options)

```js

const { Database } = require("xen.db");
const db = new Database();

db.fetchOne("Key", "Hello World!");
// -> "Hello World!"

```

---

### (method) Database.getOne(key, value[], options)

This method fetch/get specific value(s) from a key in the database. Alias of [`(method) Database.fetchOne()`](https://github.com/NotMarx/Xen.db/blob/master/Docs/README.md#method-databasefetchonekey-value-options)

```js

const { Database } = require("xen.db");
const db = new Database();

db.getOne("Key", "Hello World!");
// -> "Hello World!"

```

---

### (method) Database.createTable(key, options)

This method will creates a new table in the database with the given name.

```js

const { Database } = require("xen.db");
const db = new Database();

const myKey = db.createTable("Key");

db.set("Key", "Hello World!");
myKey.set("Key", "The World Say Hello!");

db.fetch("Key");
// -> "Hello World!"

myKey.fetch("Key");
// -> "The World Say Hello!"

```

---