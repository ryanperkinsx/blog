import { databases } from "../database.js";
import Util from "../util.js";

class FileDialog extends HTMLElement {
    static observedAttributes = ["style"];

    constructor() {
        super();  // always call super-duper
        this.attachShadow({mode: 'open'});
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const { id } = this;
        if (name === "style" && newValue === "display: block;") {
            console.log(`${id}: displaying dialog...`);
            if (this.getAttribute("filename") !== null) {
                const fileName = this.getAttribute("filename");

                // begin query: getTrainingBlockIdAndNames()
                databases[fileName].getTrainingBlockIdAndNames().then((data) => {
                    // begin loop
                    [...data].forEach((page) => {
                        // begin pagination loop
                        [...page.values].forEach((trainingBlock) => {
                            const trainingBlockId = trainingBlock[0];
                            const trainingBlockName = trainingBlock[1];
                            const option = document.createElement("option")
                            option.setAttribute("value", trainingBlockId);
                            option.textContent = trainingBlockName;
                            this.shadowRoot.getElementById("fd-select").appendChild(option);
                            console.log(`fd-select: "${trainingBlockName}" added as an option.`);
                        })  // end pagination loop
                    });  // end loop
                }).catch((res) => {
                    console.log(res);
                });  // end query: getTrainingBlockIdAndNames()
            } else {
                console.log(`${id}: filename attribute is required to open!`)
            }
        }
        else if (name === "style" && newValue === "display: none;") {
            console.log(`${id}: closing dialog...`);
        }
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `<style>
            #fd-wrapper { 
                position: absolute;
                top: 50vh;
                left: 50vw;
                transform: translate(-50%, -50%);
                height: 700px;
                width: 1200px;
                background-color: rgb(0, 0, 0);
                border: 5px solid rgba(255, 255, 255, 1);
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 0 0;
                grid-template-areas:
                "tdd  tbm"
            }
            #fd-display {
                grid-area: tdd;
                overflow-x: scroll;
                overflow-y: scroll;
            }
            #fd-display::-webkit-scrollbar {
                display: none;
            }
            #fd-menu {
                grid-area: tbm;
                border: 3px solid #ff00ff;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 3fr 1fr 1fr;
                gap: 0 0;
                grid-template-areas:
                "sm"
                "tdd"
                "tdd"
                "tdd";
            }
            button#fd-close {
                background-color: #000000;
                border: 2px solid rgba(255, 255, 255, 1);
                cursor: pointer;
                position: absolute;
                top: -12px;
                right: -12px;
                height: 24px;
                width: 24px;
            }
            button#fd-close::after {
                color: #ffffff;
                content: "\\d7";
            }
            select {
                grid-area: sm;
                height: 30px;
                width: 90%;
                position: relative;
                top: 25px;
                justify-self: center;
            }
            table {
                height: 100%;
                width: 100%;
                top: 0;
                position: relative;
            }
            table, th, td {
                color: chartreuse;
                border: 2px solid chartreuse;
                border-collapse: collapse;  
            }
            th, td {
                width: 10%;
            }
            td {
                text-align: center;
            }
        </style>
        <div id="fd-wrapper">
            <button id="fd-close"></button>
            <div id="fd-display">
                <table id="fd-table">
                    <thead>
                        <tr>
                            <th> Week # </th>
                            <th> Day 1 </th>
                            <th> Day 2 </th>
                            <th> Day 3 </th>
                            <th> Day 4 </th>
                            <th> Day 5 </th>
                            <th> Day 6 </th>
                            <th> Day 7 </th>
                            <th> Total </th>
                            <th> Goal </th>
                        </tr>
                    </thead>
                    <tbody id="fd-table-body">
                </table> 
            </div>
            <div id="fd-menu">
                <select id="fd-select">
                    <option id="fd-select-default" value="" selected disabled> - </option>
                </select>
            </div>
        </div>`;

        // week |  1  |  2  |  3  |  4  |  5  |  6  |  7  | total(goal)

        shadowRoot.getElementById("fd-close").addEventListener("click", this.handleCloseClick);
        shadowRoot.getElementById("fd-select").addEventListener("change", this.handleSelectChange);
        console.log(`${this.id}: added to the DOM.`)

        // TODO: save button
        // TODO: export button
        // TODO: update form
        // TODO: add + remove week buttons
    }

    disconnectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.getElementById("fd-close").removeEventListener("click", this.handleCloseClick);
        shadowRoot.getElementById("fd-select").removeEventListener("change", this.handleSelectChange);
        console.log(`${this.id}: removed from the the DOM.`)
    }  // placeholder

    handleCloseClick(event) {
        // TODO: ask to save
        const fileDialog = document.getElementById(`file-dialog`);
        fileDialog.style.display = "none";
        fileDialog.removeAttribute("filename");
        Util.clearElement(fileDialog.shadowRoot, "fd-select", "option", "fd-select-default");  // clean up fd-select
        Util.clearElement(fileDialog.shadowRoot, "fd-table-body", "tr");  // clean up fd-table-body
    }

    handleSelectChange(event) {
        // TODO: display all the needful for training blocks...
        const fileDialog = document.getElementById("file-dialog");
        Util.clearElement(fileDialog.shadowRoot, "fd-table-body", "tr");  // clean up fd-table-body
        const fileName = fileDialog.getAttribute("filename");

        // begin query: getWeeksByTrainingBlockId()
        databases[fileName].getWeeksByTrainingBlockId(this.value).then((trainingBlockData) => {
            let row, cell;  // re-usable loop variables
            const tableBody = fileDialog.shadowRoot.getElementById("fd-table-body");

            // begin outer loop
            [...trainingBlockData].forEach((trainingBlockPage) => {
                // begin outer pagination loop
                [...trainingBlockPage.values].forEach((week) => {
                    // begin query: getDaysByWeekId()
                    databases[fileName].getDaysByWeekId(week[0]).then((weekData) => {  // week[0] = week_id
                        // begin inner loop
                        [...weekData].forEach((weekPage) => {
                            row = document.createElement("tr");
                            cell = document.createElement("td");  // week.week_number cell
                            cell.textContent = week[3];
                            row.appendChild(cell);
                            let totalMiles = 0;

                            // begin inner pagination loop
                            [...weekPage.values].forEach((day) => {
                                const miles = day[3];
                                totalMiles += miles;
                                cell = document.createElement("td");  // day.miles cell
                                cell.textContent = miles;
                                row.appendChild(cell);
                            });  // end inner pagination loop

                            cell = document.createElement("td");  // total day.miles cell
                            cell.textContent = totalMiles;
                            row.appendChild(cell);
                            cell = document.createElement("td");  // week.goal cell
                            cell.textContent = week[1];
                            row.appendChild(cell);
                            tableBody.appendChild(row);
                        });  // end inner loop
                    });  // end query: getDaysByWeekId()
                });  // end outer pagination loop
            });  // end outer loop
        }).catch((res) => {
            console.log(res);
        });  // end query: getWeeksByTrainingBlockId()
    }
}

// add to the registry
customElements.define("file-dialog", FileDialog);