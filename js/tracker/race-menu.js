class RaceMenu extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            .wrapper { }
        </style>
        <div class="wrapper">
        </div>`;
        console.log(`${this.id}: added to the DOM.`)
    }

    disconnectedCallback() {
        console.log(`${this.id}: removed from the the DOM.`)
    }
}

// add to the registry
customElements.define("race-menu", RaceMenu);

// called when the element is moved to a new document
// (happens in document.adoptNode, very rarely used)
// adoptedCallback() {
// console.log("Custom element moved to new page.");
// }

// called when one of attributes listed above is modified
// attributeChangedCallback(name, oldValue, newValue) {
//     console.log(`Attribute ${name} has changed.`);
//     console.log(`Old value: ${oldValue}`);
//     console.log(`New value: ${newValue}`);
// }