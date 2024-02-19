class FileMenuItem extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const fileName = this.getAttribute("id");
        const { shadowRoot } = this;
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
                margin: 0 0 2px 4px;
                text-align: left;
                width: 90%;
                user-select: none; /* Standard syntax */
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
            }
            .file-menu-item-remove {
                cursor: pointer;
                display: inline;
                font-size: medium;
                margin: 0 4px 0 0;
                order: 1;
            }
            .file-menu-item-remove:after {
                content: '\\d7';
                color: #ffffff;
            }
        </style>
        <div class="file-menu-item-wrapper">
            <p id="${fileName}-label" class="file-menu-item-label">${fileName}</p>
            <div id="${fileName}-remove" class="file-menu-item-remove"></div>
        </div>`;

        shadowRoot.getElementById(`${fileName}-label`).addEventListener('click', this.handleLabelClick);
        shadowRoot.getElementById(`${fileName}-remove`).addEventListener('click', this.handleRemoveClick);
        console.log(`${this.id}: added to the DOM.`)

        // TODO: export button
    }

    disconnectedCallback() {
        const fileName = this.getAttribute("id");
        this.shadowRoot.getElementById(`${fileName}-label`).addEventListener('click', this.handleLabelClick);
        this.shadowRoot.getElementById(`${fileName}-remove`).addEventListener('click', this.handleRemoveClick);
        console.log(`${this.id}: removed from the the DOM.`);
    }

    handleLabelClick(event) {
        event.preventDefault();
        console.log(`${this.id}: ya clicked me, boy!`);

        // TODO: display training block
    }

    handleRemoveClick(event) {
        event.preventDefault();
        const fileMenuShadowRoot = document.getElementById("file-menu").shadowRoot;
        const fileName = this.id.replace("-remove", "");
        const wrapper = fileMenuShadowRoot.getElementById("file-menu-wrapper");
        wrapper.removeChild(fileMenuShadowRoot.getElementById(fileName));
    }
}

// add to the registry
customElements.define("file-menu-item", FileMenuItem);