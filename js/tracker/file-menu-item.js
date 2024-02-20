import { dbFileArrays } from "./drop-zone.js";

class FileMenuItem extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
        this._metadata = null;
    }

    connectedCallback() {
        const { shadowRoot, id } = this;
        const fileName = id.replace("-menu-item", "");

        shadowRoot.innerHTML = `<style>
            .file-menu-item-wrapper {
                border: 2px solid #ffffff;
                border-top: hidden;
                border-right: hidden;
                display: flex;
                justify-content: space-between;
                margin: 10px 8px;
                text-align: left;
            }
            .file-menu-item-label {
                color: #ffffff;
                cursor: pointer;
                display: inline;
                font-size: small;
                margin: 0 0 0 4px;
                text-align: left;
                width: 90%;
                user-select: none; /* Standard syntax */
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
            }
            .file-menu-item-remove {
                bottom: 1px;
                color: #ffffff;
                cursor: pointer;
                display: inline;
                font-size: medium;
                margin: 0 4px 0 0;
                position: relative;
            }
            .file-menu-item-remove:after {
                content: "\\d7";
            }
            .file-menu-item-export {
                border-right: 0.09em solid #ffffff;
                border-top: 0.09em solid #ffffff;
                content: "";
                cursor: pointer;
                display: inline-block;
                height: 0.32em;
                margin: 2px 8px 0 0;
                position: relative;
                transform: rotate(135deg);
                width: 0.32em;
            }
        </style>
        <div class="file-menu-item-wrapper">
            <p id="${fileName}-label" class="file-menu-item-label">${fileName}</p>
            <div id="${fileName}-export" class="file-menu-item-export"></div>
            <div id="${fileName}-remove" class="file-menu-item-remove"></div>
        </div>`;

        shadowRoot.getElementById(`${fileName}-label`).addEventListener('click', this.handleLabelClick);
        shadowRoot.getElementById(`${fileName}-export`).addEventListener('click', this.handleExportClick);
        shadowRoot.getElementById(`${fileName}-remove`).addEventListener('click', this.handleRemoveClick);
        console.log(`${this.id}: added to the DOM.`);
    }

    disconnectedCallback() {
        const fileName = this.getAttribute("id").replace("-menu-item", "");
        this.shadowRoot.getElementById(`${fileName}-label`).removeEventListener('click', this.handleLabelClick);
        this.shadowRoot.getElementById(`${fileName}-export`).removeEventListener('click', this.handleExportClick);
        this.shadowRoot.getElementById(`${fileName}-remove`).removeEventListener('click', this.handleRemoveClick);
        console.log(`${this.id}: removed from the the DOM.`);
    }

    handleLabelClick(event) {
        event.preventDefault();
        const fileDialog = document.createElement("file-dialog");
        const fileDialogId = `${this.id.replace("-label", "")}-dialog`;
        fileDialog.setAttribute("id", fileDialogId);
        fileDialog.setAttribute("class", "file-dialog");
        document.getElementById("tracker-wrapper").appendChild(fileDialog);
    }

    handleExportClick(event) {
        event.preventDefault();
        const fileName = this.id.replace("-export", "");
        console.log(`${this.id}: ya clicked me, boy!`);
    }  // TODO: export

    handleRemoveClick(event) {
        event.preventDefault();
        const fileMenuShadowRoot = document.getElementById("file-menu").shadowRoot;
        const fileName = this.id.replace("-remove", "");
        const wrapper = fileMenuShadowRoot.getElementById("file-menu-wrapper");
        wrapper.removeChild(fileMenuShadowRoot.getElementById(`${fileName}-menu-item`));
    }
}

// add to the registry
customElements.define("file-menu-item", FileMenuItem);