// get necessary elements
const terminal = document.getElementById("terminal");
const inputElement = document.getElementById("input");
const variables = {};
let storage = {};
if (localStorage.getItem("GDOSStorage")) {
    storage = JSON.parse(localStorage.getItem("GDOSStorage"));
} else {
    terminal.innerHTML += `<span style="color: rgb(255, 255, 0);">Warning: No existing storage found, starting with empty storage</span><br>`;
}
const defaultConfig = {
    showAdditionalOutput: false,
    warnDangerousPrograms: true,
    saveConfigOptions: true,
    highlightSyntax: true,
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
        if (config.showAdditionalOutput) terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Terminal Cleared!</span><br>`;
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
        /*if (config.saveConfigOptions)*/ localStorage.setItem("GDOSConfig", JSON.stringify(config));
    },
    listStorage: (args) => {
        let storageList = "<span style='color: rgb(0, 255, 0);'>Storage Contents:\n";
        for (const key in storage) {
            storageList += `- ${key}: ${storage[key]}\n`;
        }
        storageList += "</span><br>";
        terminal.innerHTML += storageList;
    },
    save: (args) => {
        storage[args[0]] = args.slice(1).join(" ");
        // make sure user isnt saving too much data to storage
        let json;
        try {
            json = JSON.stringify(storage);
        } catch (e) {
            terminal.innerHTML += `<span style="color:red;">Error: Storage contains circular references</span><br>`;
            return;
        }

        const storageSize = new Blob([json]).size;

        if (storageSize > 4.8 * 1024 * 1024) {
            terminal.innerHTML += `<span style="color:red;">Error: Storage limit exceeded (4.8MB)</span><br>`;
            return;
        }
        if (config.showAdditionalOutput) terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Saved "${args.slice(1).join(" ")}" to storage with key "${args[0]}" (${(storageSize / 1024 / 1024).toFixed(2)}/4.8 MB used)</span><br>`;
        localStorage.setItem("GDOSStorage", JSON.stringify(storage));
    },
    delete: (args) => {
        if (storage[args[0]] === undefined) {
            terminal.innerHTML += `<span style="color: red;">Error: Storage key "${args[0]}" not found</span><br>`;
        } else {
            delete storage[args[0]];
            localStorage.setItem("GDOSStorage", JSON.stringify(storage));
            if (config.showAdditionalOutput) terminal.innerHTML += `<span style="color: rgb(0, 255, 0);">Deleted storage key "${args[0]}"</span><br>`;
        }
    },

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
            line = line.replace(variable, variables[variable]);
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

function highlightSyntax(code) {
    // Prepare Code //
    // separate strings (split the code by " and take the odd indexed elements)
    const originalCode = code;
    let strings = originalCode.split('"').filter((_, i) => i % 2 === 1);
    
    // Convert index to letter (0->A, 1->B, etc) so placeholders have no digits
    const indexToLetter = (n) => String.fromCharCode(65 + (parseInt(n) % 26));
    
    // extract strings in code
    if (code.split('"').length - 1 >= 2) {
        for (const i in strings) {
            const letter = indexToLetter(i);
            code = code.replace(`"${strings[i]}"`, `__PLACEHOLDER_${letter}__`);
        }
    }
    // highlight numbers in line
    code = code.replace(/(\d+)\s*/g, (_, num) => {
        return `<span style="color: rgb(200, 100, 100);">${num}</span>`;
    });
    // simplify boolean expressions in line
    code = code.replace(/(true|false)\s*/g, (_, exp) => {
        return `<span style="color: rgb(200, 150, 100);">${exp}</span>`;
    });
    // highlight variables in line
    for (const variable in variables) {
        code = code.replace(variable, `<span style="color: rgb(100, 100, 200);">${variable}</span>`);
    }

    // split line into command and arguments
    const splits = code.split(":");
    // highlight commands
    code = code.replace(`${splits[0]}:`, `<span style="color: rgb(255, 255, 50);">${splits[0]}:</span>`);

    // add strings back and highlight them
    if (strings.length > 0) {
        for (const i in strings) {
            const letter = indexToLetter(i);
            code = code.replace(`__PLACEHOLDER_${letter}__`, `<span style='color: rgb(100, 200, 100);'>"${strings[i]}"</span>`);
        }
    }
    return code;
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
    inputElement.innerHTML = `> ${highlightSyntax(inputLine)}`;
});
