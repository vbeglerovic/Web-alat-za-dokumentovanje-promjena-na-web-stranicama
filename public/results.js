
var headers1 = ["Element", "Type", "Before", "After", "Time (s)", "Time (s)"]
var headers2 = ["Element", "Type", "Before", "After", "Time (s)", "Before", "After","Time (s)"]
var data = ["Browser", "Url", "Resolution", "Start date and time", "End date and time"]

window.onload = function() {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) {
        let files = JSON.parse(ajax.responseText);
        createTableWithFiles(files)
    }
    if (ajax.readyState == 4 && ajax.status == 404)
        document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
    }
  ajax.open('GET', "http://localhost:8000/allFiles", true);
  ajax.send();
}

function createTableWithFiles (files) {
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

function selectiveCheck (event) {
    var max = 2;
    var checkedChecks = document.querySelectorAll(".check:checked");
    if (checkedChecks.length >= max + 1)
        return false;
}

function makeFirstTable(array) {
    if (document.getElementById("table2")) {
        let table = document.getElementById("table2")
        table.remove()
    }
    let table = document.createElement("table");
    table.setAttribute("id", "table2")
    table.setAttribute("class", "changes")
    let titleTr = document.createElement("tr")
    let title = document.createElement("th")
    title.innerHTML = "Common changes (all parameters except time are the same):"
    title.setAttribute("id", "title1")
    title.colSpan = "6"
    titleTr.appendChild(title)
    table.appendChild(title)
    let tr1 = document.createElement("tr");
    for (i = 0; i < 4; i++) {
        let th = document.createElement("th");
        th.setAttribute("class", "empty")
        tr1.appendChild(th);
    }
    let dat1 = document.createElement("th");
    dat1.setAttribute("id", "dat1Tab2")
    let dat2 = document.createElement("th");
    dat2.setAttribute("id", "dat2Tab2")
    tr1.appendChild(dat1);
    tr1.appendChild(dat2)
    table.appendChild(tr1)
    let tr2 = document.createElement("tr")
    for (i = 0; i < headers1.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = headers1[i];
        tr2.appendChild(th);
    }
    table.appendChild(tr2);
    document.getElementById("desno").appendChild(table)
}

function makeSecondTable (array) {
    if (document.getElementById("table3")) {
        let table = document.getElementById("table3")
        table.remove()
    }
    let table = document.createElement("table");
    table.setAttribute("id", "table3")
    table.setAttribute("class", "changes")
    let titleTr = document.createElement("tr")
    let title = document.createElement("th")
    title.innerHTML = "Common changes (elements and types are the same, the times are about the same):"
    title.setAttribute("id", "title2")
    title.colSpan = "6"
    titleTr.appendChild(title)
    table.appendChild(title)
    let tr1 = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("class", "empty")
    tr1.appendChild(th);
    let th2 = document.createElement("th");
    th2.setAttribute("class", "empty")
    tr1.appendChild(th2);

    let dat1 = document.createElement("th");
    dat1.setAttribute("id", "dat1Tab3")
    //dat1.setAttribute("class", "fileName")
    dat1.colSpan = "3"
    let dat2 = document.createElement("th");
    dat2.setAttribute("id", "dat2Tab3")
    //dat2.setAttribute("class", "fileName")
    dat2.colSpan = "3"
    tr1.appendChild(dat1);
    tr1.appendChild(dat2)
    table.appendChild(tr1)
    let tr2 = document.createElement("tr")
    for (i = 0; i < headers2.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = headers2[i];
        tr2.appendChild(th);
    }
    table.appendChild(tr2);
    document.getElementById("desno").appendChild(table)
}

function updateTableWithData (table, settings1, settings2, fileName1, fileName2) {
    let firstRow = document.createElement("tr")
    let th = document.createElement("th")
        th.setAttribute("class", "empty")
        firstRow.appendChild(th)
    for (i = 0; i < data.length; i++) {
        let th = document.createElement("th")
        th.innerHTML = data[i]
        firstRow.appendChild(th)
    }
    table.appendChild(firstRow)
    let dat1 = document.createElement("th")
    dat1.innerHTML = fileName1;
    let dat2 = document.createElement("th")
    dat2.innerHTML=fileName2
    let secondRow = document.createElement("tr")
    secondRow.appendChild(dat1)
    let thirdRow = document.createElement("tr")
    thirdRow.appendChild(dat2)
    for (i = 0; i < Object.keys(settings1).length; i++) {
        let td1 = document.createElement("td")
        td1.innerHTML = Object.values(settings1)[i]
        let td2 = document.createElement("td")
        td2.innerHTML = Object.values(settings2)[i]
        secondRow.appendChild(td1)
        thirdRow.appendChild(td2)
    }
    table.appendChild(firstRow)
    table.appendChild(secondRow)
    table.appendChild(thirdRow)
}

function compare () {
    if (document.getElementById("data")) {
        let table = document.getElementById("data")
        table.remove();
    }
    let table = document.createElement("table");
    table.setAttribute("id", "data")
    table.setAttribute("class", "changes")
    document.getElementById("desno").appendChild(table)
    makeFirstTable()
    makeSecondTable()
    var checkedChecks = document.querySelectorAll(".check:checked");
    let id1 = checkedChecks[0].id
    let id2 = checkedChecks[1].id
    let label1 = document.getElementById("lab"+id1).innerHTML
    let label2 = document.getElementById("lab"+id2).innerHTML
    document.getElementById("dat1Tab2").innerHTML = label1
    document.getElementById("dat2Tab2").innerHTML = label2
    document.getElementById("dat1Tab3").innerHTML = label1
    document.getElementById("dat2Tab3").innerHTML = label2
    let data = {
        fileName1: label1,
        fileName2: label2
    }
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        let response = JSON.parse(ajax.responseText); 
        updateTableWithData(table, response.data1, response.data2, label1, label2)
        for (i = 0; i < response.changes1.length; i++)
            insertRowInFirstTable(response.changes1[i])
        for (i = 0; i < response.changes2.length; i++)
            insertRowInSecondTable(response.changes2[i])
        

      }
    }
    ajax.open('POST', "http://localhost:8000/compare", true);
    ajax.setRequestHeader("Content-type", "application/json");
    data = JSON.stringify(data)
    ajax.send(data);
}

