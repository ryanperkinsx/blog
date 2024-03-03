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
}