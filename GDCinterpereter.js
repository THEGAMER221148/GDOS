let mem = {};
const terminalText = document.getElementById("terminalText");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
import { printToTerminal, clearTerminal, runProgram, openEditor } from "./terminal.js";
import { storage } from "./directories.js";
const ops = ["+", "-", "*", "/", "^", "√", "?", "!", ">", "<"];
let cmdop = false;
let passedCode;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.getElementById("fileInput").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function (event) {
        storage.savedPrograms[ev.target.files[0].name.split(".")[0].replaceAll(" ", "")] = event.target.result;
        printToTerminal(`"${ev.target.files[0].name.split(".")[0].replaceAll(" ", "")}" has been installed.`, "lime");
    };
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
    console.log(line);
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
        if(!isNaN(line[i])){
            originalLocation = i;
            tempNum1 = "";
            tempNum2 = "";
            operation = "";
            while(!isNaN(Number(line[i])) || line[i] == "."){
                tempNum1 += line[i];
                i++;
            }
            if(ops.includes(line[i])){
                operation = line[i];
                i++;
                if(!isNaN(Number(line[i]))){
                    while(!isNaN(Number(line[i])) || line[i] == "."){
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
                        case "!":
                            line = line.replace(`${tempNum1}?${tempNum2}`, `${tempNum1 != tempNum2? "⊤" : "⊥"}`);
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
    // tempNum1 = "";
    // tempNum2 = "";
    // operation = "";
    // i = 0;
    // while(i < line.length){
    //     let originalLocation = i;
    //     if(line[i] == "("){
    //         tempNum1 = scanUntil(")", line, i).result;
    //         let splits = tempNum1.split("")
    //     }
    // }
    console.log("expressions simplified!");
    return line;
}

function runLine(lineToRun, idx){
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

        case "progress":
            if (statements[2] != "unless" || statements[3] != "⊤") {
                progressIndex += Number(statements[1]) + 1;
            }
            break;

        case "regress":
            if (statements[2] != "unless" || statements[3] != "⊤") {
                progressIndex -= Number(statements[1]) + 1;
            }
            break;
            
        case "terminal":
            switch (statements[1]) {
                case "clear":
                    clearTerminal();
                    break;

                case "print":
                    let lineToPrint = statements[2];
                    let splits = lineToPrint.split("{");
                    let symbols = [];
                    for(let i = 0; i < splits.length; i++){
                        symbols.push(splits[i].substring(0, splits[i].indexOf("}")));
                        lineToPrint = lineToPrint.replace(`{${splits[i].substring(0, splits[i].indexOf("}"))}}`, `{}`);
                    };
                    symbols.splice(0, 1);
                    lineToPrint = lineToPrint.replaceAll("'", "&apos; ");
                    lineToPrint = lineToPrint.replaceAll("<", "&lt; ");
                    lineToPrint = lineToPrint.replaceAll(">", "&gt; ");
                    lineToPrint = lineToPrint.replaceAll('"', "&quot; ");
                    lineToPrint = lineToPrint.replaceAll("&", "&amps; ");
                    symbols.forEach((item) => {
                        lineToPrint = lineToPrint.replace("{}", item);
                    });
                    console.log(lineToPrint);
                    printToTerminal(lineToPrint, 'white');
                    break;

                default:
                    printToTerminal(`Expected sub-command after "${statements[0]}". Type "help;" for more information.`, "yellow");
                    break;
            }
            break;

        case "memory":
            switch (statements[1]) {
                case "setKey":
                    mem[statements[2]] = statements[3];
                    if(cmdop){printToTerminal(`"${statements[2]}" has been assigned "${statements[3]}" in temporary memory`, "lime")};
                    break;
                
                case "setArray":
                    mem[statements[2]] = [];
                    for(let i = 3; i < statements.length; i++){
                        mem[statements[2]].push(statements[i]);
                    }
                    if(cmdop){printToTerminal(`"${statements[2]}" has been added to temporary memory and contains "${mem[statements[2]]}"`, "lime")};
                    break;
                case "clearAll":
                    mem = {};
                    if(cmdop){printToTerminal(`Temporary memory has been cleared`, "lime")};
                    break;

                case "deleteKey":
                    delete mem[statements[2]];
                    if(cmdop){printToTerminal(`"${statements[2]}" has been deleted from temporary memory`, "lime")};
                    break;

                case "listKeys":
                    mem.getKeys().forEach((item) => {
                        printToTerminal(`"${item}": "${mem[item]}"`, "lime");
                    });
                    break;
                
                case "cloneStoredKey":
                    mem[statements[2]] = storage[statements[2]];
                    if(cmdop){printToTerminal(`"${statements[2]}" has been cloned to temporary memory`, "lime")};
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
                    Object.keys(storage).forEach((item) => {
                        printToTerminal(`"${item}": ${item == "savedPrograms"?  "programs folder" :  `"${storage[item]}"`}`, item == "savedPrograms"? "green" : "lime");
                    });
                    printToTerminal(`programs: `);
                    Object.keys(storage.savedPrograms).forEach((item) => {
                        printToTerminal(`"${item}"`, "lime");
                    });
                    break;
                    
                case "setKey":
                    storage[statements[2]] = statements[3];
                    if(cmdop){printToTerminal(`"${statements[2]}" has been assigned "${statements[3]}" in system storage`, "lime")};
                    break;
                
                case "setArray":
                    storage[statements[2]] = [];
                    for(let i = 3; i < statements.length; i++){
                        storage[statements[2]].push(statements[i]);
                    }
                    if(cmdop){printToTerminal(`"${statements[2]}" has been added to system storage and contains "${storage[statements[2]]}"`, "lime")};
                    break;

                case "deleteKey":
                    delete storage[statements[2]];
                    if(cmdop){printToTerminal(`"${statements[2]}" has been deleted from system storage`, "lime")};
                    break;
            
                default:
                    printToTerminal(`Expected sub-command after "${statements[0]}". Type "help;" for more information.`, "yellow");
                    break;
            }
            localStorage.setItem("storage", JSON.stringify(storage));
            break;

        case "run":
            if(statements[1] in storage.savedPrograms){
                // printToTerminal(`Running "${statements[1]}"...`);
                // runGDC(storage.savedPrograms[statements[1]]);
                runProgram([statements[1]], storage.savedPrograms[statements[1]]);
            }else{
                printToTerminal(`"${statements[1]}" is not installed as a program. Make sure you typed the name correctly, names are case-sensitive.`, "yellow");
            }
            break;

        case "install":
            document.getElementById("fileInput").click();
            break;
        
        case "create":
            storage.savedPrograms[statements[1]] = "";
            printToTerminal(`Created new program called "${statements[1]}". Use the "open: [program name]" command to start editing.`, "lime");
            localStorage.setItem("storage", JSON.stringify(storage));
            break;

        case "open":
            if(statements[1] in storage.savedPrograms){
                openEditor(statements[1]);
            }else{
                printToTerminal(`"${statements[1]}" is not installed as a program. Make sure you typed the name correctly, names are case-sensitive.`, "yellow");
            }
            break;

        case "pause":
            setTimeout(() => {
                runGDC(passedCode, idx+1);
            }, statements[1]);
            return {progress: progressIndex, continue: false};

        case "stop":
            return {progress: progressIndex, continue: false};
            break;

        case "canvas":
            switch (statements[1]) {
                case "setFillColor":
                    ctx.fillStyle = `rgb(${statements[2]}, ${statements[3]}, ${statements[4]})`;
                    break;
                case "fillRect":
                    ctx.fillRect(statements[2], statements[3], statements[4], statements[5]);
                    break;
            
                default:
                    break;
            }
            break;
        default:
            printToTerminal(`"${statements[0]}" is not recognized as a command.`, "yellow");
            break;
    }
    return {progress: progressIndex, continue: true};
}

export default function runGDC(CODE, startPos){
    passedCode = CODE;
    //remove whitespace and line breaks
    let splits = CODE.split("{");
    let symbols = [];
    for(let i = 0; i < splits.length; i++){
        symbols.push(splits[i].substring(0, splits[i].indexOf("}")));
        CODE = CODE.replace(`{${splits[i].substring(0, splits[i].indexOf("}"))}}`, `{}`);
    };
    symbols.splice(0, 1);
    CODE = CODE.replaceAll(" ", "");
    CODE = CODE.replaceAll("&apos;", "'");
    CODE = CODE.replaceAll("&lt;", "<");
    CODE = CODE.replaceAll("&gt;", ">");
    CODE = CODE.replaceAll("&quot;", '"');
    CODE = CODE.replaceAll("&amps;", "&");
    CODE = CODE.replaceAll("�", "");
    symbols.forEach((item) => {
        CODE = CODE.replace("{}", "{" + item + "}");
    });
    let index = startPos == undefined? 0 : startPos;
    let temp;
    let temp2;
    let lines = CODE.split(";");
    while(index <= lines.length-2){
        let line = lines[index];
        let result = runLine(line, index);
        index += result.progress;
        if(!result.continue){break;}
    }
}

export { mem };