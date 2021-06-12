
var headers = ["Element", "Tip", "Sadržaj prije", "Sadržaj poslije", "Vrijeme", "Vrijeme"]
window.onload = function() {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) {
        let files = JSON.parse(ajax.responseText);  
        console.log(files.children.length);
        for (i = 0; i < files.children.length; i++) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let checkbox = document.createElement('input');
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("class", "check");
            checkbox.setAttribute("id", i);
            td1.appendChild(checkbox);
            let td2 = document.createElement('td');
            let label = document.createElement('label');
            label.innerHTML = files.children[i].name;
            label.setAttribute("id", "lab"+i)
            td2.appendChild(label);
            tr.appendChild(td1);
            tr.appendChild(td2);
            document.getElementById('table1').appendChild(tr);
        }
        var checks = document.querySelectorAll(".check");
        for (var i = 0; i < checks.length; i++)
            checks[i].onclick = selectiveCheck;
    }
    if (ajax.readyState == 4 && ajax.status == 404)
        document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
    }
  ajax.open('GET', "http://localhost:8000/allFiles", true);
  ajax.send();
}

function selectiveCheck (event) {
    var max = 2;
    var checkedChecks = document.querySelectorAll(".check:checked");
    if (checkedChecks.length >= max + 1)
        return false;
}

function makeTable() {
    let table = document.createElement("table");
    table.setAttribute("id", "table2")
    let tr1 = document.createElement("tr");
    for (i = 0; i < 4; i++) {
        let th = document.createElement("th");
        th.setAttribute("class", "empty")
        tr1.appendChild(th);
    }
    let dat1 = document.createElement("th");
    dat1.setAttribute("id", "dat1")
    let dat2 = document.createElement("th");
    dat2.setAttribute("id", "dat2")
    tr1.appendChild(dat1);
    tr1.appendChild(dat2)
    table.appendChild(tr1)
    let tr2 = document.createElement("tr")
    for (i = 0; i < headers.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = headers[i];
        tr2.appendChild(th);
    }
    table.appendChild(tr2);
    document.getElementById("desno").appendChild(table)
}

function compare () {
    makeTable()
    var checkedChecks = document.querySelectorAll(".check:checked");
    let id1 = checkedChecks[0].id
    let id2 = checkedChecks[1].id
    let label1 = document.getElementById("lab"+id1).innerHTML
    let label2 = document.getElementById("lab"+id2).innerHTML
    document.getElementById("dat1").innerHTML = label1
    document.getElementById("dat2").innerHTML = label2
    let data = {
        fileName1: label1,
        fileName2: label2
    }
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        let data = JSON.parse(ajax.responseText); 
        let array1 = JSON.parse(data.data1);
        let array2 = JSON.parse(data.data2);
        compareArrays (array1, array2);

      }
    }
    ajax.open('POST', "http://localhost:8000/filesContent", true);
    ajax.setRequestHeader("Content-type", "application/json");
    data = JSON.stringify(data)
    ajax.send(data);
}

function compareArrays (array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i].element.toString() == array2[j].element.toString()) {
                console.log("here")
                let tr = document.createElement('tr');
                let tdElement = document.createElement('td');
                tdElement.innerHTML = array1[i].element
                let tdTip = document.createElement('td');
                tdTip.innerHTML = array1[i].tip 
                let tdPrije = document.createElement('td');
                tdPrije.innerHTML = array1[i].sadrzaj_prije
                let tdPoslije = document.createElement('td');
                tdPoslije.innerHTML = array1[i].sadrzaj_poslije
                let tdTime1 = document.createElement('td');
                tdTime1.innerHTML = array1[i].vrijeme
                let tdTime2 = document.createElement('td');
                tdTime2.innerHTML = array2[j].vrijeme
                tr.appendChild(tdElement);
                tr.appendChild(tdTip);
                tr.appendChild(tdPrije);
                tr.appendChild(tdPoslije);
                tr.appendChild(tdTime1);
                tr.appendChild(tdTime2);
                document.getElementById("table2").appendChild(tr)
            }
        }
    }
}

function show () {
    let table2 = document.getElementById("table2");
    table2.remove()
}