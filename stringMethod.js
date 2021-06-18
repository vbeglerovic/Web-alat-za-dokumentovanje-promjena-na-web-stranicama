function getParameters (text) {
    let start=0;
    let newArray=[];
    let insideQoutes=false;
    for (let i = 0; i < text.length; i++) {
        if (text[i]=="'" && insideQoutes==false) {
            start = i+1;
            insideQoutes=true;
        }
        else if (text[i]=="'" && insideQoutes==true) {
            insideQoutes=false;
            newArray.push(text.substring(start,i));
        }
    }
    return newArray;
}

function getParametersBySemicolonAndColon (text) {
    let newArray = text.split(";")
    newArray = newArray.split(":")
}

module.exports.getParameters = getParameters;