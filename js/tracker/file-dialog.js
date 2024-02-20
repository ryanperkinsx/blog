class FileDialog extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .file-dialog-wrapper { }
        </style>
        <div class="file-dialog-wrapper">
        </div>`;
        console.log(`${this.id}: added to the DOM.`)

        // TODO: save button
        // TODO: export button
        // TODO: update form
        // TODO: add + remove week buttons
    }

    disconnectedCallback() {
        console.log(`${this.id}: removed from the the DOM.`)
    }  // placeholder
}

// add to the registry
customElements.define("file-dialog", FileDialog);