function insertRowInFirstTable (change) {
    let tr = document.createElement('tr');
                let tdElement = document.createElement('td');
                tdElement.innerHTML = change.element
                let tdTip = document.createElement('td');
                tdTip.innerHTML = change.type 
                let tdPrije = document.createElement('td');
                tdPrije.innerHTML = change.before
                let tdPoslije = document.createElement('td');
                tdPoslije.innerHTML = change.after
                let tdTime1 = document.createElement('td');
                tdTime1.innerHTML = change.time1
                let tdTime2 = document.createElement('td');
                tdTime2.innerHTML = change.time2
                tr.appendChild(tdElement);
                tr.appendChild(tdTip);
                tr.appendChild(tdPrije);
                tr.appendChild(tdPoslije);
                tr.appendChild(tdTime1);
                tr.appendChild(tdTime2);
                document.getElementById("table2").appendChild(tr)
}

function insertRowInSecondTable (change) {
    let tr = document.createElement('tr');
                let tdElement = document.createElement('td');
                tdElement.innerHTML = change.element
                let tdType = document.createElement('td');
                tdType.innerHTML = change.type
                let tdPrije1 = document.createElement('td');
                tdPrije1.innerHTML = change.before1
                let tdPoslije1 = document.createElement('td');
                tdPoslije1.innerHTML = change.after1
                let tdTime1 = document.createElement('td');
                tdTime1.innerHTML = change.time1
                let tdPrije2 = document.createElement('td');
                tdPrije2.innerHTML = change.before2
                let tdPoslije2 = document.createElement('td');
                tdPoslije2.innerHTML = change.after2
                let tdTime2 = document.createElement('td');
                tdTime2.innerHTML = change.time2
                tr.appendChild(tdElement);
                tr.appendChild(tdType);
                tr.appendChild(tdPrije1);
                tr.appendChild(tdPoslije1);
                tr.appendChild(tdTime1);
                tr.appendChild(tdPrije2)
                tr.appendChild(tdPoslije2)
                tr.appendChild(tdTime2);
                document.getElementById("table3").appendChild(tr)
}

