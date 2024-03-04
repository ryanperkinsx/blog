console.log("loading sql-wasm...");
let SQL;
const config = {
    locateFile: filename => `../node_modules/sql.js/dist/${filename}`  // CDN: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${filename}"
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
        console.log(`${fileName}: loading file...`);
        this._activeTrainingBlockId = "";
        this._fileName = fileName;

        // try to initialize the DB
        try {
            this._db = new SQL.Database(fileArray);
            console.log(`${fileName}: file loaded.`);
        } catch (e) {
            console.log(e);
            throw new Error(`${fileName}: unable to load file.`);
        }

        console.log(`${fileName}: validating database...`);
        this.dbIntegrityCheck().then(() => {
            // create + add HTML element
            console.log(`${fileName}: validation was successful!`);
            const menuItem = document.createElement("file-menu-item");
            menuItem.setAttribute("id", `fmi-${fileName}`);
            const fileMenuShadow = document.getElementById("file-menu").shadowRoot;
            fileMenuShadow.getElementById("fm-wrapper").appendChild(menuItem);
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
    //     IF EXISTS(
    //         SELECT * FROM INFORMATION_SCHEMA.TABLES
    //         WHERE TABLE_NAME = 'day' | 'race' | 'training_block' | 'week'
    //     ) TODO: check for proper tables too
    }

    async closeDb() {
        await this._db.close();
    }

    async exportDb() {
        const data = await this._db.export();
        const file = new Blob([data], {type: "text/text;charset=utf-8"});
        saveAs(file, this._fileName);
    }

    async getTrainingBlockIdAndNames() {
        return await this._db.exec("SELECT training_block_id, name FROM training_block");
    }

    async getWeeksByTrainingBlockId(id) {
        return await this._db.exec("SELECT * FROM week WHERE training_block_id=$id", {"$id": id});
    }

    async getDaysByWeekId(id) {
        return await this._db.exec("SELECT * FROM day WHERE week_id=$id", {"$id": id});
    }

    async updateMilesByDayId(miles, id) {
        return await this._db.exec("UPDATE day SET miles=:miles WHERE day_id=:dayId", {":miles": miles, ":dayId": id});
    }
}

export const databases = {};  // to hold the database objects