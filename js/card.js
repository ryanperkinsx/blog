class Card extends HTMLElement {
    constructor() {
        super(); // always call super duper

        // set and return this.shadowRoot
        this.attachShadow({mode: "open"});

        // create the div wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        // add the image
        const img = wrapper.appendChild(document.createElement('img'));
        img.setAttribute('class', 'image');
        img.src = this.hasAttribute('img') ? this.getAttribute('img') : 'media/default.png';

        // add to the registry
        customElements.define('card', Card);
    }
}