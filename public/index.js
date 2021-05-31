var mobileResolutions = ['360x640','375x667','414x896','360x780','360x760','414x736'];
var desktopResolutions = ['1366x768','1920x1080','1536x864','1440x900','1280x720','1600x900', '1280x800']
var tabletResolutions = ['768×1024','1280×800','800×1280','601×962','600×1024','1024×1366']

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
  //let startDate = new Date();
  let resolution = document.getElementById("rezolucija");
  let value = resolution.options[resolution.selectedIndex].text;
  let width = value.split("x")[0];
  let height = value.split("x")[1];
  data = {
    url: url,
    browser: browser,
    endDate: endDate,
    //startDate: startDate,
    width: width,
    height: height
  }
  return data;
}

function setResolutions () {
  let lista = document.getElementById("rezolucija");
  let size = lista.childElementCount;
  for (let i=size-1; i>=0; i--) 
    document.getElementById('rezolucija').remove(i)
  if (document.getElementById("mobitel").selected) {
    for (let i=0; i<mobileResolutions.length; i++) {
      let opcija = document.createElement("option");
      opcija.text = mobileResolutions[i];
      lista.add(opcija);
    }
  } else if (document.getElementById("tablet").selected) {
    for (let i=0; i<tabletResolutions.length; i++) {
      let opcija = document.createElement("option");
      opcija.text = tabletResolutions[i];
      lista.add(opcija);
    } 
  } else {
    for (let i=0; i<desktopResolutions.length; i++) {
      let opcija = document.createElement("option");
      opcija.text = desktopResolutions[i];
      lista.add(opcija);
    } 
  }
}

function checkStatusRequest () {
  let ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) 
      document.getElementById("notification").innerHTML = ajax.responseText;
    if (ajax.readyState == 4 && ajax.status == 404)
      document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
    }
    ajax.open('GET', "http://localhost:8000/checkStatus", true);
    ajax.send();
}

function documentChanges () {
  let data = validateInputData();
  if (data) {
  
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        document.getElementById("notification").innerHTML = ajax.responseText;
        let trackingTime = new Date(data.endDate) - new Date() + 200
        setTimeout(() => {
          checkStatusRequest();
      }, 10000);
        setTimeout(() => {
          checkStatusRequest();
      }, trackingTime);
      }
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



