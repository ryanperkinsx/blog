class RaceDialog extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            .rd-wrapper { }
        </style>
        <div id="rd-wrapper" class="rd-wrapper">
        </div>`;
        console.log(`${this.id}: added to the DOM.`)

        // TODO: save button
        // TODO: update form
    }

    disconnectedCallback() {
        console.log(`${this.id}: removed from the the DOM.`)
    }  // placeholder
}

// add to the registry
customElements.define("race-dialog", RaceDialog);