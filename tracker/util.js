export default class Util {
    static clearElements(root, elementId, tagName, avoid) {
        const rootElement = root.getElementById(elementId);
        [...rootElement.getElementsByTagName(tagName)].forEach((option) => {
            if (option.id !== avoid) {
                rootElement.removeChild(option);
            }
        });
    }

    static disableFormElements(root, elementIds) {
        let element;
        [...elementIds].forEach((id) => {
            element = root.getElementById(id);
            element.disabled = true;
        });
    }

    static enableFormElements(root, elementIds) {
        let element;
        [...elementIds].forEach((id) => {
            element = root.getElementById(id);
            element.disabled = false;
        });
    }

    static uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}