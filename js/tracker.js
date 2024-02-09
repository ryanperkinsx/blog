/*
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
 */
window.addEventListener("DOMContentLoaded", () => {
    const initSqlJs = window.initSqlJs;  // initialize sql.js
    let SQL, db;

    const loadWasm = async () => {
        SQL = await initSqlJs({
            locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm"
        });  // pull the wasm from CDN
    }

    loadWasm().then(() => {
        console.log("sql-wasm loaded.");
    }).catch(target => {
        console.log(`Error: ${target}`);
    }).finally(() => {
        const dropZone = document.getElementById("drop-zone");

        if (dropZone) {
            dropZone.addEventListener("dragover", (event) => {
                event.preventDefault();  // prevent default to allow drop
                console.log("File(s) in drop zone.");
            });

            dropZone.addEventListener("drop", (event) => {
                event.preventDefault();  // prevent default action (prevent file from being opened)
                console.log("File(s) dropped.");

                if (event.dataTransfer.items) {
                    // use DataTransferItemList interface to access the file(s)
                    [...event.dataTransfer.items].forEach((item, i) => {
                        // if dropped items aren't files, reject them
                        if (item.kind === "file") {
                            const file = item.getAsFile();
                            if (file) {
                                const fileName = file.name;
                                console.log(`… file[${i}].name = ${fileName}`);
                                const fileMenu = document.getElementById("file-menu");
                                const fileMenuItems = fileMenu.getElementsByClassName("file-menu-item-wrapper");
                                let isDuplicateFile = false;
                                let isSqlLiteFile = false;

                                [...fileMenuItems].forEach((item) => {
                                    if (item.id.startsWith(fileName)) {
                                        isDuplicateFile = true;
                                    }  // if any of the file-menu-item-wrappers equal the uploaded file's name
                                })  // end loop

                                if (isDuplicateFile) {
                                    alert("File already exists! Skipping.");
                                    return;
                                }  // skip duplicate

                                // try to initialize a database w/ the file
                                file.arrayBuffer().then(buff => {
                                    let fileArray = new Uint8Array(buff);
                                    db = new SQL.Database(fileArray);
                                    const integrityCheck = async () => {
                                        await db.exec("PRAGMA integrity_check");
                                    };

                                    integrityCheck().then(() => {
                                        isSqlLiteFile = true;
                                        console.log("Database connection was successful.");
                                        console.log("Saving file and closing connection...");
                                    }).catch(res => {
                                        console.log(res);
                                        console.log("Database connection was unsuccessful.");
                                        console.log("Closing connection...");
                                    });
                                }).catch(res => {
                                    console.log(`Invalid file: ${res}`);
                                }).finally(() => {
                                    db.close();
                                    console.log("Database connection closed.");

                                    if (!isSqlLiteFile) {
                                        return;
                                    } // if it's NOT a valid SQLite file, skip and move to the next

                                    console.log(`Adding ${fileName} element.`);
                                    const item = document.createElement("div");
                                    item.setAttribute("id", `${fileName}-menu-item`);
                                    item.setAttribute("class", "file-menu-item-wrapper");
                                    fileMenu.appendChild(item);  // add it to the menu
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
});