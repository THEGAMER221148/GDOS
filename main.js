// get necessary elements
const terminal = document.getElementById("terminal");
const inputElement = document.getElementById("input");
const variables = {};
const defaultConfig = {
    showAdditionalOutput: false,
    warnDangerousPrograms: true,
    saveConfigOptions: true,
    saveCommandHistory: true,
    maxCommandHistory: 100
};
// load user config from localStorage if it exists, otherwise use default config
let config = { ...defaultConfig };
if (localStorage.getItem("GDOSConfig")) {
    let storedConfig = JSON.parse(localStorage.getItem("GDOSConfig"));
    for (const option in defaultConfig) {
        if (storedConfig[option] !== undefined) {
            config[option] = storedConfig[option];
        } else {
            config[option] = defaultConfig[option];
        }
    }
}
const commands = {
    listCommands: (args) => {
        let commandList = "<span style='color: rgb(0, 255, 0);'>Available Commands:\n";
        for (const command in commands) {
            commandList += `- ${command}\n`;
        }
        commandList += "</span><br>";
        terminal.innerHTML += commandList;
    },
    clear: (args) => {
        terminal.innerHTML = "";
    },
    print: (args) => {
        terminal.innerHTML += args + "<br>";
    },
    def: (args) => {
        variables[args[0]] = args[1];
        if (config.showAdditionalOutput) terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Variable "${args[0]}" defined with value "${args[1]}"</span><br>`;
    },
    config: (args) => {
        switch (args[0]) {
            case "list":
                let configList = "<span style='color: rgb(0, 255, 0);'>Config Options:\n";
                for (const option in config) {
                    configList += `- ${option}: ${config[option]}\n`;
                }
                configList += "</span><br>";
                terminal.innerHTML += configList;
                break;
            case "set":
                if (config[args[1]] === undefined) {
                    terminal.innerHTML += `<span style="color: red;">Error: Config option "${args[1]}" not found</span><br>`;
                } else {
                    if (typeof config[args[1]] === "boolean") {
                        if (args[2].toLowerCase() === "true") {
                            config[args[1]] = true;
                        } else if (args[2].toLowerCase() === "false") {
                            config[args[1]] = false;
                        } else {
                            terminal.innerHTML += `<span style="color: red;">Error: Config option "${args[1]}" requires a boolean value ("true" or "false")</span><br>`;
                            return;
                        }
                    } else if (typeof config[args[1]] === "number") {
                        if (isNaN(args[2])) {
                            terminal.innerHTML += `<span style="color: red;">Error: Config option "${args[1]}" requires a numeric value</span><br>`;
                            return;
                        } else {
                            config[args[1]] = parseFloat(args[2]);
                        }
                    }
                    terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Config option "${args[1]}" set to "${args[2]}"</span><br>`;
                }
                break;
            case "save":
                localStorage.setItem("GDOSConfig", JSON.stringify(config));
                terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Config saved to localStorage</span><br>`;
                break;
            default:
                terminal.innerHTML += `<span style="color: red;">Error: Invalid config command "${args[0]}"</span><br>`;
                break;
        }
        if (config.saveConfigOptions) localStorage.setItem("GDOSConfig", JSON.stringify(config));
    }
}
let inputLine = "";

function processCode(code) {
    // Prepare Code //
    // separate strings (split the code by " and take the odd indexed elements)
    let strings = code.split('"').filter((_, i) => i % 2 === 1);
    // remove strings from code and replace them with placeholders
    for (const i in strings) {
        code = code.replace(`"${strings[i]}"`, `__STRING${i}__`);
    }
    // separate lines
    const lines = code.split(";").map(line => line.trim()).filter(line => line.length > 0);

    // Execute Code //
    for (let line of lines) {
        // replace variables in line
        for (const variable in variables) {
            line = line.replace(new RegExp(`\\b${variable}\\b`, "g"), variables[variable]);
        }
        // simplify math expressions in line
        line = line.replace(/(\d+)\s*([\+\-\*\/\^\%])\s*(\d+)/g, (_, a, operator, b) => {
            a = parseFloat(a);
            b = parseFloat(b);
            switch (operator) {
                case "+":
                    return a + b;
                case "-":
                    return a - b;
                case "*":
                    return a * b;
                case "/":
                    return a / b;
                case "^":
                    return Math.pow(a, b);
                case "%":
                    return a % b;
            }
        });
        // simplify logical expressions in line
        line = line.replace(/(\d+)\s*([\=\~\<\>])\s*(\d+)/g, (_, a, operator, b) => {
            a = parseFloat(a);
            b = parseFloat(b);
            switch (operator) {
                case "=":
                    return a === b;
                case "~":
                    return a !== b;
                case "<":
                    return a < b;
                case ">":
                    return a > b;
            }
        });
        // simplify boolean expressions in line
        line = line.replace(/(true|false)\s*([\=\&\|\!\~])\s*(true|false)/g, (_, a, operator, b) => {
            a = a === "true";
            b = b === "true";
            switch (operator) {
                case "&":
                    return a && b;
                case "|":
                    return a || b;
                case "!":
                    return !a;
                case "=":
                    return a === b;
                case "~":
                    return a !== b;
            }
        });

        // split line into command and arguments
        const splits = line.split(":").map(part => part.trim());
        // try executing command, if it doesn't exist, print error
        try {
            commands[splits[0]](splits.slice(1).map((arg) => arg.replace(/__STRING(\d+)__/g, (_, i) => strings[i])));
        } catch (error) {
            console.error(error);
            switch (error.constructor) {
                case TypeError:
                    if (commands[splits[0]] === undefined) {
                        terminal.innerHTML += `<span style="color: red;">Error: Command "${splits[0]}" not found</span><br>`;
                    } else {
                        terminal.innerHTML += `<span style="color: red;">Error: Invalid arguments for command "${splits[0]}"</span><br>`;
                    }
                    break;
            
                default:
                    terminal.innerHTML += `<span style="color: red;">Unknown Interpreter Error: ${error.message}</span><br>`;
                    break;
            }
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
