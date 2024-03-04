import { databases } from "./database.js";
import Util from "./util.js";

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
            this.fileName = this.getAttribute("filename");
            if (this.fileName) {
                // begin query: getTrainingBlockIdAndNames()
                databases[this.fileName].getTrainingBlockIdAndNames().then((data) => {
                    // begin loop
                    [...data].forEach((page) => {
                        // begin pagination loop
                        [...page.values].forEach((trainingBlock) => {
                            const trainingBlockId = trainingBlock[0];
                            const trainingBlockName = trainingBlock[1];
                            const option = document.createElement("option")
                            option.setAttribute("value", trainingBlockId);
                            option.textContent = trainingBlockName;
                            this.shadowRoot.getElementById("fd-tb-select").appendChild(option);
                            console.log(`fd-tb-select: "${trainingBlockName}" added as an option.`);
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
                color: #ffffff;
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
            #fd-close {
                background-color: #000000;
                border: 2px solid rgba(255, 255, 255, 1);
                cursor: pointer;
                position: absolute;
                top: -12px;
                right: -12px;
                height: 24px;
                width: 24px;
            }
            #fd-close::after {
                color: #ffffff;
                content: "\\d7";
            }
            #fd-display {
                grid-area: tdd;
                overflow-x: scroll;
                overflow-y: scroll;
            }
            #fd-display::-webkit-scrollbar {
                display: none;
            }
            table {
                height: 100%;
                width: 100%;
                top: 0;
                position: relative;
            }
            table, th, td {
                color: inherit;
                border: 2px solid rgba(127, 255, 0, 0.7);
                border-collapse: collapse;  
            }
            th, td {
                width: 10%;
            }
            td {
                text-align: center;
            }
            #fd-menu {
                grid-area: tbm;
                border-left: 3px solid rgba(255, 255, 255, 1);
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 4fr 1fr;
                gap: 0 0;
                grid-template-areas:
                "sm"
                "uf"
                "eb";
            }
            #fd-tb-select {
                grid-area: sm;
                height: 30px;
                width: 90%;
                position: relative;
                top: 25px;
                justify-self: center;
            }
            
            /* form elements */
            #update-form {
                grid-area: uf;
                height: 30%;
                display: grid;
                grid-template-columns: 1fr .2fr 2fr;
                grid-template-rows: 30px 30px 30px 30px;
                gap: 5px 0;
                grid-template-areas:
                "wl    wc    wi"
                "dgs   dgc   dgi"
                "ml    mc    mi"
                "sb    sb    sb";
                place-items: center;
            }
            .uf-label { }
            .uf-label.week {
                grid-area: wl;
            }
            .uf-label.mile {
                grid-area: ml;
            }
            #uf-dg-select {
                grid-area: dgs;
                font-family: inherit;
                background: inherit;
                color: inherit;
                height: 25px;
                width: 65px;
                font-size: medium;
            }
            .uf-colon { }
            .uf-colon.week {
                grid-area: wc;
            }
            .uf-colon.dg {
                grid-area: dgc;
            }
            .uf-colon.mile {
                grid-area: mc;
            }
            p {
                margin: 0;
                text-align: center;
            }
            .uf-input { }
            .uf-input.week {
                grid-area: wi;
            }
            .uf-input.dg {
                grid-area: dgi;
            }
            .uf-input.mile {
                grid-area: mi;
            }
            button {
                grid-area: sb;
                width: 40%;
                height: 25px;
                justify-self: center;
                background: inherit;
                color: inherit;
                font-family: inherit;
                border: 2px solid #ffffff;
            }
            button:disabled {
                opacity: 25%;
            }
            button:enabled:hover {
                background: #ffffff;
                color: #000000;
                border: 2px solid #000000;
            }
            #uf-submit {
                grid-area: sb;
            }
            #fd-export {
                grid-area: eb;
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
                <select id="fd-tb-select">
                    <option id="fd-tb-select-default" value="" selected disabled> - </option>
                </select>
                <form id="update-form">
                    <label class="uf-label week" for="week">Week</label>
                    <p class="uf-colon week">:</p>
                    <input id="uf-input-week" class="uf-input week" type="number" name="week" required disabled>
                    <select id="uf-dg-select" required disabled>
                        <option value="day" selected> Day </option>
                        <option value="goal"> Goal </option>
                    </select>
                    <p id="uf-dg-colon">:</p>
                    <input id="uf-input-dg" type="number" name="day" required disabled>
                    <label id="uf-mile-label" for="miles">Miles</label>
                    <p id="uf-mile-colon">:</p>
                    <input id="uf-input-mile" type="number" name="miles" required disabled>
                    <button id="uf-submit" type="submit" disabled>Update</button>
                </form>
                <button id="fd-export">Export</button>
            </div>
        </div>`;

        shadowRoot.getElementById("fd-close").addEventListener("click", this.handleCloseClick);
        shadowRoot.getElementById("fd-tb-select").addEventListener("change", this.handleSelectChange);
        shadowRoot.getElementById("update-form").addEventListener("submit", this.handleUpdateFormSubmit);
        shadowRoot.getElementById("fd-export").addEventListener("click", this.handleExportClick);
        console.log(`${this.id}: added to the DOM.`)

        // TODO: export button
        // TODO: add + remove week buttons
        // TODO: make prettier
    }

    disconnectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.getElementById("fd-close").removeEventListener("click", this.handleCloseClick);
        shadowRoot.getElementById("fd-tb-select").removeEventListener("change", this.handleSelectChange);
        shadowRoot.getElementById("update-form").removeEventListener("submit", this.handleUpdateFormSubmit);
        shadowRoot.getElementById("fd-export").removeEventListener("click", this.handleExportClick);
        console.log(`${this.id}: removed from the the DOM.`)
    }

    handleCloseClick(event) {
        const fileDialog = document.getElementById(`file-dialog`);

        // reset training block select
        fileDialog.shadowRoot.getElementById("fd-tb-select").value = "";
        Util.clearElements(fileDialog.shadowRoot, "fd-tb-select", "option", "fd-tb-select-default");

        // clear the table
        Util.clearElements(fileDialog.shadowRoot, "fd-table-body", "tr");

        // disable the form
        Util.disableFormElements(fileDialog.shadowRoot,
            ["uf-input-week", "uf-dg-select", "uf-input-dg", "uf-input-mile", "uf-submit"]
        );

        // hide the dialog
        fileDialog.style.display = "none";
        fileDialog.removeAttribute("filename");
    }

    async handleExportClick(event) {
        const fileDialog = document.getElementById("file-dialog");
        const fileName = fileDialog.getAttribute("filename");
        await databases[fileName].exportDb();
    }

    handleSelectChange(event) {
        // variables
        const fileDialog = document.getElementById("file-dialog");
        const fileName = fileDialog.getAttribute("filename");
        const db = databases[fileName];
        const tableBody = fileDialog.shadowRoot.getElementById("fd-table-body");
        const trainingBlockId = this.value;
        let row, cell, miles, totalMiles;  // reusable loop variables

        // clean up fd-table-body
        Util.clearElements(fileDialog.shadowRoot, "fd-table-body", "tr");

        // update the active training block ID
        db._activeTrainingBlockId = trainingBlockId;

        // begin query getWeeksByTrainingBlockId()
        db.getWeeksByTrainingBlockId(trainingBlockId).then((trainingBlockData) => {
            // begin outer loop
            [...trainingBlockData].forEach((trainingBlockPage) => {
                // begin outer pagination loop
                [...trainingBlockPage.values].forEach((week) => {
                    // begin query getDaysByWeekId()
                    db.getDaysByWeekId(week[0]).then((weekData) => {  // week[0] = week.week_id
                        // begin inner loop
                        [...weekData].forEach((weekPage) => {

                            row = document.createElement("tr");
                            cell = document.createElement("td");  // week.week_number cell
                            cell.id = week[0];  // week[0] = week.week_id
                            cell.textContent = week[3];
                            row.appendChild(cell);
                            totalMiles = 0; // reset

                            // begin inner pagination loop
                            [...weekPage.values].forEach((day) => {
                                // TODO: highlight today's day
                                miles = day[3];
                                totalMiles += miles;
                                cell = document.createElement("td");  // day.miles cell
                                cell.id = day[0];  // day[0] = day.day_id
                                cell.textContent = miles;
                                row.appendChild(cell);
                            });  // end inner pagination loop

                            cell = document.createElement("td");  // total day.miles cell
                            cell.id = `${week[0]}-miles`;  // week[0] = week.week_id
                            cell.textContent = totalMiles;
                            row.appendChild(cell);
                            cell = document.createElement("td");  // week.goal cell
                            cell.id = `${week[0]}-goal`;  // week[0] = week.week_id
                            cell.textContent = week[1];
                            row.appendChild(cell);
                            tableBody.appendChild(row);
                        });  // end inner loop
                    });  // end query: getDaysByWeekId()
                });  // end outer pagination loop
            });  // end outer loop

            // enable the form
            Util.enableFormElements(fileDialog.shadowRoot,
                ["uf-input-week", "uf-dg-select", "uf-input-dg", "uf-input-mile", "uf-submit"]
            );
        }).catch((res) => {
            console.log(res);
        });  // end query: getWeeksByTrainingBlockId()
    }

    async handleUpdateFormSubmit(event) {
        event.preventDefault();
        const fileName = document.getElementById("file-dialog").getAttribute("filename");
        const db = databases[fileName];
        const data = new FormData(this);
        const weekNumber = Number(data.get("week"));
        const dayNumber = Number(data.get("day"));
        const miles = Number(data.get("miles"));
        let weekId, dayId;  // reusable loop variables

        // begin query getWeeksByTrainingBlockId()
        await db.getWeeksByTrainingBlockId(db._activeTrainingBlockId).then((data) => {
            // begin data loop
            [...data].forEach((pages) => {
                // begin pagination loop
                [...pages.values].forEach((week) => {
                    if (week[3] === weekNumber) {  // week[3] = week.week_number
                        weekId = week[0];  // week[0] = week.week_id
                        console.log(weekId);
                        throw "week ID found.";
                    }
                });  // end pagination loop
            });  // end loop
            console.log("week ID not found.")
        }).catch((res) => {
            console.log(res);
        });  // end query getWeeksByTrainingBlockId()

        if (weekId) {
            // begin query getDaysByWeekId()
            await db.getDaysByWeekId(weekId).then((data) => {
                // begin data loop
                [...data].forEach((pages) => {
                    // begin pagination loop
                    [...pages.values].forEach((day) => {
                        if (day[2] === dayNumber) {  // day[2] = day.day_number
                            dayId = day[0];  // day[0] = day.day_id
                            throw "day ID found.";
                        }
                    });  // end pagination loop
                });  // end data loop
                console.log("day ID not found.")
            }).catch((res) => {
                console.log(res);
            }); // end query getDaysByWeekId()
        }

        if (dayId) {
            // begin query updateMilesByDayId()
            await db.updateMilesByDayId(miles, dayId).then(() => {
                [...this.getElementsByTagName("input")].forEach((item) => {
                    item.value = "";
                });

                // elements to update
                const fileDialog = document.getElementById("file-dialog").shadowRoot;
                const dayCell = fileDialog.getElementById(dayId);
                const totalMilesCell = fileDialog.getElementById(`${weekId}-miles`);

                // some math
                const prevMiles = Number(dayCell.textContent);
                const prevTotal = Number(totalMilesCell.textContent);
                const newTotal = String(prevTotal - prevMiles + miles);

                // update
                dayCell.textContent = String(miles);
                totalMilesCell.textContent = String(newTotal);
                console.log(`week: ${weekNumber}, day: ${dayNumber} updated to ${miles} miles.`);
            }).catch((res) => {
                console.log(res);
            });
            // end query updateMilesByDayId()
        }
    }
}

// add to the registry
customElements.define("file-dialog", FileDialog);