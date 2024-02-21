class RaceMenu extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            #rm-wrapper { }
        </style>
        <div id="rm-wrapper">
        </div>`;
        console.log(`${this.id}: added to the DOM.`)

        // TODO: build race menu
        // TODO: add race menu options i.e. add, remove
        // TODO: open race page handler
    }

    disconnectedCallback() {
        console.log(`${this.id}: removed from the the DOM.`)
    }
}

// add to the registry
customElements.define("race-menu", RaceMenu);