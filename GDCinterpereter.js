let mem = {};
const terminalText = document.getElementById("terminalText");
import { printToTerminal, clearTerminal } from "./terminal.js";
import { storage } from "./directories.js";
const ops = ["+", "-", "*", "/", "^", "√", "?", "!", ">", "<"];

document.getElementById("fileInput").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        console.log(event.target.result); // This contains the file content
    };
    storage.savedPrograms[ev.target.files[0].name.split(".")[0]] = fileReader.readAsText(file);
    printToTerminal(`"${ev.target.files[0].name.split(".")[0]}" has been installed.`, "lime");
});

function scanUntil(char, line, idx){
    let start = idx;
    let scan = "";
    while(line[idx] != char){
        scan += line[idx];
        idx++;
        if(idx > line.length-1){
            return {result: scan, index: idx, success: false};
        }
    }
    return {result: scan, index: idx, success: true};
}

function getVars(line){
    line.split("\\").forEach((value) => {
        if(value in mem){
            line = line.replace(`\\${value}\\`, mem[value]);
        }//else if(typeof value == Array){
        //     line = line.replace(`\\${value}\\→`)
        // }
    });
    return line;
}

function simplifyExpressions(line){
    let tempNum1 = "";
    let tempNum2 = "";
    let operation = "";
    let i = 0;
    while(i < line.length){
        let originalLocation = i;
        if(!isNaN(line[i]) || line[i] == "-"){
            originalLocation = i;
            tempNum1 = "";
            tempNum2 = "";
            operation = "";
            while(!isNaN(Number(line[i])) || line[i] == "." || line[i] == "-"){
                tempNum1 += line[i];
                i++;
            }
            if(ops.includes(line[i])){
                operation = line[i];
                i++;
                if(!isNaN(Number(line[i]))){
                    while(!isNaN(Number(line[i])) || line[i] == "." || line[i] == "-"){
                        tempNum2 += line[i];
                        i++;
                    }
                    tempNum1 = Number(tempNum1);
                    tempNum2 = Number(tempNum2);
                    switch (operation) {
                        case "+":
                            line = line.replace(`${tempNum1}+${tempNum2}`, `${tempNum1 + tempNum2}`);
                            break;
                        case "-":
                            line = line.replace(`${tempNum1}-${tempNum2}`, `${tempNum1 - tempNum2}`);
                            break;
                        case "*":
                            line = line.replace(`${tempNum1}*${tempNum2}`, `${tempNum1 * tempNum2}`);
                            break;
                        case "/":
                            line = line.replace(`${tempNum1}/${tempNum2}`, `${tempNum1 / tempNum2}`);
                            break;
                        case "^":
                            line = line.replace(`${tempNum1}^${tempNum2}`, `${Math.pow(tempNum1, tempNum2)}`);
                            break;
                        case "√":
                            line = line.replace(`${tempNum1}√${tempNum2}`, `${Math.pow(tempNum2, 1/tempNum1)}`);
                            break;
                        case "?":
                            line = line.replace(`${tempNum1}?${tempNum2}`, `${tempNum1 == tempNum2? "⊤" : "⊥"}`);
                            break;
                        case ">":
                            line = line.replace(`${tempNum1}>${tempNum2}`, `${tempNum1 > tempNum2? "⊤" : "⊥"}`);
                            break;
                        case "<":
                            line = line.replace(`${tempNum1}<${tempNum2}`, `${tempNum1 < tempNum2? "⊤" : "⊥"}`);
                            break;
                        default:
                            break;
                    }
                    console.log(line);
                    i = originalLocation;
                }
            }else{
                i++;
            }
        }else{
            i++;
        }
    }
    console.log("expressions simplified!");
    return line;
}

