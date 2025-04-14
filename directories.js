let storage = {
    savedPrograms: {

    },
}

if(localStorage.getItem("storage") != undefined){
    storage = JSON.parse(localStorage.getItem("storage"));
}

export { storage };