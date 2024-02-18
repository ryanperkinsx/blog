// ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
import { dbIntegrityCheck } from "../sql.js";

class DropZone extends HTMLElement {

    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    connectedCallback() {
        const {shadowRoot} = this;
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

        console.log("Loading sql-wasm...");
        this.loadWasm().then(value => {
            this.sql = value;
            console.log("sql-wasm loaded.");
        }).catch(res => {
            console.log("Error loading sql-wasm.");
            console.log(res);
        });

    }

    disconnectedCallback() {
        this.shadowRoot.querySelector(".wrapper").removeEventListener('drag', this.handleDragOver);
        this.shadowRoot.querySelector(".wrapper").removeEventListener('drop', this.handleDrop);
    }

    handleDragOver(event) {
        event.preventDefault();  // prevent default behavior to allow drop
    }

    handleDrop(event, sql) {
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
                        const fileMenuItems = fileMenu.getElementsByClassName("file-item-wrapper");
                        let isDuplicateFile = false;
                        let isSqlLiteFile = false;

                        [...fileMenuItems].forEach((item) => {
                            console.log(`${item.id}`)
                            console.log(`${fileName}`)
                            if (item.id.startsWith(fileName)) {  // if any of the file-menu-item-wrappers equal the uploaded file's name
                                isDuplicateFile = true;
                            }
                        })  // end loop

                        if (isDuplicateFile) {
                            console.log(`"${fileName}" already exists! skipping.`);
                            return;  // skip duplicate
                        }

                        // try to initialize a database w/ the file
                        file.arrayBuffer().then(buff => {
                            const fileArray = new Uint8Array(buff);
                            const db = new this.sql.Database(fileArray);

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
                                console.log(`${fileName}: not a sqlite file! skipping.`);
                            } else {
                                const newItem = document.createElement("file-menu-item");
                                newItem.setAttribute("id", fileName)
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

    async loadWasm() {
        // pull the wasm from CDN
        return await window.initSqlJs({
            locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.wasm"
        });
    }
}

customElements.define("drop-zone", DropZone);
