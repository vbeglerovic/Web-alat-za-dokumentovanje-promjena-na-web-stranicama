function validateInputData () {
  let url = document.getElementById('url').value;
  let browser = document.getElementById('pretrazivaci').value;
  let end = document.getElementById('kraj').value;
  if (url == "") {
    alert("Morate unijeti url stranice čije promjene želite da dokumentujete!");
    return false;
  }
  if (end == "") {
    alert("Morate unijeti datum i vrijeme do kojeg će promjene biti praćene!");
    return false;
  }
  let endDate = new Date(end);
  let startDate = new Date();
  data = {
    url: url,
    browser: browser,
    endDate: endDate,
    startDate: startDate
  }
  return data;
}

function documentChanges () {
  let data = validateInputData();
  if (data) {
  
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200)
        document.getElementById("notification").innerHTML = ajax.responseText;
      if (ajax.readyState == 4 && ajax.status == 404)
        document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
    }
    ajax.open('POST', "http://localhost:8000/documentChanges", true);
    ajax.setRequestHeader("Content-type", "application/json");
    let dataSend=JSON.stringify(data);
    ajax.send(dataSend);
  }  
}

function stopTracking () {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function() {
  if (ajax.readyState == 4 && ajax.status == 200)
    document.getElementById("notification").innerHTML = ajax.responseText;
  if (ajax.readyState == 4 && ajax.status == 404)
    document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
  }
  ajax.open('GET', "http://localhost:8000/stopTracking", true);
  ajax.send();
}



