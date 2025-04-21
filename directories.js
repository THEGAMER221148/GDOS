let storage = {
    savedPrograms: {

    },
}
//load storage
if(localStorage.getItem("storage") != undefined){
    // JSON.parse(localStorage.getItem("storage")).catch(() => {
    //     console.warn("broken");
    // });
    storage = JSON.parse(localStorage.getItem("storage"));
    // Object.keys(storage.savedPrograms).forEach((item) => {
    //     if(!(storage.savedPrograms[item].toString().charAt(0) == "{" && storage.savedPrograms[item].toString().charAt(storage.savedPrograms[item].toString().length-1) == "}")){
    //         console.log(item);
    //     }
    // });
}

export { storage };