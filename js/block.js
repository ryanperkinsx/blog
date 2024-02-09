class Block extends HTMLElement {
    constructor() {
        super(); // always call super-duper

        // set and return this.shadowRoot
        const shadow = this.attachShadow({mode: "open"});

        // create the div wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        // add the image
        const img = document.createElement('img');
        img.setAttribute('class', 'image');
        img.src = this.hasAttribute('img') ? this.getAttribute('img') : 'media/default.jpg';

        // CSS
        const style = document.createElement('style');
        console.log(style.isConnected);

        style.textContent = `
        .wrapper {
            border: #000000;
            border-width: 2px;
        }
        
        .image {
            width: 20%;
        }
        `;

        shadow.appendChild(style);
        console.log(style.isConnected);
        shadow.appendChild(wrapper);
        wrapper.appendChild(img);
    }
}

// add to the registry
customElements.define('block-card', Block);