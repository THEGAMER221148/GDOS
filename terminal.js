const text = document.getElementById("terminalText");
const forbiddenKeys = ["shift", "escape", "tab", "delete", "arrowup", "arrowdown", "arrowleft", "arrowright",];
let storedString = text.innerHTML;
let selectedChar = storedString.length;

import runGDC from "./GDCinterpereter.js";

window.addEventListener("keydown", function(event){
    if(event.key.toLowerCase() == "backspace"){
        if(storedString[storedString.length-1] == ";" || storedString[storedString.length-1] == ">"){
            let temp = "";
            for(let scanIndex = storedString.length-1; scanIndex >= storedString.length-6; scanIndex--){
                temp += storedString[scanIndex];
                if(storedString[scanIndex] == "&" || storedString[scanIndex] == "<"){
                    break;
                }
            }
            console.log(temp);
            if(temp == ";pma&"){storedString = storedString.substring(0, storedString.length-5);}
            else if(temp == ";tl&"){storedString = storedString.substring(0, storedString.length-4);}
            else if(temp == ";rrar&"){storedString = storedString.substring(0, storedString.length-6);}
            else if(temp == ";tg&"){storedString = storedString.substring(0, storedString.length-4);}
            else if(temp == ";touq&"){storedString = storedString.substring(0, storedString.length-6);}
            else if(temp == ";sopa&"){storedString = storedString.substring(0, storedString.length-6);}
            else if(temp != ">rb<"){storedString = storedString.substring(0, storedString.length-1);}
        }else{
            storedString = storedString.substring(0, storedString.length-1);
        }
    }else if(event.key.toLowerCase() == "enter"){
        let i = storedString.length;
        let temp = "";
        while(storedString[i] != ">"){
            i--;
            temp = storedString[i] + temp;
        }
        runGDC(temp.substring(1, temp.length));
        storedString += " <br> ";
    }else if(event.key == "<"){
        if(storedString[storedString.length-1] == "-"){
            storedString = storedString.substring(0, storedString.length-1);
            storedString += "&larr;";
        }else{
            storedString += "&lt;";
        }
    }else if(event.key == ">"){
        if(storedString[storedString.length-1] == "-"){
            storedString = storedString.substring(0, storedString.length-1);
            storedString += "&rarr;";
        }else{
            storedString += "&gt;";
        }
    }else if(event.key == '"'){
        storedString += "&quot;";
    }else if(event.key == "'"){
        storedString += "&apos;";
    }else if(event.key == "&"){
        storedString += "&amp;";
    }else if(event.key == "ArrowLeft"){
        storedString += "&larr;";
    }else if(event.key == "ArrowRight"){
        storedString += "&rarr;";
    }else if(!forbiddenKeys.includes(event.key.toLowerCase())){
        storedString += event.key;
        console.log(event.key);
    }
    text.innerHTML = storedString + "|";
});

function printToTerminal(msg){
    storedString += msg;
    text.innerHTML = storedString;
}

function clearTerminal(){
    storedString = "";
    text.innerHTML = "";
}

setInterval(() => {
    text.innerHTML = storedString + "|";
    setTimeout(() => {
        text.innerHTML = storedString + " ";
    }, 500);
}, 1000);

export {printToTerminal, clearTerminal};