function runLine(lineToRun){
    //get variables
    lineToRun = getVars(lineToRun);
    //simplify math
    lineToRun = simplifyExpressions(lineToRun);
    let statements = lineToRun.split(":");
    let progressIndex = 1;
    //handle commands
    switch (statements[0]) {
        case "help":
            window.location = "/GDOS/docs";
            break;

        case "print":
            statements[1] = statements[1].replaceAll("'", "&apos; ");
            statements[1] = statements[1].replaceAll("<", "&lt; ");
            statements[1] = statements[1].replaceAll(">", "&gt; ");
            statements[1] = statements[1].replaceAll('"', "&quot; ");
            statements[1] = statements[1].replaceAll("&", "&amps; ");
            printToTerminal(statements[1], 'white');
            break;

        case "progress":
            if (statements[2] != "unless" || statements[3] != "⊤") {
                progressIndex += statements[1];
            }
            break;

        case "regress":
            if (statements[2] != "unless" || statements[3] != "⊤") {
                progressIndex -= statements[1];
            }
            break;
            
        case "terminal":
            switch (statements[1]) {
                case "clear":
                    clearTerminal();
                    break;
                default:
                    printToTerminal(`Expected sub-command after "${statements[0]}". Type "help;" for more information.`, "yellow");
                    break;
            }
            break;

        case "memory":
            switch (statements[1]) {
                case "setkey":
                    mem[statements[2]] = statements[3];
                    printToTerminal(`"${statements[2]}" has been assigned "${statements[3]}" in temporary memory`, "lime");
                    break;
                
                case "setarray":
                    mem[statements[2]] = [];
                    for(let i = 3; i < statements.length; i++){
                        mem[statements[2]].push(statements[i]);
                    }
                    printToTerminal(`"${statements[2]}" has been added to temporary memory and contains "${mem[statements[2]]}"`, "lime")
                    break;
                case "clearall":
                    mem = {};
                    break;

                case "deletekey":
                    delete mem[statements[2]];
                    break;

                case "listkeys":
                    mem.getKeys().forEach((item) => {
                        printToTerminal(`"${item}": "${mem[item]}"`, "lime");
                    });
                    break;
                default:
                    printToTerminal(`Expected sub-command after "${statements[0]}". Type "help;" for more information.`, "yellow");
                    break;
            }
            break;
        
        case "storage":
            switch (statements[1]) {
                case "list":
                    printToTerminal(`keys: `);
                    storage.getKeys().forEach((item) => {
                        printToTerminal(`    "${item}": "${item == "savedPrograms"?  "programs folder" : storage[item]}"`, "lime");
                    });
                    printToTerminal(`programs: `);
                    storage.savedPrograms.getKeys().forEach((item) => {
                        printToTerminal(`    "${item}"`, "lime");
                    });
                    break;
                
                case "run":
                    if(statements[2] in storage.savedPrograms){
                        printToTerminal(`Running "${statements[2]}"...`);
                        runGDC(storage.savedPrograms[statements[2]]);
                    }else{
                        printToTerminal(`"${statements[2]}" is not installed as a program. Did you install or create a program called "${statements[2]}"? Make sure you typed the name correctly, names are case-sensitive.`, "yellow");
                    }
                    break;
                    
                case "setkey":
                    storage[statements[2]] = statements[3];
                    printToTerminal(`"${statements[2]}" has been assigned "${statements[3]}" in system storage`, "lime");
                    break;
                
                case "setarray":
                    storage[statements[2]] = [];
                    for(let i = 3; i < statements.length; i++){
                        storage[statements[2]].push(statements[i]);
                    }
                    printToTerminal(`"${statements[2]}" has been added to system storage and contains "${storage[statements[2]]}"`, "lime")
                    break;

                case "deletekey":
                    delete storage[statements[2]];
                    break;
                
                case "install":
                    document.getElementById("fileInput").click();
                    break;
                default:
                    printToTerminal(`Expected sub-command after "${statements[0]}". Type "help;" for more information.`, "yellow");
                    break;
            }
            localStorage.setItem("storage", storage);
            break;
        default:
            printToTerminal(`"${statements[0]}" is not recognized as a command.`, "yellow");
            break;
    }
    return progressIndex;
}

export default function runGDC(CODE){
    //remove whitespace and line breaks
    CODE = CODE.replaceAll(" ", "");
    CODE = CODE.replaceAll("&apos;", "'");
    CODE = CODE.replaceAll("&lt;", "<");
    CODE = CODE.replaceAll("&gt;", ">");
    CODE = CODE.replaceAll("&quot;", '"');
    CODE = CODE.replaceAll("&amps;", "&");
    CODE = CODE.replaceAll("<br>", "")
    console.log(CODE);
    let index = 0;
    let temp;
    let temp2;
    let lines = CODE.split(";");
    while(index <= lines.length-2){
        let line = lines[index];
        index += runLine(line);
    }
}

export { mem };