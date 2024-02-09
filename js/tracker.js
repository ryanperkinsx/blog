/*
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
ref. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
 */

window.addEventListener("DOMContentLoaded", (event) => {
    const target = document.getElementById("dropzone");

    if (target) {
        target.addEventListener("dragover", (event) => {
            event.preventDefault();  // prevent default to allow drop
            console.log("File(s) in drop zone");
        });

        target.addEventListener("drop", (event) => {
            event.preventDefault();  // prevent default action (prevent file from being opened)
            console.log("File(s) dropped");

            if (event.dataTransfer.items) {
                // use DataTransferItemList interface to access the file(s)
                [...event.dataTransfer.items].forEach((item, i) => {
                    // if dropped items aren't files, reject them
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        console.log(`… file[${i}].name = ${file.name}`);
                    }
                });
            } else {
                // use DataTransfer interface to access the file(s)
                [...event.dataTransfer.files].forEach((file, i) => {
                    console.log(`… file[${i}].name = ${file.name}`);
                });
            }
        });
    }
});