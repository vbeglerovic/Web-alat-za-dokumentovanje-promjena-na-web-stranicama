function compareStrings (string1, string2) {
    string1 = string1.replace(/ /g, "")
    string2 = string2.replace(/ /g, "")
    let array1 = string1.split(";")
    let array2 = string2.split(";")
    if (array1[array1.length-1]=="")
    array1.pop()
    if (array2[array2.length-1]=="")
    array2.pop()
    array1 = JSON.stringify(array1.sort())
    array2 = JSON.stringify(array2.sort())
    if (array1 == array2 )
        return true
    return false
    
}

function compareArrays (array1, array2) {
    let changesArray1 = []
    let changesArray2 = []

    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i].element.toString() == array2[j].element.toString() && array1[i].type.toString() == array2[j].type.toString() && compareStrings(array1[i].before, array2[j].before) &&  compareStrings(array1[i].after, array2[j].after)) {
                let newChange = {
                    element: array1[i].element,
                    type: array1[i].type,
                    before: array1[i].before,
                    after: array1[i].after,
                    time1: array1[i].time,
                    time2: array2[j].time
                }
                changesArray1.push(newChange)
                break
            }
        }
    }
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i].type.toString() == array2[j].type.toString() && array1[i].element.toString() == array2[j].element.toString() && Math.abs(array1[i].time-array2[j].time)<=5) { 
                let newChange = {
                    element: array1[i].element,
                    type: array1[i].type,
                    before1: array1[i].before,
                    after1: array1[i].after,
                    time1: array1[i].time,
                    before2: array2[j].before,
                    after2: array2[j].after,
                    time2: array2[j].time
                }
                changesArray2.push(newChange)
                break
            }
        }
    }

    let changes = {
        changes1: changesArray1,
        changes2: changesArray2
    }
    return changes;
}

module.exports.compareArrays = compareArrays;
module.exports.compareStrings = compareStrings;