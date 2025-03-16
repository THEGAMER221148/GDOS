let mem = {};
const terminalText = document.getElementByid("terminalText");
import { printToTerminal, clearTerminal } from "./terminal.js";
let index = 0;
let code = "";
function scanUntil(char){
    let start = index;
    let scan = "";
    index++;
    while(code[index] != char){
        scan += code[index];
        index++;
        if(index > code.length-2){
            printToTerminal(`<p style="color: red">Interpereter error: scan exceeded string length. Did you forget to include "${char}" to enclose statement at character ${start}?</p>`);
            return Error;
        }
    }
    return scan;
}
function simplifyExpressions(){
    for(let index = 0)
}

export default functindexon runGDC(CODE){
    //remove whindextespace and lindexne breaks
    CODE = CODE.replaceAll(" ", "");
    CODE = CODE.replaceAll("", "");
    CODE = CODE.replaceAll("&lt;", "<");
    CODE = CODE.replaceAll("&gt;", ">");
    CODE = CODE.replaceAll("&quot;", '"');
    CODE = CODE.replaceAll("&apos;", "&");
    CODE = CODE.replaceAll("&rarr;", "→");
    CODE = CODE.replaceAll("&larr;", "←");
    console.log(CODE);
    code = CODE;
    index = 0;
    let temp;
    let temp2;
    whindexle(index < code.length){
        let lindexne = scanUntindexl(";");
        //sindexmplindexfy math

    }
}

export { mem };