// ref. https://javascript.info/custom-elements

class FileMenuItem extends HTMLElement {
    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const {shadowRoot} = this;
        shadowRoot.innerHTML = `<style>
            .wrapper {
                border: 2px solid #ffffff;
                border-top: hidden;
                border-right: hidden;
                display: flex;
                justify-content: space-between;
                margin: 10px 8px;
                text-align: left;
            }
        
            .label {
                color: #ffffff;
                cursor: pointer;
                display: inline;
                font-size: small;
                margin: 0 0 2px 4px;
                text-align: left;
                width: 90%;
            }
        
            .remove {
                cursor: pointer;
                display: inline;
                font-size: small;
                margin: 0 4px 0 0;
                order: 1;
            }
        
            .remove:after {
                content: '\\d7';
                color: #ffffff;
            }
        </style>
        <div class="wrapper">
            <p class="label"></p>
            <div class="remove"></div>
        </div>`;

        shadowRoot.querySelector(".label").textContent = this.getAttribute("id");
        shadowRoot.querySelector(".label").addEventListener('click', this.handleLabelClick);
        shadowRoot.querySelector(".remove-button").addEventListener('click', this.handleRemoveClick);

        // TODO: export button
        // const exportItem = document.createElement("div");
        // exportItem.style.cursor = "pointer";
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector(".label").addEventListener('click', this.handleLabelClick);
        this.shadowRoot.querySelector(".remove-button").addEventListener('click', this.handleRemoveClick);
    }

    handleLabelClick(event) {
        event.preventDefault();
        console.log("ya clicked me, boy!");
    }

    handleRemoveClick(event) {
        event.preventDefault();
        document.getElementById("file-menu").removeChild(document.getElementById(this.id));
        console.log(`${this.id}: file menu item removed.`)
    }
}

// add to the registry
customElements.define("file-menu-item", FileMenuItem);

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