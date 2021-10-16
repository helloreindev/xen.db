
/**
 * Thank You For Using Xen.db!
 * 
 * Orignial Creator: Reinhardt <notmarx.tech@gmail.com>
 * 
 * A NodeJS SQLite3 Persistent Database
 * 
 * This is an Open-Sourced Easy-To-Use SQLite3 Database Designed Persistently For Beginners & Advanced Developer.
 * All Data Are Stored Locally In A File In The Same Project.
 * 
 * For Issues, Please Check Out: https://github.com/NotMarx/xen.db/issues
 */

 module.exports = {
    Database: require("./lib/Database"),
    Static: require("./lib/Static"),
    Util: require("./lib/Util"),
    VERSION: require("./package.json").version
}

// Documentation: https://xendb.js.org
// Discord Support Server: https://discord.gg/78RyqJK