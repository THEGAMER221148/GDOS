// get necessary elements
const terminal = document.getElementById("terminal");
const inputLine = document.getElementById("input");

function processCode(code) {
    // separate strings (split the code by " and take the odd indexed elements)
    let strings = code.split('"').filter((_, i) => i % 2 === 1);
    // separate lines
    terminal.innerHTML += `${strings}<br>`;
}

// event listeners for input
document.addEventListener("keydown", (event) => {
    // normal key presses
    if (event.key.length === 1) {
        inputLine.innerText += event.key;
        return;
    }
    // backspace
    switch (event.key.toLowerCase()) {
        case "backspace":
            inputLine.innerText = inputLine.innerText.slice(0, -1);
            break;
        case "delete":
            inputLine.innerText = "";
            break;
        case "enter":
            processCode(inputLine.innerText);
            inputLine.innerText = "";
            break;
        default:
            break;
    }
});
