export const handleFileItemClick = (event) => {
    event.preventDefault();  // prevent default to allow drop
    console.log("ya clicked me, boy!");
}

export const handleCloseItemClick = (event) => {
    event.preventDefault();  // prevent default to allow drop
    console.log("close!");
}

export const createFileMenuItem = (fileName) => {

    // wrapper
    const wrapper = document.createElement("div");  // create file menu element
    wrapper.setAttribute("id", `${fileName}-item-wrapper`);
    wrapper.setAttribute("class", "file-item-wrapper");

    // file name
    const fileNameItem = document.createElement("p");  // create file menu element
    fileNameItem.setAttribute("id", `${fileName}-item`);
    fileNameItem.setAttribute("class", "file-item-name");
    fileNameItem.addEventListener("click", (event) => { handleFileItemClick(event); });
    fileNameItem.textContent = fileName;
    wrapper.appendChild(fileNameItem);

    // x
    const closeItem = document.createElement("p");  // create file menu element
    closeItem.setAttribute("id", `close-${fileName}-item`);
    closeItem.setAttribute("class", "file-item-close");
    closeItem.textContent = "x";
    closeItem.addEventListener("click", (event) => { handleCloseItemClick(event); });
    wrapper.appendChild(closeItem);

    return wrapper;
}