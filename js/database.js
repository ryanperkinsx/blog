console.log("loading sql-wasm...");
let SQL;
const config = {
    locateFile: filename => `../../node_modules/sql.js/dist/${filename}`  // CDN: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${filename}"
};
await initSqlJs(config).then((value) => {
    SQL = value;
}).catch((res) => {
    console.log(res);
    throw new Error("unable to load sql-wasm! exiting.")
});
console.log("sql-wasm loaded.");

export class Database {
    constructor(fileName, fileArray) {
        console.log(`${fileName}: loading database...`);
        try {
            this._db = new SQL.Database(fileArray);
            console.log(`${fileName}: database loaded.`);
        } catch (e) {
            console.log(e);
            throw new Error(`${fileName}: unable to load database.`);
        }

        console.log(`${fileName}: validating database...`);
        this.dbIntegrityCheck().then(() => {
            console.log(`${fileName}: validation was successful!`);
            const menuItem = document.createElement("file-menu-item");
            menuItem.setAttribute("id", `fmi-${fileName}`);

            const fileMenu = document.getElementById("file-menu");
            fileMenu.shadowRoot.getElementById("fm-wrapper").appendChild(menuItem);
        }).catch((res) => {
            console.log(res);
            console.log(`${fileName}: validation was unsuccessful! skipping.`);
            databases[fileName].close().then(() => {
                delete databases[fileName];
            }).catch((res) => {
                console.log(res);
                console.log(`${fileName}: unable to delete database.`);
            });
        });
    }

    async dbIntegrityCheck() {
        this._db.exec("PRAGMA integrity_check");
    }

    async close() {
        this._db.close();
    }

    async getTrainingBlockNames() {
        return await this._db.exec("SELECT name FROM training_block");
    }

    async getTrainingBlockByName(name) {
        const stmt = this._db.prepare("SELECT * FROM training_block WHERE name=:name");
        const result = await stmt.getAsObject({':name': name});
        stmt.free();
        return result;
    }
}

export const databases = {};  // to hold the database objects