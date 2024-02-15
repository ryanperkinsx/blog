class BlockCard extends HTMLElement {
    constructor() {
        super();  // always call super-duper

        // create the wrapper
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        // add the image
        const img = document.createElement("img");
        img.setAttribute("class", "image");
        img.src = this.hasAttribute("img") ? this.getAttribute("img") : "media/default.jpg";

        // css
        const style = document.createElement("style");
        style.textContent = `
        .wrapper {
            border: 2px solid #344890;
        }
        
        .image {
            width: 20%;
        }
        `;

        // create this.shadowRoot
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(style);
        console.log(style.isConnected);
        shadow.appendChild(wrapper);
        wrapper.appendChild(img);
    }

    connectedCallback() {
        console.log("Custom element added to page.");
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
        console.log(`Old value: ${oldValue}`);
        console.log(`New value: ${newValue}`);
    }
}

// add to the registry
customElements.define("block-card", BlockCard);