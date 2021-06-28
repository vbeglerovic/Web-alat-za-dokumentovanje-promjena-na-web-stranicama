const extractParameters = require('./extractParameters.js');
const moment = require('moment');

function addChangeInArray(element, type, before, after, array, startDate) {
    let newChange = {
        id: array.length,
        element: element,
        type: type,
        before: before,
        after: after,
        dateAndTime: moment().format("DD.MM.YYYY HH:mm:ss"),
        time: (new Date() - new Date(startDate))/1000
      }
    array.push(newChange);
}
function getChanges (diff, array, startDate) {
    let red = [];
    let removeElement = false;
    let removed = 0;
    for (i = 0; i < diff.length; i++) {
        if (diff[i].node.includes("body")) {
            let type = "";
            let parameters = extractParameters.getParameters(diff[i].message);
            if (parameters.length == 1 && (!diff[i].message.includes("missed") || (diff[i].message.includes("missed") && !removeElement))) {
                type = diff[i].message;
                addChangeInArray(diff[i].node, type, "","", array, startDate)
            } else if (parameters.length == 2 && diff[i].message.includes("Expected element")) {
                removeElement = false;
                red.push(parameters[1]);
                if (!removeElement || (removeElement && parameters[0]!=red[red.length-removed-1])) { 
                  removed= removed+1; 
                  removeElement = true; 
                  type = "Element " + parameters[0] + " is missed!"
                  addChangeInArray(diff[i].node, type, "", "", array, startDate)
                } else
                  removeElement = true;
                if (parameters[0].toString().toLowerCase() == "script") 
                   addChangeInArray(diff[i].node, "Extra element " + parameters[1], "", "", array, startDate)
            } else if (parameters.length == 2 && diff[i].message.includes("Expected text")) {
                removeElement = false;
                type = "Content changed";
                addChangeInArray(diff[i].node, type, parameters[0], parameters[1], array, startDate)
            } else if (parameters.length == 3) {
                removeElement = false;
                type = "Attributes changed"
                addChangeInArray(diff[i].node, type, parameters[1], parameters[2], array, startDate)
            }
        }
    }
}

module.exports.getChanges = getChanges;