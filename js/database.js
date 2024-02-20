console.log("loading sql-wasm...");
const config = {
    locateFile: filename => `../../node_modules/sql.js/dist/${filename}`  // CDN: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${filename}"
};

let sqlModule;

await initSqlJs(config).then((val) => {
    sqlModule = val;
}).catch((res) => {
    console.log(res);
    throw new Error("unable to load sql-wasm! exiting.")
});

console.log("sql-wasm loaded.");

export class Database {
    constructor(fileName, fileArray) {
        console.log(`${fileName}: loading database...`);
        try {
            this._db = new sqlModule.Database(fileArray);
            console.log(`${fileName}: database loaded.`);
        } catch (e) {
            console.log(e);
            throw new Error(`${fileName}: unable to load database.`);
        }

        console.log(`${fileName}: validating database...`);
        this.dbIntegrityCheck().then(() => {
            console.log(`${fileName}: validation was successful!`);
            const menuItem = document.createElement("file-menu-item");
            menuItem.setAttribute("id", `${fileName}-menu-item`);
            const fileMenu = document.getElementById("file-menu");
            fileMenu.shadowRoot.getElementById("file-menu-wrapper").appendChild(menuItem);
        }).catch((res) => {
            console.log(res);
            console.log(`${fileName}: validation was unsuccessful! skipping.`);
            delete databases[fileName];
        });
    }

    async dbIntegrityCheck() {
        this._db.exec("PRAGMA integrity_check");
    }

    async close() {
        this._db.close();
    }
}

export const databases = {};  // to hold the database objects