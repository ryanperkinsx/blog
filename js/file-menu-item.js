export const handleFileItemClick = (event) => {
    event.preventDefault();  // prevent default to allow drop
    console.log("ya clicked me, boy!");
}

export const handleCloseItemClick = (event) => {
    event.preventDefault();  // prevent default to allow drop
    const fileMenu = document.getElementById("file-menu");
    const fileName = event.target.id;
    fileMenu.removeChild(document.getElementById(`${fileName}-item-wrapper`));
    console.log(`${fileName}: file removed.`)
}

export const createFileMenuItem = (fileName) => {
    // wrapper
    const wrapper = document.createElement("div");  // create file menu element
    wrapper.setAttribute("id", `${fileName}-item-wrapper`);
    wrapper.setAttribute("class", "file-item-wrapper");

    // file name
    const fileNameItem = document.createElement("p");  // create file menu element
    fileNameItem.setAttribute("id", `${fileName}-label`);
    fileNameItem.setAttribute("class", "file-item-label");
    fileNameItem.addEventListener("click", (event) => { handleFileItemClick(event); });
    fileNameItem.textContent = fileName;
    wrapper.appendChild(fileNameItem);

    // x
    const closeItem = document.createElement("p");  // create file menu element
    closeItem.setAttribute("id", `${fileName}`);
    closeItem.setAttribute("class", "file-item-remove");
    closeItem.textContent = "X";
    closeItem.addEventListener("click", (event) => { handleCloseItemClick(event); });
    wrapper.appendChild(closeItem);

    return wrapper;
}