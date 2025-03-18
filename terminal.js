const text = document.getElementById("terminalText");
let indicator = "|";
const forbiddenKeys = ["alt", "shift", "escape", "tab", "delete", "arrowup", "arrowdown", "arrowleft", "arrowright", "control", "capslock", "end", "home", "pagedown", "pageup", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"];
const wrappers = ["\\"];
const commands = ["help:", "print:", "regress:", "progress:", "unless:", "memory:", "setkey:", "deletekey:", "terminal:", "clear", "clearall"];
const operators =["+", "-", "/", "*", "^", "√", "⊤", "⊥", "?", "!", "<", ">"];
let storedString = text.innerHTML;
let selectedChar = storedString.length;
let currentLine = "";
let prevLine = currentLine;

import runGDC from "./GDCinterpereter.js";

window.addEventListener("keydown", function(event){
    if(event.key.toLowerCase() == "backspace"){
        if(currentLine[currentLine.length-1] == ";" || currentLine[currentLine.length-1] == ">"){
            let temp = "";
            for(let scanIndex = currentLine.length-1; scanIndex >= currentLine.length-7; scanIndex--){
                temp += currentLine[scanIndex];
                if(currentLine[scanIndex] == "&" || currentLine[scanIndex] == "<"){
                    break;
                }
            }
            console.log(temp);
            if(temp == ";pma&"){currentLine = currentLine.substring(0, currentLine.length-5);}
            else if(temp == ";tl&"){currentLine = currentLine.substring(0, currentLine.length-4);}
            else if(temp == ";tg&"){currentLine = currentLine.substring(0, currentLine.length-4);}
            else if(temp == ";touq&"){currentLine = currentLine.substring(0, currentLine.length-6);}
            else if(temp == ";sopa&"){currentLine = currentLine.substring(0, currentLine.length-6);}
            else if(temp != ">rb<"){currentLine = currentLine.substring(0, currentLine.length-1);}
        }else{
            currentLine = currentLine.substring(0, currentLine.length-1);
        }
    }else if(event.key.toLowerCase() == "enter"){
        if(event.shiftKey){
            currentLine += " <br> ";
        }else{
            storedString += currentLine;
            runGDC(currentLine);
            prevLine = currentLine;
            currentLine = "";
        }
    }else if(event.key == "<"){
        if(currentLine[currentLine.length-1] == "-"){
            currentLine = currentLine.substring(0, currentLine.length-1);
            currentLine += "←";
        }else{
            currentLine += "&lt;";
        }
    }else if(event.key == ">"){
        if(currentLine[currentLine.length-1] == "-"){
            currentLine = currentLine.substring(0, currentLine.length-1);
            currentLine += "→";
        }else{
            currentLine += "&gt;";
        }
    }else if(event.key == '"'){
        currentLine += "&quot;";
    }else if(event.key == "'"){
        currentLine += "&apos;";
    }else if(event.key == "&"){
        currentLine += "&amp;";
    }else if(event.key == "ArrowDown"){
        currentLine += "√";
    }else if(event.key == "ArrowUp"){
        currentLine = prevLine;
    }else if(event.key == "e"){
        if(currentLine.substring(currentLine.length-3, currentLine.length) == "tru"){
            currentLine = currentLine.substring(0, currentLine.length-3);
            currentLine += "⊤";
        }else if(currentLine.substring(currentLine.length-4, currentLine.length) == "fals"){
            currentLine = currentLine.substring(0, currentLine.length-4);
            currentLine += "⊥";
        }else{
            currentLine += "e";
        }
        
    }else if(event.key == "ArrowRight"){
        currentLine += "    ";
    }else if(!forbiddenKeys.includes(event.key.toLowerCase())){
        currentLine += event.key;
        console.log(event.key);
    }
    text.innerHTML = `<span style="color:rgb(200, 200, 200)">${storedString}</span><span style="color: white">${currentLine}${indicator}</span>`;
    commands.forEach((item) => {
        text.innerHTML = text.innerHTML.replace(item, `<span style="color:yellow;">${item}</span>`);
    });
    for(let i = 0; i < text.innerHTML.split("\\").length; i++){
        if(i%2 == 0){
            text.innerHTML = text.innerHTML.replace(`\\${text.innerHTML.split("\\")[i]}\\`, `<span style="color:skyblue;">\\${text.innerHTML.split("\\")[i]}\\</span>`);
        }
    };
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

// setInterval(() => {
//     // text.innerHTML = `<span style="color:rgb(200, 200, 200)">` + storedString + `</span>` + currentLine + "|";
//     indicator = "|";
//     setTimeout(() => {
//         // text.innerHTML = `<span style="color:rgb(200, 200, 200)">` + storedString + `</span>` + currentLine + " ";
//         indicator = " ";
//     }, 500);
// }, 1000);

export {printToTerminal, clearTerminal};