/*
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
 */
window.addEventListener("DOMContentLoaded", (event) => {
    const initSqlJs = window.initSqlJs;  // initialize sql.js
    let SQL, db;

    const loadWasm = async () => {
        SQL = await initSqlJs({
            locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm"
        });  // pull the wasm from CDN
    }

    loadWasm().then(() => {
        console.log("sql-wasm loaded.");
        db = new SQL.Database();  // initialize database
    }).catch(target => {
        console.log(`error: ${target}`);
    });

    const dropZone = document.getElementById("drop-zone");
    const fileMenu = document.getElementById("file-menu");

    if (dropZone) {
        dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();  // prevent default to allow drop
            console.log("File(s) in drop zone.");
        });

        dropZone.addEventListener("drop", (event) => {
            event.preventDefault();  // prevent default action (prevent file from being opened)
            console.log("File(s) dropped");

            if (event.dataTransfer.items) {
                // use DataTransferItemList interface to access the file(s)
                [...event.dataTransfer.items].forEach((item, i) => {
                    // if dropped items aren't files, reject them
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        if (file) {
                            console.log(`… file[${i}].name = ${file.name}`);

                            // create new file tag to store in file-menu
                            const p = document.createElement('p');
                            p.textContent = file.name
                            fileMenu.appendChild(p);  // add it to the menu

                            file.arrayBuffer().then(buff => {
                                let fileArray = new Uint8Array(buff); // x is the uInt8Array
                            });
                        }
                    }
                });
            } else {
                // use DataTransfer interface to access the file(s)
                [...event.dataTransfer.files].forEach((file, i) => {
                    console.log(`… file[${i}].name = ${file.name}`);
                });
            }
        });
    }
});