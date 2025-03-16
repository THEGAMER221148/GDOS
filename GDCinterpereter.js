let mem = {};
const terminalText = document.getElementById("terminalText");
import { printToTerminal, clearTerminal } from "./terminal.js";
let index = 0;
let code = "";
const ops = ["+", "-", "*", "/", "^", "√", "?", "!", ">", "<"];

function scanUntil(char, line, idx){
    let start = idx;
    let scan = "";
    while(line[idx] != char){
        scan += line[idx];
        idx++;
        if(idx > line.length-1){
            return {result: scan, index: idx, success: false};
            return;
        }
    }
    return {result: scan, index: idx, success: true};
}

function getVars(line){
    line.split(".").forEach((value) => {
        if(value in mem){
            line = line.replace(`.${value}.`, mem[value]);
        }
    })
    return line;
}

function simplifyExpressions(line){
    let tempNum1 = "";
    let tempNum2 = "";
    let operation = "";
    let i = 0;
    while(i < line.length){
        if(!isNaN(line[i])){
            let originalLocation = i;
            tempNum1 = "";
            tempNum2 = "";
            operation = "";
            while(!isNaN(Number(line[i])) || line[i] == "."){
                tempNum1 += line[i];
                i++;
            }
            if(ops.includes(line[i])){
                operation = line[i];
                console.log(operation);
                i++;
                if(!isNaN(Number(line[i])) || line[i] == "."){
                    while(!isNaN(Number(line[i])) || line[i] == "." || i < line.length){
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
                    i = originalLocation;
                }
            }
        }else{
            i++;
        }
    }
    console.log("expressions simplified!");
    return line;
}

export default function runGDC(CODE){
    //remove whitespace and line breaks
    CODE = CODE.replaceAll(" ", "");
    CODE = CODE.replaceAll("&apos;", "'");
    CODE = CODE.replaceAll("&lt;", "<");
    CODE = CODE.replaceAll("&gt;", ">");
    CODE = CODE.replaceAll("&quot;", '"');
    CODE = CODE.replaceAll("&amps;", "&");
    console.log(CODE);
    code = CODE;
    index = 0;
    let temp;
    let temp2;
    while(index < code.length){
        if(scanUntil(";", code, index).success){
            let line = scanUntil(";", code, index).result;
            index += line.length+1;
            //get variables
            line = getVars(line);
            //simplify math
            line = simplifyExpressions(line);
            //handle var declerations
            if(line[0] == `~`){
                let name = scanUntil("=", line, 1);
                let val = scanUntil(";", line, name.index + 1);
                mem[name.result] = val.result;
                printToTerminal(`<p style="color: lime">"${name.result}" has been added to temporary memory and assigned "${val.result}"</p>`);
            }
            printToTerminal(`<p style="color: lime">${line}</p>`)
        }else{
            printToTerminal(`<p style="color: red">Interpereter error: scan exceeded string length. Did you forget to include a semicolon to enclose the line?</p>`);
            return;
        }
    }
}

export { mem };