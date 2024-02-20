import {Database, databases} from "../database.js";

class DropZone extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .drop-zone-wrapper { 
                height: 100%;
                width: 100%;
            }
            .drop-zone-message {
                margin: 0;
                padding: 5% 0 0 0;
                font-size: large;
            }
            .drop-zone-note {
                font-size: small;
            }
            a:link {
                color: #65cef5;
            }
            a:visited {
                color: #f6f66c;
            }
            a:hover {
                color: #ff0000;
            }
        </style>
        <div id="drop-zone-wrapper" class="drop-zone-wrapper">
            <p class="drop-zone-message">drag one or more files into this <b><i>drop zone</i></b>.</p>
            <p class="drop-zone-note">
                [the drop zone is exclusive to 
                <a target="_blank" rel="noopener noreferrer" href="https://www.sqlite.org/index.html">
                    <i><u>sqlite files</u></i></a>]
            </p>
        </div>`;

        shadowRoot.getElementById("drop-zone-wrapper").addEventListener("dragover", this.handleDragOver);
        shadowRoot.getElementById("drop-zone-wrapper").addEventListener('drop', this.handleDrop);
        console.log(`${this.id}: added to the DOM.`);
    }

    disconnectedCallback() {
        this.shadowRoot.getElementById("drop-zone-wrapper").removeEventListener('dragover', this.handleDragOver);
        this.shadowRoot.getElementById("drop-zone-wrapper").removeEventListener('drop', this.handleDrop);
        console.log(`${this.id}: removed from the the DOM.`)
    }

    handleDragOver(event) {
        event.preventDefault();  // prevent default behavior to allow drop
    }

    async handleDrop(event) {
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
                    const isDuplicateFile = fileMenu.shadowRoot.getElementById(`${fileName}`) === null;

                    // skip duplicate
                    if (!isDuplicateFile) {
                        console.log(`"${fileName}" already exists! skipping.`);
                        return;
                    }

                    // try to initialize a database w/ the file
                    file.arrayBuffer().then(buff => {
                        const fileArray = new Uint8Array(buff);
                        databases[fileName] = new Database(fileName, fileArray);
                    }).catch((res) => {
                        console.log(res);
                        console.log("failure converting file into array! skipping.");
                    });
                } else {
                    console.log("invalid file! skipping.");
                }
            });
        } catch (e) {
            console.log(e);
            console.log("unable to load files!");
        }
    }
}

customElements.define("drop-zone", DropZone);