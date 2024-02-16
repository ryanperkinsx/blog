/*
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
 */
import { createFileMenuItem } from "./file-menu-item.js";
import { dbIntegrityCheck } from "./sql.js";

export const handleDropZoneDrag = (event) => {
    event.preventDefault();  // prevent default behavior to allow drop
}

export const handleDropZoneDrop = (event, sql) => {
    event.preventDefault();  // prevent default behavior (opens file)
    console.log("File(s) dropped.");

    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {  // use DataTransferItemList interface to access the file(s)

            if (item.kind === "file") {  // if dropped items aren't files, reject them
                const file = item.getAsFile();

                if (file) {
                    const fileName = file.name;
                    console.log(`… file[${i}].name = ${fileName}`);
                    const fileMenu = document.getElementById("file-menu");
                    const fileMenuItems = fileMenu.getElementsByClassName("file-menu-item-wrapper");
                    let isDuplicateFile = false;
                    let isSqlLiteFile = false;

                    [...fileMenuItems].forEach((item) => {
                        if (item.id.startsWith(fileName)) {  // if any of the file-menu-item-wrappers equal the uploaded file's name
                            isDuplicateFile = true;
                        }
                    })  // end loop

                    if (isDuplicateFile) {
                        console.log(`"${fileName}" already exists! Skipping.`);
                        return;  // skip duplicate
                    }

                    // try to initialize a database w/ the file
                    file.arrayBuffer().then(buff => {
                        const fileArray = new Uint8Array(buff);
                        const db = new sql.Database(fileArray);

                        dbIntegrityCheck(db).then(() => {
                            isSqlLiteFile = true;
                            console.log(`${fileName}: database connection was successful.`);
                            console.log(`${fileName}: saving file and closing connection...`);
                        }).catch(res => {
                            console.log(res);
                            console.log(`${fileName}: database connection was unsuccessful.`);
                            console.log(`${fileName}: closing connection...`);
                        }).finally(() => {
                            db.close();
                            console.log(`${fileName}: database connection closed.`);
                        });
                    }).catch(res => {
                        console.log(res);
                        console.log(`${fileName}: invalid file.`);
                    }).finally(() => {
                        if (!isSqlLiteFile) {  // if it's NOT a valid SQLite file, skip and move to the next
                            console.log(`${fileName}: not a sqlite file! Skipping.`);
                        } else {
                            const newItem = createFileMenuItem(fileName); // create file menu element
                            fileMenu.appendChild(newItem);  // add it to the menu
                            console.log(`${fileName}: file saved.`);
                        }
                    });
                }
            }
        });
    } else {
        [...event.dataTransfer.files].forEach((file, i) => {  // use DataTransfer interface to access the file(s)
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }
}