export const clearElement = (root, elementId, tagName, avoid) => {
    const rootElement = root.getElementById(elementId);
    [...rootElement.getElementsByTagName(tagName)].forEach((option) => {
        if (option.id !== avoid) {
            rootElement.removeChild(option);
        }
    });
}