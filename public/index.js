var mobileResolutions = ['360x640','375x667','414x896','360x780','360x760','414x736'];
var desktopResolutions = ['1366x768','1920x1080','1536x864','1440x900','1280x720','1600x900', '1280x800']
var tabletResolutions = ['768×1024','1280×800','800×1280','601×962','600×1024','1024×1366']

function validateInputData () {
  let url = document.getElementById('url').value;
  let browser = document.getElementById('browsers').value;
  let end = document.getElementById('end').value;
  if (url == "") {
    alert("Enter the url of the page whose changes you want to document!!");
    return false;
  }
  if (end == "") {
    alert("Select the date and time when tracking will be stopped!");
    return false;
  }
  end = new Date(end)  
  if (end <= new Date()) {
    alert("Select future data and time");
    return false;
  }
  let endDateTime = new Date(end);
  let resolution = document.getElementById("resolution");
  let value = resolution.options[resolution.selectedIndex].text;
  let width = value.split("x")[0];
  let height = value.split("x")[1];
  data = {
    url: url,
    browser: browser,
    endDateTime: endDateTime,
    startDate: new Date(),
    width: width,
    height: height
  }
  return data;
}

function setResolutions () {
  let lista = document.getElementById("resolution");
  let size = lista.childElementCount;
  for (let i=size-1; i>=0; i--) 
    document.getElementById('resolution').remove(i)
  if (document.getElementById("mobilePhone").selected) {
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

function readFile (status) {
  if (status.id == 2 || status.id == 5) {
    let img = document.createElement('img');
    img.setAttribute("src", "txticon.png");
    let a = document.createElement('a');
    a.setAttribute("href", "./allFiles/" + status.fileName);
    a.setAttribute("download", status.fileName);
    a.setAttribute("id", "a1")
    document.body.appendChild(a);
    document.getElementById('a1').appendChild(img);
    document.getElementById('download').appendChild(a);
    }
}

function checkStatusRequest () {
  if (!document.getElementById('a1')) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        let status = JSON.parse(ajax.responseText);
        document.getElementById("notification").innerHTML = status.message;  
        if (status.id == 1) {
          document.getElementById("btn1").disabled = true;
          document.getElementById("btn2").disabled = false;
        } else {
          document.getElementById("btn1").disabled = false;
          document.getElementById("btn2").disabled = true;
        }
        readFile(status);    
      }
      if (ajax.readyState == 4 && ajax.status == 404)
        document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
      }
      ajax.open('GET', "http://localhost:8000/checkStatus", true);
      ajax.send();
    }
}

function documentChanges () {
  let data = validateInputData();
  if (document.getElementById('a1')) {
    let a1 = document.getElementById('a1');
    a1.remove();
  }
  if (data) {  
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200) {
        document.getElementById("notification").innerHTML = ajax.responseText;
        setTimeout(() => {
          let status = checkStatusRequest();
        }, 10000);
        let trackingTime = new Date(data.endDateTime) - new Date() +1500;
        setTimeout(async() => {
            checkStatusRequest();
            document.getElementById("btn1").disabled = false;
            document.getElementById("btn2").disabled = true;
        }, trackingTime)
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
    if (ajax.readyState == 4 && ajax.status == 200) {
        let status = JSON.parse(ajax.responseText);
        document.getElementById("notification").innerHTML = status.message;  
        readFile(status);
        document.getElementById("btn1").disabled = false;
        document.getElementById("btn2").disabled = true; 
    }
    if (ajax.readyState == 4 && ajax.status == 404)
      document.getElementById("notification").innerHTML = "Greska: nepoznat URL!";
  }
  ajax.open('GET', "http://localhost:8000/stopTracking", true);
  ajax.send();
}



