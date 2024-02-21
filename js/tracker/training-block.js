import { databases } from "../database.js";

class TrainingBlock extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const { id, shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .tb-wrapper { 
                background: chocolate;
                grid-area: df;
                height: 98%;
                width: 98%;
                justify-self: center;
            }
        </style>
        <div class="tb-wrapper">
        </div>`;
        console.log(`${id}: added to the DOM.`)
    }

    disconnectedCallback() {
        const { id, shadowRoot } = this;
        console.log(`${id}: removed from the DOM.`)
    }
}

// add to the registry
customElements.define("training-block", TrainingBlock);