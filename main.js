// get necessary elements
const terminal = document.getElementById("terminal");
const inputElement = document.getElementById("input");
const variables = {};
let inputLine = "";

function processCode(code) {
    // separate strings (split the code by " and take the odd indexed elements)
    let strings = code.split('"').filter((_, i) => i % 2 === 1);
    // remove strings from code and replace them with placeholders
    for (const i in strings) {
        code = code.replace(`"${strings[i]}"`, `__STRING${i}__`);
    }
    // separate lines
    const lines = code.split(";").map(line => line.trim()).filter(line => line.length > 0);
    
    terminal.innerHTML += `${code}<br>`;
}

// event listeners for input
document.addEventListener("keydown", (event) => {
    // normal key presses
    if (event.key.length === 1) {
        inputLine += event.key;
    }
    // backspace
    switch (event.key.toLowerCase()) {
        case "backspace":
            inputLine = inputLine.slice(0, -1);
            break;
        case "delete":
            inputLine = "";
            break;
        case "enter":
            processCode(inputLine);
            inputLine = "";
            break;
        default:
            break;
    }
    inputElement.innerText = `> ${inputLine}`;
});
