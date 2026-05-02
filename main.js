// get necessary elements
const terminal = document.getElementById("terminal");
const inputElement = document.getElementById("input");
const variables = {};
const commands = {
    help: (args) => {
        terminal.innerHTML += "Available Commands:\n";
        for (const command in commands) {
            terminal.innerHTML += `- ${command}\n`;
        }
    },
    clear: (args) => {
        terminal.innerHTML = "";
    },
    print: (args) => {
        terminal.innerHTML += args + "<br>";
    },
    def: (args) => {
        variables[args[0]] = args[1];
    }
}
let inputLine = "";

function processCode(code) {
    // Step 1: Prepare Code
    // separate strings (split the code by " and take the odd indexed elements)
    let strings = code.split('"').filter((_, i) => i % 2 === 1);
    // remove strings from code and replace them with placeholders
    for (const i in strings) {
        code = code.replace(`"${strings[i]}"`, `__STRING${i}__`);
    }
    // separate lines
    const lines = code.split(";").map(line => line.trim()).filter(line => line.length > 0);

    // Step 2: Execute Code
    for (let line of lines) {
        // replace variables in line
        for (const variable in variables) {
            line = line.replace(new RegExp(`\\b${variable}\\b`, "g"), variables[variable]);
        }
        // split line into command and arguments
        const splits = line.split(":").map(part => part.trim());
        // try executing command, if it doesn't exist, print error
        try {
            commands[splits[0]](splits.slice(1).map((arg) => arg.replace(/__STRING(\d+)__/g, (_, i) => strings[i])));
        } catch {
            terminal.innerHTML += `<span style="color: red;">Error: Command "${splits[0]}" not found</span><br>`;
        }
    }
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
