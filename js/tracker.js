import { handleDropZoneDrag, handleDropZoneDrop } from "./drop-zone.js";

const loadWasm = async () => {
    // pull the wasm from CDN
    return await window.initSqlJs({
        locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm"
    });
}

window.addEventListener("DOMContentLoaded", () => {
    let sql;
    console.log("Loading sql-wasm...");
    loadWasm().then(value => {
        sql = value;
        console.log("sql-wasm loaded.");
    }).catch(res => {
        console.log("Error loading sql-wasm.");
        console.log(res);
    }).finally(() => {
        const dropZone = document.getElementById("drop-zone");

        if (dropZone) {
            dropZone.addEventListener("dragover", (event) => { handleDropZoneDrag(event); });
            dropZone.addEventListener("drop", (event) => { handleDropZoneDrop(event, sql); });
        }
    });
});