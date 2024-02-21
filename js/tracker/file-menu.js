class FileMenu extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            #fm-wrapper { }
        </style>
        <div id="fm-wrapper">
        </div>`;
        console.log(`${this.id}: added to the DOM.`)

        // TODO: add option for a new database
    }

    disconnectedCallback() {
        console.log(`${this.id}: removed from the the DOM.`)
    }  // placeholder
}

// add to the registry
customElements.define("file-menu", FileMenu);