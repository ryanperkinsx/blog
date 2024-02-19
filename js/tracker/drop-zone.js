// ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
"use strict";
import { dbIntegrityCheck } from "../sql.js";

console.log("loading sql-wasm...");
window.initSqlJs({
    locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm"
}).then((val) => {
    const sql = val;
    console.log("sql-wasm loaded.");

    class DropZone extends HTMLElement {

        constructor() {
            super();  // always call super-duper
            this.attachShadow({mode: 'open'});
        }

        connectedCallback() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = `<style>
            .wrapper { 
                height: 100%;
                width: 100%;
            }
            .message {
                margin: 0;
                padding: 5% 0 0 0;
                font-size: large;
            }
            .note {
                font-size: small;
            }
        </style>
        <div class="wrapper">
            <p class="message">drag one or more files into this <b><i>drop zone</i></b>.</p>
            <p class="note">[dropzone is exclusive to sqlite files]</p>
        </div>`;

            shadowRoot.querySelector(".wrapper").addEventListener("dragover", this.handleDragOver);
            shadowRoot.querySelector(".wrapper").addEventListener('drop', this.handleDrop);
            console.log(`${this.id} connected.`);
        }

        disconnectedCallback() {
            this.shadowRoot.querySelector(".wrapper").removeEventListener('drag', this.handleDragOver);
            this.shadowRoot.querySelector(".wrapper").removeEventListener('drop', this.handleDrop);
            console.log(`${this.id} disconnected.`)
        }

        handleDragOver(event) {
            event.preventDefault();  // prevent default behavior to allow drop
        }

        handleDrop(event) {
            event.preventDefault();  // prevent default behavior (opens file)
            console.log("File(s) dropped.");

            try {
                // use DataTransferItemList interface to access the file(s)
                [...event.dataTransfer.items].forEach((item) => {
                    // if item isn't a file, reject it
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        const fileName = file.name;
                        const fileMenu = document.getElementById("file-menu");
                        const fileMenuItems = fileMenu.getElementsByTagName("file-menu-item");
                        let { isDuplicateFile, isSqlLiteFile } = false;

                        // check the already loaded files
                        [...fileMenuItems].forEach((item) => {
                            // if any of the file menu items equal the uploaded file's name
                            if (item.id.startsWith(fileName)) {
                                isDuplicateFile = true;

                            }
                        })

                        // skip duplicate
                        if (isDuplicateFile) {
                            console.log(`"${fileName}" already exists! skipping.`);
                            return;
                        }

                        // try to initialize a database w/ the file
                        file.arrayBuffer().then(buff => {
                            const fileArray = new Uint8Array(buff);
                            const db = new sql.Database(fileArray);

                            dbIntegrityCheck(db).then(() => {
                                console.log(`${fileName}: database connection was successful.`);
                                console.log(`${fileName}: saving file and closing connection...`);
                                isSqlLiteFile = true;
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
                            // if it's NOT a valid SQLite file, skip and move to the next
                            if (!isSqlLiteFile) {
                                console.log(`${fileName}: not a sqlite file! skipping.`);
                            } else {
                                const newItem = document.createElement("file-menu-item");
                                newItem.setAttribute("id", fileName)
                                fileMenu.shadowRoot.appendChild(newItem);  // add it to the menu
                                console.log(`${fileName}: file saved.`);
                            }
                        });
                    }
                });
            } catch (e) {
                console.log(e);
                console.log("unable to load files!");
            }
        }
    }

    customElements.define("drop-zone", DropZone);
});
