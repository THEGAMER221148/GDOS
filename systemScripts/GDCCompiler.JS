let mem = {};
const terminalText = document.getElementById("terminalText");
import { printToTerminal, clearTerminal } from "./terminal.js";
let i = 0;
let code = "";
function scanUntil(char){
    let start = i;
    let scan = "";
    i++;
    while(code[i] != char){
        scan += code[i];
        i++;
        if(i > code.length-2){
            printToTerminal(`<p style="color: red">Compilation error: internal loop exceeded code length. Did you forget to include "${char}" to enclose statement at character ${start}?</p>`);
            return Error;
        }
    }
    return scan;
}
export default function runGDC(CODE){
    //remove whitespace and line breaks
    CODE = CODE.replaceAll(" ", "");
    CODE = CODE.replaceAll("", "");
    CODE = CODE.replaceAll("&lt;", "<");
    CODE = CODE.replaceAll("&gt;", ">");
    CODE = CODE.replaceAll("&quot;", '"');
    CODE = CODE.replaceAll("&apos;", "&");
    CODE = CODE.replaceAll("&rarr;", "→");
    CODE = CODE.replaceAll("&larr;", "←");
    console.log(CODE);

    for(let i = 0; i < CODE.length; i++){
        switch (CODE[i]) {
            case " ":
                
                break;
        
            default:
                break;
        }
    }
    code = CODE;
    i = 0;
    let temp;
    let temp2;
    while(i < code.length){
        //variable decleration
        temp = undefined;
        temp2 = undefined;
        if(code[i] == "~"){
            temp = scanUntil(":", i);
            mem[temp] = undefined;
            temp2 = temp;
            temp = "";
            i++;
            if(code[i] == "#"){
                mem[temp2] = Number(scanUntil("#"));
                i++;
                printToTerminal(`<p style="color: lime">"${temp2}" has been added to runtime memory and assigned "${mem[temp2]}" as its value.</p>`);
            }else if(code[i] == "`"){
                mem[temp2] = scanUntil("`");
                i++;
                printToTerminal(`<p style="color: lime">"${temp2}" has been added to runtime memory and assigned "${mem[temp2]}" as its value.</p>`);
            }else if(code[i] == "."){
                mem[temp2] = mem[scanUntil(".")];
                i++;
            }else{
                printToTerminal(`<p style="color: red">Syntax error: excpected identifier after variable decleration ("#" or "${"`"}" expected, got "${code[i]}".)</p>`);
            }
            if(code[i] != ";"){
                printToTerminal(`<p style="color: red">Syntax error: excpected semicolon after variable definition (";" expected, got "${code[i]}".)</p>`);
            }else{
                i++;
            }
        }
        //function stuff
        else if(code[i] == "/"){
            temp = scanUntil(":");
            switch (temp) {
                //memory commands
                case "mem":
                    switch (scanUntil(":")) {
                        //list
                        case "list":
                            i++;
                            Object.keys(mem).forEach((item) => {
                                printToTerminal(`<p style="color: lime">${item}: ${mem[item]}</p>`);
                            });
                            console.log(mem);
                            break;
                        //clear
                        case "clear":
                            i++;
                            mem = {};
                            printToTerminal("Memory cleared!");
                            break;
                        //help
                        case "help":
                            i++;
                            printToTerminal(`<p style="color: lime">"mem" is a command that can be used to access and modify Gedagadegadagadacode's temporary memory. This includes variables, custom commands, and any other data created and stored during the current session. 
                            Here are all of the commands you can use with "mem": 
                            /mem:help: - Displays this prompt! 
                            /mem:list: - Lists all variables stored in temporary memory and their values.
                            /mem:clear: - Clears all memory. Be careful with this one! 
                            /mem:add: [variables] - Adds data to the memory. Example syntax: mem:add:~var1:#10#~var2:${"`"}more data${"`"};
                            </p>`);
                            break;
                        //add
                        case "add":
                            while(code[i+1] != "→"){
                                temp = scanUntil(":");
                                mem[temp] = scanUntil(";");
                                printToTerminal(`<p style="color: lime">"${temp}" has been added to temporary memory and assigned "${mem[temp]}"</p>`);
                                if(i >= code.length-1){
                                    printToTerminal(`<p style="color: red">Runtime error: excpected "→;" to close bulk add statement. </p>`);
                                    return Error;
                                }
                            }
                            i++;
                            break;
                        default:
                            printToTerminal(`<p style="color: red">Command error: excpected sub-command after memory command </p>`);
                            break;
                    }
                    break;
                case "terminal":
                    switch (scanUntil(":")) {
                        case "clear":
                            clearTerminal();
                            break;
                        case "print":
                            if(code[i] == "`"){
                                console.log(scanUntil("`"));
                                printToTerminal(scanUntil("`"));
                            }else{
                                if(code[i] == "."){
                                    i++
                                    while(code[i] != "."){
                                        temp += code[i];
                                        i++;
                                    }
                                    if(mem[temp] != undefined){
                                        printToTerminal(mem[temp]);
                                    }else{
                                        printToTerminal(`<p style="color: red">Command error: "${temp}" is not included in the system's temporary memory. Did you make this variable? </p>`);
                                    }
                                }
                            }
                            break;
                        default:
                            printToTerminal(`<p style="color: red">Command error: excpected sub-command after terminal command </p>`);
                            break;
                    }
                    break;
                case "flow":
                    let j = 0;
                    temp = "";
                    while(code[i] != ":"){
                        temp += code[i];
                        i++;
                    }
                    i++;
                    switch (temp) {
                        case "regress":
                            if (code[i] != "#") {
                                printToTerminal(`<p style="color: red">Command error: excpected number after regression command </p>`);
                                break;
                            }
                            temp = "";
                            i++;
                            while(code[i] != "#"){
                                temp += code[i];
                                i++;
                            }
                            i++;
                            j = 0;
                            while(j < Number(temp)){
                                i--;
                                if(code[i] == ";"){
                                    j++;
                                }
                                if(i < 0){
                                    printToTerminal(`<p style="color: red">Runtime error: command regressed beyond code start </p>`);
                                }
                            }
                            break;

                        case "progress":
                            if (code[i] != "#") {
                                printToTerminal(`<p style="color: red">Command error: excpected number after progression command </p>`);
                                break;
                            }
                            temp = "";
                            i++;
                            while(code[i] != "#"){
                                temp += code[i];
                                i++;
                            }
                            i++;
                            j = 0;
                            while(j < Number(temp)){
                                i++;
                                if(code[i] == ";"){
                                    j++;
                                }
                                if(i > code.length){
                                    printToTerminal(`<p style="color: red">Runtime error: command progressed beyond code end </p>`);
                                }
                            }
                            break;

                        default:
                            break;
                    }
                    break;
                case "run":
                    temp = ""
                    while(code[i] != ":"){
                        temp += code[i];
                        i++;
                    }
                    i++;
                    switch (temp) {
                        case "code":
                            temp = "";
                            while(code[i] != ";"){
                                temp += code[i];
                                i++;
                            }
                            runGDC(temp);
                            break;
                            
                        case "terminal":
                            printToTerminal(`<p style="color: blue">"Running all code in terminal...</p>`);
                            runGDC(document.getElementById("terminalText").innerHTML.substring(-1, document.getElementById("terminalText").innerHTML.length - 15) + ";");
                            break;
                        default:
                            printToTerminal(`<p style="color: red">Command error: excpected sub-command after run command </p>`);
                            break;
                    }
                    break;
                case "help":
                    window.location.href = "/documentation";
                break;
                default:
                    printToTerminal(`<p style="color: red">Command error: "${temp}" is not recognized as a system command. If you are trying to run a custom command, please use "/run:custom: [command name]" </p>`);
                    break;
            }
            //list memory

        }else{
            i++;
        }
    }
}

export { mem };