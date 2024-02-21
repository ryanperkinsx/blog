import {Database, databases} from "../database.js";

class DropZone extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .dz-wrapper { 
                height: 100%;
                width: 100%;
            }
            .dz-border {
                height: 100%;
                position: absolute;
                top: 0;
                width: 100%;
            }
            .dz-border.x {
                background-repeat: repeat-x;
                background-size: 12% 0.3em;
            }
            .dz-border.y {
                background-repeat: repeat-y;
                background-size: 0.3em 12%;
            }
            .dz-border.top {
                background-image: linear-gradient(to right, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 0%);
                background-position: top;
            }
            .dz-border.right {
                background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 0%);
                background-position: right;
            }
            .dz-border.bottom {
                background-image: linear-gradient(to left, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 0%);
                background-position: bottom;
            }
            .dz-border.left {
                background-image: linear-gradient(to top, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 0%);
                background-position: left;
            }
            .dz-message {
                margin: 0;
                padding: 5% 0 0 0;
                font-size: large;
            }
            .dz-note {
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
        <div id="dz-wrapper" class="wrapper"> 
            <p class="dz-message">drag one or more files into this <b><i>drop zone</i></b>.</p>
            <p class="dz-note">
                [the drop zone is exclusive to 
                <a target="_blank" rel="noopener noreferrer" href="https://www.sqlite.org/index.html">
                    <i><u>sqlite files</u></i></a>]
            </p>
            <div class="dz-border x top"></div>
            <div class="dz-border y right"></div>
            <div class="dz-border x bottom"></div>
            <div class="dz-border y left"></div>
        </div>`;

        shadowRoot.getElementById("dz-wrapper").addEventListener("dragover", this.handleDragOver);
        shadowRoot.getElementById("dz-wrapper").addEventListener("drop", this.handleDrop);
        console.log(`${this.id}: added to the DOM.`);
    }

    disconnectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.getElementById("dz-wrapper").removeEventListener("dragover", this.handleDragOver);
        shadowRoot.getElementById("dz-wrapper").removeEventListener("drop", this.handleDrop);
        console.log(`${this.id}: removed from the the DOM.`)
    }

    handleDragOver(event) {
        event.preventDefault();  // prevent default behavior to allow drop
    }

    async handleDrop(event) {
        event.preventDefault();  // prevent default behavior (opens file)
        console.log("file(s) dropped.");

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
                        console.log(`${fileName}: file already exists! skipping.`);
                        return;
                    }

                    // try to initialize a database w/ the file
                    file.arrayBuffer().then(buff => {
                        const fileArray = new Uint8Array(buff);
                        databases[fileName] = new Database(fileName, fileArray);
                    }).catch((res) => {
                        console.log(res);
                        console.log(`${fileName}: unable to convert into array! skipping.`);
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