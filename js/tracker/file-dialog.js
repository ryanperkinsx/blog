class FileDialog extends HTMLElement {
    static observedAttributes = ["fileName"];

    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
        console.log(`Old value: ${oldValue}`);
        console.log(`New value: ${newValue}`);
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .fd-wrapper { 
                position: absolute;
                top: 50vh;
                left: 50vw;
                transform: translate(-50%, -50%);
                height: 60%;
                width: 40%;
                background-color: rgb(0, 0, 0);
                border: 5px solid rgba(255, 255, 255, 1);
            }
            button.close {
                background-color: #000000;
                border: 2px solid rgba(255, 255, 255, 1);
                cursor: pointer;
                position: absolute;
                top: -12px;
                right: -12px;
                height: 24px;
                width: 24px;
            }
            button.close::after {
                color: #ffffff;
                content: "\\d7";
            }
        </style>
        <div class="fd-wrapper">
            <button id="fd-close" class="close"></button>
        </div>`;

        shadowRoot.getElementById("fd-close").addEventListener("click", this.handleCloseClick);
        console.log(`${this.id}: added to the DOM.`)


        // TODO: save button
        // TODO: export button
        // TODO: update form
        // TODO: add + remove week buttons
    }

    disconnectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.getElementById("fd-close").removeEventListener("click", this.handleCloseClick);
        console.log(`${this.id}: removed from the the DOM.`)
    }  // placeholder

    handleCloseClick(event) {
        const fileDialog = document.getElementById("file-dialog");
        fileDialog.style.display = "none";
    }
}

// add to the registry
customElements.define("file-dialog", FileDialog);