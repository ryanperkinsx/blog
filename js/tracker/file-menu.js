class FileMenu extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            .fm-wrapper { }
        </style>
        <div id="fm-wrapper" class="fm-wrapper">
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

// called when the element is moved to a new document
// (happens in document.adoptNode, very rarely used)
// adoptedCallback() {
// console.log("Custom element moved to new page.");
// }