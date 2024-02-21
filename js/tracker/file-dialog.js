import {databases} from "../database.js";

class FileDialog extends HTMLElement {
    static observedAttributes = ["style"];

    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    addTrainingBlock(database) {
        // TODO: prompt user to select a training-block
        databases[database].getTrainingBlockByName("first 100").then((value) => {  // TODO: remove hard-code
            const trainingBlock = document.createElement("training-block");
            const trainingBlockId = value["training_block_id"];
            trainingBlock.setAttribute("id", trainingBlockId);
            this.shadowRoot.getElementById("fd-wrapper").appendChild(trainingBlock);
            // const weeks = databases[this.fileName].getWeeksByTrainingBlockId(trainingBlockId);
        }).catch((res) => {
            console.log(res);
        });
    }

    displayTrainingBlock(database) {
        databases[database].getTrainingBlockNames().then((trainingBlockNames) => {
            [...trainingBlockNames[0]["values"]].forEach((name) => {
                console.log(name);
            });
        }).catch((res) => {
            console.log(res);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const { id } = this;
        if (name === "style" && newValue === "display: block;") {
            console.log(`${id}: displaying dialog...`);
            this.getAttribute("database") !== null
                ? this.displayTrainingBlock(this.getAttribute("database"))
                : console.log(`${id}: database attribute is required to open!`);
        }
        else if (name === "style" && newValue === "display: none;") {
            console.log(`${id}: closing dialog...`);
        }
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            .fd-wrapper { 
                position: absolute;
                top: 50vh;
                left: 50vw;
                transform: translate(-50%, -50%);
                height: 700px;
                width: 1200px;
                background-color: rgb(0, 0, 0);
                border: 5px solid rgba(255, 255, 255, 1);
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 2fr 1fr;
                gap: 0 0;
                grid-template-areas:
                "df   uw"
                "dfm  uw";
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
        <div id="fd-wrapper" class="fd-wrapper">
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
        const fileDialog = document.getElementById(`file-dialog`);
        fileDialog.removeAttribute("database");
        fileDialog.style.display = "none";
        // TODO: ask to save
    }
}

// add to the registry
customElements.define("file-dialog", FileDialog);