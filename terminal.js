const text = document.getElementById("terminalText");
const forbiddenKeys = ["shift", "escape", "tab", "delete", "arrowup", "arrowdown", "arrowleft", "arrowright", "control", "capslock", "end", "home", "pagedown", "pageup", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"];
let storedString = text.innerHTML;
let selectedChar = storedString.length;
let currentLine = "";

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
        storedString += currentLine + " <br> ";
        runGDC(currentLine);
        currentLine = "";
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
    }else if(!forbiddenKeys.includes(event.key.toLowerCase())){
        currentLine += event.key;
        console.log(event.key);
    }
    text.innerHTML = `<p style="color:rgb(200, 200, 200)">` + storedString + `</p>` + currentLine + "|";
});

function printToTerminal(msg){
    storedString += msg;
    text.innerHTML = `<p style="color:rgb(200, 200, 200)">` + storedString + `</p>` + currentLine + "|";
}

function clearTerminal(){
    currentLine = "";
    storedString = "";
    text.innerHTML = "";
}

setInterval(() => {
    text.innerHTML = `<p style="color:rgb(200, 200, 200)">` + storedString + `</p>` + currentLine + "|";
    setTimeout(() => {
        text.innerHTML = `<p style="color:rgb(200, 200, 200)">` + storedString + `</p>` + currentLine + " ";
    }, 500);
}, 1000);

export {printToTerminal, clearTerminal};