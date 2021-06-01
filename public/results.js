
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
            td1.appendChild(checkbox);
            let td2 = document.createElement('td');
            let label = document.createElement('label');
            label.innerHTML = files.children[i].name;
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