const text = document.getElementById("terminalText");
let indicator = "|";
const forbiddenKeys = ["alt", "shift", "escape", "tab", "delete", "arrowup", "arrowdown", "arrowleft", "arrowright", "control", "capslock", "end", "home", "pagedown", "pageup", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"];
const wrappers = ["\\", "⊤", "⊥"];
const commands = ["help:", "print:", "regress:", "progress:", "unless:", "memory:", "setkey:", "deletekey:", "terminal:", "clear;", "clearall;", "listkeys;", "setarray:", "storage:", "run:", "list;", "install;", "open:", "create:"];
const operators = ["+", "-", "*", "^", "√"];
const sussys = ["&amp;", "&lt;", "&quot;", "&apos;", "<br>"];
let storedString = text.innerHTML;
let selectedChar = storedString.length;
let currentLine = "";
let prevLine = currentLine;
let programBuilder = false
let currentProgram = "";

import { storage } from "./directories.js";
import runGDC from "./GDCinterpereter.js";

window.addEventListener("keydown", function(event){
    if(!programBuilder){
        //terminal code
        switch (event.key.toLowerCase()) {
            case "backspace":
                let broken = false;
                sussys.forEach((item) => {
                    console.log(currentLine.lastIndexOf(item));
                    if (currentLine.includes(item) && currentLine.lastIndexOf(item) == currentLine.length-item.length && !broken) {
                        currentLine = currentLine.substring(0, currentLine.length-item.length);
                        broken = true;
                    }
                });
                if(!broken){currentLine = currentLine.substring(0, currentLine.length-1);};
                break;
            
            case "enter":
                prevLine = currentLine;
                storedString += currentLine + "<br>";
                runGDC(currentLine);
                currentLine = "";
                break;

            case "<":
                currentLine += "&lt;";
                break;

            case ">":
                currentLine += "&gt;"
                break;

            case '"':
                currentLine += "&quot;";
                break;

            case "&":
                currentLine += "&amp;"
                break;

            case "ArrowDown":
                currentLine += "√";
                break;

            case "ArrowUp":
                currentLine = prevLine;
                break;

            case "'":
                currentLine += "&apos;";
                break;
            case "e":
                if(currentLine.substring(currentLine.length-3, currentLine.length) == "tru"){
                    currentLine = currentLine.substring(0, currentLine.length-3);
                    currentLine += "⊤";
                }else if(currentLine.substring(currentLine.length-3, currentLine.length) == "fals"){
                    currentLine = currentLine.substring(0, currentLine.length-3);
                    currentLine += "⊥";
                }else{
                    currentLine += event.key;
                }
                break;
            default:
                if(!forbiddenKeys.includes(event.key.toLowerCase())){
                    currentLine += event.key;
                }
                break;
        
        }
        text.innerHTML = `<span style="color:rgb(200, 200, 200)">${storedString}</span><span style="color: white">${currentLine}${indicator}</span>`;
        let splits = text.innerHTML.split("{");
        let symbols = [];
        for(let i = 0; i < splits.length; i++){
            symbols.push(splits[i].substring(0, splits[i].indexOf("}")));
            text.innerHTML = text.innerHTML.replace(`{${splits[i].substring(0, splits[i].indexOf("}"))}}`, `{}`);
        };
        symbols.splice(0, 1);
        commands.forEach((item) => {
            text.innerHTML = text.innerHTML.replaceAll(item, `<span style="color:yellow;">${item}</span>`);
        });
        operators.forEach((op) => {
            text.innerHTML = text.innerHTML.replaceAll(op, `<span style="color:green;">${op}</span>`);
        });
        splits = text.innerHTML.split("\\");
        for(let i = 0; i < splits.length; i++){
            if(i%2 != 0){
                text.innerHTML = text.innerHTML.replaceAll(`\\${splits[i]}\\`, `<span style="color:skyblue;">\\${splits[i]}\\</span>`);
            }
        };
        symbols.forEach((item) => {
            text.innerHTML = text.innerHTML.replace("{}", `<span style="color:red">{${item}}</span>`);
        });
    }else{
        //prog builder code
        if(event.key.toLowerCase() == "backspace"){
            if(storage.savedPrograms[currentProgram][storage.savedPrograms[currentProgram].length-1] == ";" || storage.savedPrograms[currentProgram][storage.savedPrograms[currentProgram].length-1] == ">"){
                let temp = "";
                for(let scanIndex = storage.savedPrograms[currentProgram].length-1; scanIndex >= storage.savedPrograms[currentProgram].length-7; scanIndex--){
                    temp += storage.savedPrograms[currentProgram][scanIndex];
                    if(storage.savedPrograms[currentProgram][scanIndex] == "&" || storage.savedPrograms[currentProgram][scanIndex] == "<"){
                        break;
                    }
                }
                console.log(temp);
                if(temp == ";pma&"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-5);}
                else if(temp == ";tl&"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-4);}
                else if(temp == ";tg&"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-4);}
                else if(temp == ";touq&"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-6);}
                else if(temp == ";sopa&"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-6);}
                else if(temp == ">rb<"){storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-5); console.log("line break deleted.");}
            }else{
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-1);
            }
        }else if(event.key.toLowerCase() == "enter"){
            if(event.shiftKey){
                storage.savedPrograms[currentProgram] += " <br> ";
            }else{
                storedString += storage.savedPrograms[currentProgram] + "<br>";
                runGDC(storage.savedPrograms[currentProgram]);
                prevLine = storage.savedPrograms[currentProgram];
                storage.savedPrograms[currentProgram] = "";
            }
        }else if(event.key == "<"){
            if(storage.savedPrograms[currentProgram][storage.savedPrograms[currentProgram].length-1] == "-"){
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-1);
                storage.savedPrograms[currentProgram] += "←";
            }else{
                storage.savedPrograms[currentProgram] += "&lt;";
            }
        }else if(event.key == ">"){
            if(storage.savedPrograms[currentProgram][storage.savedPrograms[currentProgram].length-1] == "-"){
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-1);
                storage.savedPrograms[currentProgram] += "→";
            }else{
                storage.savedPrograms[currentProgram] += "&gt;";
            }
        }else if(event.key == '"'){
            storage.savedPrograms[currentProgram] += "&quot;";
        }else if(event.key == "'"){
            storage.savedPrograms[currentProgram] += "&apos;";
        }else if(event.key == "&"){
            storage.savedPrograms[currentProgram] += "&amp;";
        }else if(event.key == "ArrowDown"){
            storage.savedPrograms[currentProgram] += "√";
        }else if(event.key == "ArrowUp"){
            storage.savedPrograms[currentProgram] = prevLine;
        }else if(event.key == "e"){
            if(storage.savedPrograms[currentProgram].substring(storage.savedPrograms[currentProgram].length-3, storage.savedPrograms[currentProgram].length) == "tru"){
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-3);
                storage.savedPrograms[currentProgram] += "⊤";
            }else if(storage.savedPrograms[currentProgram].substring(storage.savedPrograms[currentProgram].length-4, storage.savedPrograms[currentProgram].length) == "fals"){
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, storage.savedPrograms[currentProgram].length-4);
                storage.savedPrograms[currentProgram] += "⊥";
            }else{
                storage.savedPrograms[currentProgram] += "e";
            }
            
        }else if(event.key == "ArrowRight"){
            storage.savedPrograms[currentProgram] += "    ";
        }else if(!forbiddenKeys.includes(event.key.toLowerCase())){
            storage.savedPrograms[currentProgram] += event.key;
            console.log(event.key);
        }
        text.innerHTML = `<span style="color:rgb(200, 200, 200)">${storedString}</span><span style="color: white">${storage.savedPrograms[currentProgram]}${indicator}</span>`;
        commands.forEach((item) => {
            text.innerHTML = text.innerHTML.replaceAll(item, `<span style="color:yellow;">${item}</span>`);
        });
        operators.forEach((op) => {
            text.innerHTML = text.innerHTML.replaceAll(op, `<span style="color:green;">${op}</span>`);
        });
        let splits = text.innerHTML.split("\\");
        for(let i = 0; i < splits.length; i++){
            if(i%2 != 0){
                text.innerHTML = text.innerHTML.replaceAll(`\\${splits[i]}\\`, `<span style="color:skyblue;">\\${splits[i]}\\</span>`);
            }
        };
        this.localStorage.setItem("storage", storage);
    }
});

function printToTerminal(msg, color){
    storedString += `<br><span style="color:${color}">${msg}</span><br>`;
    text.innerHTML = `<span style="color:rgb(200, 200, 200)">` + storedString + `</span>` + currentLine;
}

function clearTerminal(){
    currentLine = "";
    storedString = "";
    text.innerHTML = "";
}

function stopTerminal(program){
    currentProgram = program;
    programBuilder = true;
    clearTerminal();
}

text.innerHTML = `<span style="color:rgb(200, 200, 200)">${storedString}</span><span style="color: white">${currentLine}${indicator}</span>`;
commands.forEach((item) => {
    text.innerHTML = text.innerHTML.replace(item, `<span style="color:yellow;">${item}</span>`);
});
let splits = text.innerHTML.split("\\");
for(let i = 0; i < splits.length; i++){
    if(i%2 != 0){
        text.innerHTML = text.innerHTML.replace(`\\${splits[i]}\\`, `<span style="color:skyblue;">\\${splits[i]}\\</span>`);
    }
};

function runProgram(name, programCode){
    printToTerminal(`running "${name}"...`, "lime");
    setTimeout(() => {
        runGDC(programCode);
    }, 100);
}

export { printToTerminal, clearTerminal, runProgram, stopTerminal};