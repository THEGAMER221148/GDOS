const text = document.getElementById("terminalText");
let indicator = "|";
const forbiddenKeys = ["alt", "shift", "escape", "tab", "delete", "arrowup", "arrowdown", "arrowleft", "arrowright", "control", "capslock", "end", "home", "pagedown", "pageup", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"];
const wrappers = ["\\", "⊤", "⊥"];
const commands = ["help:", "print:", "regress:", "progress:", "unless:", "memory:", "setKey:", "deleteKey:", "terminal:", "clear;", "clearAll;", "listKeys;", "setArray:", "storage:", "run:", "list;", "install;", "open:", "create:", "cloneStoredKey:", "pause:", "stop;"];
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
                if(event.shiftKey){
                    currentLine += "�";
                }else{
                    prevLine = currentLine;
                    storedString += currentLine + "<br>";
                    runGDC(currentLine);
                    currentLine = "";
                }
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
        if(!programBuilder){
            text.innerHTML = `<span style="color:rgb(200, 200, 200)">${storedString}</span><span style="color: white">${currentLine}${indicator}</span>`;
            text.innerHTML = text.innerHTML.replaceAll("�", "<br>");
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
        }
    }else{
        //prog builder code
        switch (event.key.toLowerCase()) {
            case "backspace":
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, selectedChar-1) + storage.savedPrograms[currentProgram].substring(selectedChar, storage.savedPrograms[currentProgram].length);
                selectedChar -= 2;
                break;
            
            case "enter":
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, selectedChar) + "�" + storage.savedPrograms[currentProgram].substring(selectedChar, storage.savedPrograms[currentProgram].length);
                break;

            case "arrowdown":
                storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, selectedChar) + "√" + storage.savedPrograms[currentProgram].substring(selectedChar, storage.savedPrograms[currentProgram].length);
                break;

            case "arrowup":
                storage.savedPrograms[currentProgram] = prevLine;
                break;

            case "arrowleft":
                selectedChar -= 2;
                console.log(selectedChar);
                break;
            
            case "arrowright":
                selectedChar += 0;
                break;

            case "escape":
                programBuilder = false;
                currentProgram = undefined;
                text.innerHTML = storedString;
                break;
            default:
                if(!forbiddenKeys.includes(event.key.toLowerCase())){
                    storage.savedPrograms[currentProgram] = storage.savedPrograms[currentProgram].substring(0, selectedChar) + event.key + storage.savedPrograms[currentProgram].substring(selectedChar, storage.savedPrograms[currentProgram].length);
                }
                break;
        
        }
        selectedChar += selectedChar < storage.savedPrograms[currentProgram].length? 1 : 0;
        let put = storage.savedPrograms[currentProgram];
        put = put.substring(0, selectedChar) + indicator + put.substring(selectedChar, put.length);
        put = put.replaceAll("&", "&amp;");
        put = put.replaceAll("'", "&apos;");
        put = put.replaceAll("<", "&lt;");
        put = put.replaceAll(">", "&gt;");
        put = put.replaceAll('"', "&quot;");
        put = put.replaceAll("�", "<br>");
        text.innerHTML = `<span style="color: white">${put}</span>`;
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
        localStorage.setItem("storage", JSON.stringify(storage));
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

function openEditor(program){
    currentProgram = program;
    programBuilder = true;
    selectedChar = storage.savedPrograms[currentProgram].length;
    let put = storage.savedPrograms[currentProgram];
    put = put.replaceAll("&", "&amp;");
    put = put.replaceAll("'", "&apos;");
    put = put.replaceAll("<", "&lt;");
    put = put.replaceAll(">", "&gt;");
    put = put.replaceAll('"', "&quot;");
    put = put.replaceAll("�", "<br>");
    text.innerHTML = `<span style="color: white">${put}${indicator}</span>`;
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
    localStorage.setItem("storage", JSON.stringify(storage));
    // printToTerminal("Welcome to the GCode editor! Start typing or press Escape to return to the terminal", "lime");
    // printToTerminal(`You are currently editing "${program}"`, "lime");
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
    programBuilder = false;
    runGDC(programCode);
}

export { printToTerminal, clearTerminal, runProgram, openEditor};